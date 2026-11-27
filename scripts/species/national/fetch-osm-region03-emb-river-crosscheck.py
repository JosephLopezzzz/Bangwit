#!/usr/bin/env python3
"""Cross-check Central Luzon EMB river-name leads against OSM waterways."""

from __future__ import annotations

import hashlib
import json
import math
import os
import re
import subprocess
import sys
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from collections import Counter
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[3]
RUN_DATE = "2026-11-27"
RUN_DATE_COMPACT = RUN_DATE.replace("-", "")
OVERPASS_ENDPOINT = "https://overpass-api.de/api/interpreter"
INPUT_REVIEW = Path("data/research/philippines/national/reviews/fao-hydrorivers-region03-emb-roster-prioritization-20261127.json")
INPUT_QUEUE = Path("data/research/philippines/raw/national/fao-hydrorivers-region03-wfs-20261127/emb-roster-nearest-reach-priority-review.jsonl")
RAW_DIR = Path(f"data/research/philippines/raw/national/osm-region03-emb-river-crosscheck-{RUN_DATE_COMPACT}")
RAW_RESPONSE = RAW_DIR / "overpass-response.json"
LOCAL_QUEUE = RAW_DIR / "emb-osm-candidate-crosswalk.jsonl"
REPORT = Path(f"data/research/philippines/national/reviews/osm-region03-emb-river-crosscheck-{RUN_DATE_COMPACT}.json")
EXPECTED_QUEUE_SHA256 = "f13573e4d6692c42ae7c3ab9a550dc11e5e709e7b000525bfef06cbc561ccc52"
# This is the Central Luzon discovery window used by the preceding FAO screen; it includes adjacent areas.
BOUNDING_BOX_WGS84 = (119.735873, 14.357534, 122.292975, 16.559255)  # west, south, east, north
GENERIC_WATER_TERMS = {
    "river", "rivers", "stream", "streams", "creek", "creeks", "brook", "brooks",
    "watercourse", "watercourses", "channel", "channels", "canal", "canals",
    "tributary", "tributaries", "branch", "branches", "fork", "forks",
}
DISTANCE_THRESHOLDS_KM = (1, 5, 10, 25, 50)
EARTH_RADIUS_KM = 6371.0088


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def normalize(value: str | None, *, remove_qualifier: bool = True) -> str:
    if not value:
        return ""
    if remove_qualifier:
        value = re.sub(r"\s*\([^)]*\)", " ", value)
    decomposed = unicodedata.normalize("NFKD", value.casefold())
    ascii_name = "".join(char for char in decomposed if not unicodedata.combining(char))
    tokens = re.findall(r"[a-z0-9]+", ascii_name)
    return " ".join(token for token in tokens if token not in GENERIC_WATER_TERMS)


def escape_posix_ere(value: str) -> str:
    special = set("\\.^$|()[]*+?{}")
    return "".join("\\" + char if char in special else char for char in value)


def write_immutable(path: Path, content: bytes, *, allow_replace: bool = False) -> None:
    if path.exists():
        if path.read_bytes() == content:
            return
        if not allow_replace:
            raise FileExistsError(f"Refusing to overwrite changed research output: {path}")
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    with temporary.open("wb") as output:
        output.write(content)
        output.flush()
        os.fsync(output.fileno())
    temporary.replace(path)


def assert_ignored(relative: Path) -> None:
    if subprocess.run(["git", "check-ignore", "--quiet", relative.as_posix()], cwd=ROOT, check=False).returncode != 0:
        raise RuntimeError(f"Research data path is not Git-ignored: {relative}")


def request_bytes(query: str, attempts: int = 3) -> bytes:
    body = urllib.parse.urlencode({"data": query}).encode("utf-8")
    last_error: Exception | None = None
    for attempt in range(attempts):
        request = urllib.request.Request(
            OVERPASS_ENDPOINT,
            data=body,
            headers={
                "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
                "Accept": "application/json",
                "User-Agent": "Bangwit research source verification/1.0",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=180) as response:
                if response.status != 200:
                    raise RuntimeError(f"Overpass returned HTTP {response.status}")
                return response.read()
        except urllib.error.HTTPError as error:
            detail = error.read().decode("utf-8", errors="replace").strip().replace("\r", " ").replace("\n", " ")
            if error.code < 500 and error.code != 429:
                raise RuntimeError(f"Overpass rejected query with HTTP {error.code}: {detail[:500]}") from error
            last_error = RuntimeError(f"HTTP {error.code}: {detail[:500]}")
        except (urllib.error.URLError, TimeoutError, OSError, RuntimeError) as error:
            last_error = error
        if attempt + 1 < attempts:
            time.sleep(3 * (2**attempt))
    raise RuntimeError(f"Overpass request failed after {attempts} attempts: {last_error}")


def build_query(labels: list[str]) -> str:
    names = sorted({re.sub(r"\s*\([^)]*\)", "", label).strip() for label in labels})
    stems = {
        re.sub(r"\s+(river|stream|creek|channel|watercourse|canal)$", "", name, flags=re.IGNORECASE).strip()
        for name in names
    }
    patterns = [escape_posix_ere(name) for name in names + sorted(stems) if name]
    # Include abbreviated and expanded forms for the source's "Sta. Maria" label as distinct discovery leads.
    if any("sta" in name.casefold() and "maria" in name.casefold() for name in names):
        patterns.extend([r"Sta\.?[[:space:]]*Maria", r"Santa[[:space:]]+Maria"])
    regex = "(" + "|".join(sorted(set(patterns))) + ")"
    west, south, east, north = BOUNDING_BOX_WGS84
    bbox = f"{south},{west},{north},{east}"
    return (
        "[out:json][timeout:180];\n"
        "(\n"
        f"  nwr[\"waterway\"][\"name\"~{json.dumps(regex, ensure_ascii=False)},i]({bbox});\n"
        ");\n"
        "out geom;\n"
    )


def distance_to_element_km(lon: float, lat: float, element: dict[str, Any]) -> float | None:
    sequences: list[list[tuple[float, float]]] = []
    if element.get("type") == "node" and isinstance(element.get("lon"), (int, float)):
        sequences.append([(float(element["lon"]), float(element["lat"]))])
    geometry = element.get("geometry")
    if isinstance(geometry, list):
        points = [(float(row["lon"]), float(row["lat"])) for row in geometry if "lon" in row and "lat" in row]
        if points:
            sequences.append(points)
    for member in element.get("members", []):
        member_geometry = member.get("geometry")
        if isinstance(member_geometry, list):
            points = [(float(row["lon"]), float(row["lat"])) for row in member_geometry if "lon" in row and "lat" in row]
            if points:
                sequences.append(points)
    if not sequences:
        return None

    center_lat = math.radians(lat)
    scale = EARTH_RADIUS_KM * math.pi / 180.0
    px, py = 0.0, 0.0
    distances: list[float] = []
    for sequence in sequences:
        points = [((point_lon - lon) * scale * math.cos(center_lat), (point_lat - lat) * scale) for point_lon, point_lat in sequence]
        if len(points) == 1:
            distances.append(math.hypot(px - points[0][0], py - points[0][1]))
            continue
        for (x1, y1), (x2, y2) in zip(points, points[1:]):
            dx, dy = x2 - x1, y2 - y1
            denominator = dx * dx + dy * dy
            fraction = 0.0 if denominator == 0 else max(0.0, min(1.0, (-(x1 * dx + y1 * dy)) / denominator))
            distances.append(math.hypot(x1 + fraction * dx, y1 + fraction * dy))
    return min(distances) if distances else None


def main() -> int:
    refresh_report = "--refresh-report" in sys.argv[1:]
    assert_ignored(RAW_RESPONSE)
    assert_ignored(LOCAL_QUEUE)
    input_bytes = (ROOT / INPUT_QUEUE).read_bytes()
    input_digest = sha256_bytes(input_bytes)
    if input_digest != EXPECTED_QUEUE_SHA256:
        raise ValueError(f"Pinned EMB/HydroRIVERS queue changed: expected {EXPECTED_QUEUE_SHA256}, got {input_digest}")
    input_rows = [json.loads(line) for line in input_bytes.decode("utf-8").splitlines() if line.strip()]
    if len(input_rows) != 14:
        raise ValueError(f"Expected 14 pinned EMB river labels, got {len(input_rows)}")
    input_review = json.loads((ROOT / INPUT_REVIEW).read_text(encoding="utf-8"))
    labels = [str(row["embReportedRiverLabel"]) for row in input_rows]
    query = build_query(labels)
    response_bytes = (ROOT / RAW_RESPONSE).read_bytes() if (ROOT / RAW_RESPONSE).exists() else request_bytes(query)
    response = json.loads(response_bytes.decode("utf-8"))
    elements = response.get("elements")
    if not isinstance(elements, list):
        raise RuntimeError("Overpass response has no elements array")
    write_immutable(ROOT / RAW_RESPONSE, response_bytes)

    by_key: dict[str, list[dict[str, Any]]] = {}
    for element in elements:
        tags = element.get("tags") or {}
        if tags.get("waterway") and tags.get("name"):
            by_key.setdefault(normalize(str(tags["name"])), []).append(element)

    output_rows = []
    matched_label_count = 0
    candidate_pair_count = 0
    distinct_osm_ids: set[str] = set()
    matched_candidate_ids: set[int] = set()
    label_distance_counts: Counter[str] = Counter()
    pair_distance_counts: Counter[str] = Counter()
    waterway_by_osm_id: dict[str, str] = {}
    for row in input_rows:
        label = str(row["embReportedRiverLabel"])
        label_key = normalize(label)
        elements_for_label = by_key.get(label_key, [])
        matching_features = []
        for element in elements_for_label:
            tags = element.get("tags") or {}
            matching_features.append(
                {
                    "osmElementId": f"{element.get('type')}/{element.get('id')}",
                    "elementType": element.get("type"),
                    "name": tags.get("name"),
                    "waterway": tags.get("waterway"),
                    "version": element.get("version"),
                    "timestamp": element.get("timestamp"),
                }
            )
            element_id = matching_features[-1]["osmElementId"]
            distinct_osm_ids.add(element_id)
            waterway_by_osm_id[element_id] = str(tags.get("waterway"))
        candidate_rows = []
        for candidate in row.get("candidateRows", []):
            nearest_by_distance = []
            for element, feature in zip(elements_for_label, matching_features):
                distance = distance_to_element_km(float(candidate["longitudeWgs84"]), float(candidate["latitudeWgs84"]), element)
                if distance is not None:
                    nearest_by_distance.append({**feature, "distanceKm": round(distance, 3)})
            nearest_by_distance.sort(key=lambda item: (item["distanceKm"], item["osmElementId"]))
            nearest_distance = nearest_by_distance[0]["distanceKm"] if nearest_by_distance else None
            if nearest_by_distance:
                matched_candidate_ids.add(int(candidate["geonameId"]))
                candidate_pair_count += len(nearest_by_distance)
                for threshold in DISTANCE_THRESHOLDS_KM:
                    if nearest_distance <= threshold:
                        label_distance_counts[str(threshold)] += 1
                    pair_distance_counts[str(threshold)] += sum(item["distanceKm"] <= threshold for item in nearest_by_distance)
            candidate_rows.append(
                {
                    "geonameId": int(candidate["geonameId"]),
                    "provincePolygonPointContext": candidate.get("provincePolygonPointContext"),
                    "nearestSameNormalizedNameOsmFeatures": nearest_by_distance,
                    "identityValidated": False,
                }
            )
        if elements_for_label:
            matched_label_count += 1
        output_rows.append(
            {
                "embReportedRiverLabel": label,
                "normalizedBaseName": label_key,
                "sameNameOsmWaterwayFeatures": matching_features,
                "geonamesCandidates": candidate_rows,
                "osmNameFeatureFound": bool(elements_for_label),
                "waterbodyAndReachIdentityValidated": False,
            }
        )

    queue_bytes = "".join(json.dumps(row, ensure_ascii=False, separators=(",", ":")) + "\n" for row in output_rows).encode("utf-8")
    write_immutable(ROOT / LOCAL_QUEUE, queue_bytes)
    assert_ignored(RAW_RESPONSE)
    assert_ignored(LOCAL_QUEUE)
    osm3s = response.get("osm3s") or {}
    type_counts = Counter(str(element.get("type")) for element in elements)
    report = {
        "schemaVersion": 1,
        "reviewId": f"osm-region03-emb-river-crosscheck-{RUN_DATE_COMPACT}",
        "reviewedOn": RUN_DATE,
        "phaseId": "L3",
        "regionId": "0300000000",
        "regionName": "Region III (Central Luzon)",
        "status": "bounded-osm-name-and-distance-screen;community-map-only;identity-pending",
        "sourceIds": ["emb-r3-state-environment-2024", "geonames-ph-country-hydrography-2026-11-07", "osm-region03-emb-river-crosscheck-2026-11-27"],
        "inputs": {
            str(INPUT_REVIEW).replace("\\", "/"): input_review["reviewId"],
            str(INPUT_QUEUE).replace("\\", "/"): {"sha256": input_digest, "rows": len(input_rows)},
        },
        "source": {
            "provider": "OpenStreetMap contributors via Overpass API",
            "endpoint": OVERPASS_ENDPOINT,
            "queryType": "one bounded nwr query for named waterway elements matching the 14 EMB report labels",
            "queryBoundingBoxWgs84": list(BOUNDING_BOX_WGS84),
            "queryBoundsIncludeAdjacentAreas": True,
            "osmDataTimestamp": osm3s.get("timestamp_osm_base"),
            "querySha256": sha256_bytes(query.encode("utf-8")),
            "response": {"path": RAW_RESPONSE.as_posix(), "bytes": len(response_bytes), "sha256": sha256_bytes(response_bytes), "elements": len(elements)},
            "license": "Open Database License 1.0 (ODbL)",
            "copyrightUrl": "https://www.openstreetmap.org/copyright",
        },
        "results": {
            "embLabelsScreened": len(input_rows),
            "labelsWithSameNormalizedOsmBaseNameFeature": matched_label_count,
            "uniqueSameNameOsmElements": len(distinct_osm_ids),
            "returnedElementsByType": dict(sorted(type_counts.items())),
            "candidateGeoNamesRowsWithSameNameOsmGeometry": len(matched_candidate_ids),
            "candidateGeoNamesRowsWithSameNameOsmFeatureWithinKm": dict(sorted(label_distance_counts.items(), key=lambda item: int(item[0]))),
            "candidateFeaturePairsWithinKm": dict(sorted(pair_distance_counts.items(), key=lambda item: int(item[0]))),
            "candidatePairsScreened": candidate_pair_count,
            "distinctSameNameOsmFeaturesByWaterwayTag": dict(sorted(Counter(waterway_by_osm_id.values()).items())),
            "waterbodyIdentitiesValidated": 0,
            "reachIdentitiesValidated": 0,
            "speciesAssertionsAdded": 0,
            "regionAssignmentsAdded": 0,
            "publicGeometryAdded": False,
            "publicationApproval": False,
        },
        "localResearchStorage": {
            "rawDirectory": RAW_DIR.as_posix(),
            "rawDirectoryGitIgnored": True,
            "candidateCrosswalkQueue": LOCAL_QUEUE.as_posix(),
            "candidateCrosswalkRows": len(output_rows),
            "candidateCrosswalkSha256": sha256_bytes(queue_bytes),
            "candidateCrosswalkGitIgnored": True,
            "containsNamesCoordinatesAndProviderIds": True,
        },
        "limitations": [
            "OpenStreetMap is community-mapped with uneven coverage and is not an official hydrographic survey, field verification, or species-occurrence source.",
            "The query uses a broad bounding box that includes adjacent areas; names and nearby lines do not prove that a GeoNames point, OSM feature and EMB monitoring station refer to one reach.",
            "The point-to-line calculation is approximate and inherited from a local equirectangular screen; it is for triage, not survey positioning.",
            "EMB qualifiers remain separate labels; stripping parenthetical text is used only to form a name-search key and does not merge monitoring units.",
            "ODbL terms require attribution and may impose share-alike duties on adapted databases; raw geometries and exact crosswalk rows remain local until a qualified distribution review.",
            "A missing OSM feature is not evidence of a missing watercourse; no species occurrence, fishing access, regulation, water safety or app geometry follows from this screen.",
        ],
        "nextAction": "Use any nearby same-name OSM geometry only to prioritize review against independent primary locality maps or station records; retain all river, reach and species claims as unresolved.",
    }
    report_bytes = (json.dumps(report, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
    write_immutable(ROOT / REPORT, report_bytes, allow_replace=refresh_report)
    print(f"Overpass elements returned: {len(elements)}; EMB labels with same-name OSM features: {matched_label_count}/14")
    print(f"GeoNames candidate rows near same-name OSM geometry: {len(matched_candidate_ids)}; candidate-feature pairs: {candidate_pair_count}")
    print("Validated river/reach identities: 0; species assertions: 0; public geometry: none; publication approval: false")
    print(f"Git-ignored OSM response: {RAW_RESPONSE}")
    print(f"Aggregate report: {REPORT}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
