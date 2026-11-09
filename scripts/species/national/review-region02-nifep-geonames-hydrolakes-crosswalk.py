#!/usr/bin/env python3
"""Cross-check Region II NIFEP waterbody name leads against local gazetteer candidates."""

from __future__ import annotations

import hashlib
import json
import math
import re
import unicodedata
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[3]
INVENTORY = Path("data/research/philippines/national-freshwater-region02-inland-water-source-inventory-20261106.json")
GEONAMES = Path("data/research/philippines/raw/national/geonames-ph-20261107/hydrographic-candidates.jsonl")
ADMIN_OVERLAY = Path("data/research/philippines/raw/national/geonames-ph-20261107/point-admin-overlay-review.jsonl")
HYDROLAKES = Path("data/research/philippines/raw/national/hydrolakes-philippines-v1-waterbody-candidates.jsonl")
RAW_OUTPUT = Path("data/research/philippines/raw/national/geonames-region02-nifep-hydrolakes-crosswalk-20261109.jsonl")
RUN_DATE = datetime.now(timezone.utc).date().isoformat()
RUN_DATE_COMPACT = RUN_DATE.replace("-", "")
REPORT = Path(f"data/research/philippines/national/reviews/geonames-hydrolakes-region02-nifep-crosswalk-{RUN_DATE_COMPACT}.json")

GENERIC_WATER_WORDS = {"lake", "lakes", "reservoir", "reservoirs", "swip", "river", "creek", "stream", "dam"}
STREAM_WORDS = {"river", "creek", "stream", "brook", "tributary"}

# Variant relationships preserve the source's uncertainty; they are search hints, not identity decisions.
SEARCH_VARIANTS: dict[str, list[dict[str, str]]] = {
    "Quirino Reservoir": [{"name": "Quirino Reservoir", "relationship": "inventory-spelling"}],
    "Bangagalo Lake": [
        {"name": "Bangagalo Lake", "relationship": "inventory-spelling"},
        {"name": "Bangalao Lake", "relationship": "source-reviewed-name-variant"},
        {"name": "Laguna de Cagayan Lake", "relationship": "source-reviewed-historical-alias"},
        {"name": "Laguna de Cagayan", "relationship": "source-reviewed-historical-alias"},
    ],
    "Agani SWIP": [{"name": "Agani SWIP", "relationship": "inventory-spelling"}],
    "Liwan Norte SWIP": [{"name": "Liwan Norte SWIP", "relationship": "inventory-spelling"}],
    "Casili Lake": [
        {"name": "Casili Lake", "relationship": "inventory-spelling"},
        {"name": "Lake Cassily", "relationship": "plausible-locality-and-spelling-lead-unresolved"},
        {"name": "Cassily Lake", "relationship": "plausible-locality-and-spelling-lead-unresolved"},
    ],
    "Bayolake": [
        {"name": "Bayolake", "relationship": "inventory-spelling"},
        {"name": "Lake Bayo", "relationship": "source-reported-name-variant"},
        {"name": "Bayo Lake", "relationship": "source-reported-name-variant"},
    ],
    "Ulong-ulong SWIP": [{"name": "Ulong-ulong SWIP", "relationship": "inventory-spelling"}],
    "Aneg SWIP": [{"name": "Aneg SWIP", "relationship": "inventory-spelling"}],
    "Cabannungan-Arrosip SWIP": [{"name": "Cabannungan-Arrosip SWIP", "relationship": "inventory-spelling"}],
    "Quirino General High School Reservoir": [
        {"name": "Quirino General High School Reservoir", "relationship": "inventory-spelling"}
    ],
    "Baculod SWIP": [{"name": "Baculod SWIP", "relationship": "inventory-spelling"}],
    "San Mariano Sur SWIP": [{"name": "San Mariano Sur SWIP", "relationship": "inventory-spelling"}],
    "Piat Lake": [
        {"name": "Piat Lake", "relationship": "inventory-spelling"},
        {"name": "Mapannao Lake", "relationship": "unresolved-site-comparison-not-assumed-alias"},
        {"name": "Mapannao", "relationship": "unresolved-site-comparison-not-assumed-alias"},
    ],
}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def normalize(value: str | None) -> str:
    if not value:
        return ""
    folded = unicodedata.normalize("NFKD", value)
    ascii_text = "".join(char for char in folded if not unicodedata.combining(char))
    return " ".join(re.findall(r"[a-z0-9]+", ascii_text.casefold()))


def base_name(value: str | None) -> str:
    tokens = normalize(value).split()
    return " ".join(token for token in tokens if token not in GENERIC_WATER_WORDS)


def named_water_type(value: str | None, lead_class: str | None = None) -> str | None:
    tokens = set(normalize(value).split())
    if tokens & {"lake", "lakes"}:
        return "lake"
    if tokens & {"reservoir", "reservoirs", "dam"}:
        return "reservoir"
    if "swip" in tokens or (lead_class and "impounding" in lead_class.casefold()):
        return "swip"
    if tokens & STREAM_WORDS:
        return "stream"
    if lead_class:
        normalized_class = lead_class.casefold()
        if "lake" in normalized_class:
            return "lake"
        if "reservoir" in normalized_class:
            return "reservoir"
    return None


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    with path.open("r", encoding="utf-8") as stream:
        for line_number, line in enumerate(stream, start=1):
            if line.strip():
                value = json.loads(line)
                if not isinstance(value, dict):
                    raise ValueError(f"Expected JSON object at {path}:{line_number}")
                rows.append(value)
    return rows


def parse_alt_names(value: Any) -> list[str]:
    if not isinstance(value, str):
        return []
    return [item.strip() for item in value.split(",") if item.strip()]


def haversine_km(lat_a: float, lon_a: float, lat_b: float, lon_b: float) -> float:
    radius_km = 6371.0088
    phi_a, phi_b = math.radians(lat_a), math.radians(lat_b)
    delta_phi = math.radians(lat_b - lat_a)
    delta_lambda = math.radians(lon_b - lon_a)
    value = math.sin(delta_phi / 2) ** 2 + math.cos(phi_a) * math.cos(phi_b) * math.sin(delta_lambda / 2) ** 2
    return 2 * radius_km * math.asin(math.sqrt(min(1.0, value)))


def lead_context(inventory_rows: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
    return {str(row["name"]): row for row in inventory_rows}


def expected_province(locality: str) -> str:
    parts = [part.strip() for part in locality.split(",")]
    return parts[-1] if parts else ""


def main() -> int:
    required = [INVENTORY, GEONAMES, ADMIN_OVERLAY, HYDROLAKES]
    missing = [str(path) for path in required if not (ROOT / path).is_file()]
    if missing:
        raise FileNotFoundError("Missing local inputs: " + ", ".join(missing))

    inventory = json.loads((ROOT / INVENTORY).read_text(encoding="utf-8"))
    waterbody_leads = inventory.get("namedNifepWaterbodyLeads")
    if not isinstance(waterbody_leads, list) or len(waterbody_leads) != 13:
        raise ValueError("Expected the 13 source-reported Region II NIFEP waterbody leads")
    lead_by_name = lead_context(waterbody_leads)
    if set(lead_by_name) != set(SEARCH_VARIANTS):
        raise ValueError("Search variant list does not match inventory lead names")

    geonames_rows = read_jsonl(ROOT / GEONAMES)
    overlay_rows = read_jsonl(ROOT / ADMIN_OVERLAY)
    hydrolakes_rows = read_jsonl(ROOT / HYDROLAKES)
    overlay_by_id = {str(row.get("geonameId")): row for row in overlay_rows}

    hydrolakes_names: dict[str, list[dict[str, Any]]] = {}
    for row in hydrolakes_rows:
        if row.get("lakeName"):
            key = base_name(row["lakeName"])
            if key:
                hydrolakes_names.setdefault(key, []).append(row)

    outputs: list[dict[str, Any]] = []
    for lead_name, variants in SEARCH_VARIANTS.items():
        lead = lead_by_name[lead_name]
        variant_norms = {normalize(item["name"]): item for item in variants}
        variant_bases = {base_name(item["name"]): item for item in variants if base_name(item["name"])}
        geonames_matches: dict[str, dict[str, Any]] = {}
        geonames_type_collisions: dict[str, dict[str, Any]] = {}
        for feature in geonames_rows:
            labels = [feature.get("name"), feature.get("asciiName"), *parse_alt_names(feature.get("alternateNames"))]
            for label in filter(None, labels):
                relationship = variant_norms.get(normalize(label))
                basis = "normalized-full-name" if relationship else None
                if relationship is None and base_name(label):
                    relationship = variant_bases.get(base_name(label))
                    if relationship:
                        candidate_type = named_water_type(relationship["name"], lead["waterbodyClassReported"])
                        feature_type = named_water_type(label)
                        if candidate_type and feature_type and candidate_type != feature_type:
                            basis = "same-base-name-different-explicit-water-type"
                        else:
                            basis = "same-base-name-type-compatible-or-unspecified"
                if relationship is None:
                    continue

                geoname_id = str(feature.get("geonameId"))
                overlay = overlay_by_id.get(geoname_id, {})
                target = geonames_type_collisions if basis == "same-base-name-different-explicit-water-type" else geonames_matches
                match = target.setdefault(
                    geoname_id,
                    {
                        "geonameId": feature.get("geonameId"),
                        "name": feature.get("name"),
                        "asciiName": feature.get("asciiName"),
                        "matchedLabels": [],
                        "screenClass": "type-collision-only" if target is geonames_type_collisions else "name-candidate",
                        "featureClass": feature.get("featureClass"),
                        "featureCode": feature.get("featureCode"),
                        "sourceAdmin2Code": feature.get("admin2Code"),
                        "sourceAdmin3Code": feature.get("admin3Code"),
                        "overlayProvinceNameCandidate": overlay.get("singlePolygonNameCandidate"),
                        "overlayStatus": overlay.get("coarseOverlayStatus"),
                        "latitudeWgs84": float(feature["latitudeWgs84"]),
                        "longitudeWgs84": float(feature["longitudeWgs84"]),
                    },
                )
                label_record = {
                    "matchedSourceLabel": label,
                    "searchVariant": relationship["name"],
                    "variantRelationship": relationship["relationship"],
                    "matchBasis": basis,
                }
                if label_record not in match["matchedLabels"]:
                    match["matchedLabels"].append(label_record)

        # An explicit conflicting water-type label wins over a bare alternate label for the same feature.
        for geoname_id in set(geonames_matches) & set(geonames_type_collisions):
            collision = geonames_type_collisions[geoname_id]
            for label_record in geonames_matches[geoname_id]["matchedLabels"]:
                if label_record not in collision["matchedLabels"]:
                    collision["matchedLabels"].append(label_record)
            del geonames_matches[geoname_id]

        hydro_matches: dict[int, dict[str, Any]] = {}
        lead_type = named_water_type(lead_name, lead["waterbodyClassReported"])
        for variant in variants:
            if lead_type not in {"lake", "reservoir"}:
                continue
            key_options = list(dict.fromkeys([normalize(variant["name"]), base_name(variant["name"])]))
            for key in filter(None, key_options):
                for lake in hydrolakes_names.get(key, []):
                    lake_id = int(lake["hylakId"])
                    hydro_matches.setdefault(lake_id, {
                        "hydrolakesId": lake_id,
                        "lakeName": lake.get("lakeName"),
                        "lakeTypeCode": lake.get("lakeTypeCode"),
                        "lakeAreaKm2": lake.get("lakeAreaKm2"),
                        "pourPointWgs84": lake.get("pourPointWgs84"),
                        "matchedSearchVariant": variant["name"],
                        "variantRelationship": variant["relationship"],
                        "candidateOnly": True,
                    })

        for match in geonames_matches.values():
            province = match.get("overlayProvinceNameCandidate")
            match["expectedProvinceNameContextMatches"] = normalize(province) == normalize(expected_province(lead["locality"]))
            distances = []
            for lake in hydrolakes_rows:
                point = lake.get("pourPointWgs84") or {}
                if point.get("latitude") is None or point.get("longitude") is None:
                    continue
                distance = haversine_km(
                    match["latitudeWgs84"],
                    match["longitudeWgs84"],
                    float(point["latitude"]),
                    float(point["longitude"]),
                )
                distances.append((distance, lake))
            if distances:
                distance, closest = min(distances, key=lambda item: (item[0], int(item[1]["hylakId"])))
                if distance <= 10:
                    match["nearestHydrolakesOutletScreen"] = {
                        "hydrolakesId": closest.get("hylakId"),
                        "lakeName": closest.get("lakeName"),
                        "distanceKm": round(distance, 3),
                        "pourPointOnly": True,
                        "interpretation": "Proximity is a screening clue only; the gazetteer point and HydroLAKES outlet do not establish waterbody identity.",
                    }
        for collision in geonames_type_collisions.values():
            province = collision.get("overlayProvinceNameCandidate")
            collision["expectedProvinceNameContextMatches"] = normalize(province) == normalize(expected_province(lead["locality"]))

        outputs.append(
            {
                "inventoryLead": lead,
                "searchVariants": variants,
                "geonamesNameMatches": sorted(geonames_matches.values(), key=lambda item: (item["geonameId"] or 0)),
                "geonamesTypeCollisions": sorted(geonames_type_collisions.values(), key=lambda item: (item["geonameId"] or 0)),
                "hydrolakesNameMatches": [hydro_matches[key] for key in sorted(hydro_matches)],
                "candidateOnly": True,
                "identityValidated": False,
                "speciesAssertions": False,
                "geometryAdded": False,
                "publicationApproval": False,
            }
        )

    raw_path = ROOT / RAW_OUTPUT
    raw_path.parent.mkdir(parents=True, exist_ok=True)
    with raw_path.open("w", encoding="utf-8", newline="\n") as stream:
        for row in outputs:
            stream.write(json.dumps(row, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n")

    leads_with_geonames = sum(bool(row["geonamesNameMatches"]) for row in outputs)
    geonames_match_count = sum(len(row["geonamesNameMatches"]) for row in outputs)
    province_context_match_count = sum(
        1
        for row in outputs
        for feature in row["geonamesNameMatches"]
        if feature.get("expectedProvinceNameContextMatches")
    )
    leads_with_hydrolakes = sum(bool(row["hydrolakesNameMatches"]) for row in outputs)
    hydrolakes_match_count = sum(len(row["hydrolakesNameMatches"]) for row in outputs)
    type_collision_count = sum(len(row["geonamesTypeCollisions"]) for row in outputs)
    leads_with_type_collisions = sum(bool(row["geonamesTypeCollisions"]) for row in outputs)
    nearest_outlet_count = sum(
        "nearestHydrolakesOutletScreen" in feature
        for row in outputs
        for feature in row["geonamesNameMatches"]
    )

    report = {
        "schemaVersion": 1,
        "reviewId": f"geonames-hydrolakes-region02-nifep-crosswalk-{RUN_DATE_COMPACT}",
        "generatedOn": RUN_DATE,
        "status": "region02-nifep-name-crosswalk-screened;candidate-only;no-identity-or-species-assertions",
        "purpose": "Screen 13 BFAR Region II NIFEP named lake/reservoir/SWIP leads against already downloaded GeoNames hydrographic names/points and HydroLAKES v1 name/outlet candidates.",
        "sourceSnapshots": {
            "regionalInventory": {"path": INVENTORY.as_posix(), "sha256": sha256(ROOT / INVENTORY)},
            "geoNames": {
                "path": GEONAMES.as_posix(),
                "sha256": sha256(ROOT / GEONAMES),
                "reviewArtifact": "geonames-ph-hydrography-extract-20261107.json",
            },
            "geoNamesAdminOverlay": {"path": ADMIN_OVERLAY.as_posix(), "sha256": sha256(ROOT / ADMIN_OVERLAY)},
            "hydroLakes": {
                "path": HYDROLAKES.as_posix(),
                "sha256": sha256(ROOT / HYDROLAKES),
                "reviewArtifact": "hydrolakes-philippines-candidate-extract-20261107.json",
            },
        },
        "searchMethod": {
            "regionalLeadCount": len(outputs),
            "matchRules": [
                "Case/diacritic/punctuation-normalized whole-name equality across GeoNames primary and alternate labels.",
                "Base-name equality with compatible or unspecified feature type is retained as a weaker name candidate; explicit lake/river/stream/reservoir/SWIP type conflicts are reported separately.",
                "Curated source spelling and alias variants retain their explicit relationship status; unresolved variants are not treated as aliases.",
                "Province overlay context and nearest HydroLAKES pour-point distances are triage only, never identity evidence.",
            ],
            "geonamesCandidateFeatureCount": len(geonames_rows),
            "hydrolakesCandidateCount": len(hydrolakes_rows),
            "nearestOutletThresholdKm": 10,
        },
        "summary": {
            "leadsWithGeonamesNameMatches": leads_with_geonames,
            "geonamesNameFeatureMatches": geonames_match_count,
            "matchesInExpectedProvinceContext": province_context_match_count,
            "differentWaterTypeNameCollisions": type_collision_count,
            "leadsWithDifferentWaterTypeNameCollisions": leads_with_type_collisions,
            "leadsWithHydrolakesNameMatches": leads_with_hydrolakes,
            "hydrolakesNameMatches": hydrolakes_match_count,
            "geonamesMatchesWithHydrolakesOutletWithin10Km": nearest_outlet_count,
            "waterbodyIdentitiesValidated": 0,
            "speciesAssertions": 0,
            "publicGeometryAdded": False,
            "publicationApproval": False,
        },
        "localOutput": {
            "path": RAW_OUTPUT.as_posix(),
            "rows": len(outputs),
            "sha256": sha256(raw_path),
            "gitIgnored": True,
            "appBundleIncluded": False,
        },
        "limitations": [
            "This is a source-name and point crosswalk for a limited BFAR NIFEP lead list, not a complete Region II lake/reservoir/SWIP inventory.",
            "GeoNames points can identify settlements, landmarks, or generalized features and do not provide shorelines; HydroLAKES pour points are outlets, not lake centers or polygons.",
            "HydroLAKES v1 targets waterbodies at least 10 hectares and may include reservoirs; it omits river and wetland polygons and has only a small number of named Philippine rows.",
            "The same spelling, nearby point, province context, or HydroLAKES type code does not confirm a waterbody identity, project status, fish presence, access, or legal boundary.",
            "Missing name matches are not evidence that a feature or species is absent.",
            "Prior source reviews identify unresolved Casili/Cassily identity and Piat/Mapannao identity; these remain unresolved here.",
            "No occurrence, species, habitat, salinity, diet, catchability, legal, safety, or public-app claim is made.",
        ],
    }
    report_path = ROOT / REPORT
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Screened {len(outputs)} Region II NIFEP leads")
    print(f"GeoNames name matches: {geonames_match_count} across {leads_with_geonames} leads")
    print(f"GeoNames same-name collisions with different explicit water type: {type_collision_count} across {leads_with_type_collisions} leads")
    print(f"HydroLAKES name matches: {hydrolakes_match_count} across {leads_with_hydrolakes} leads")
    print(f"Wrote {REPORT.as_posix()}")
    print(f"Exact rows remain in ignored {RAW_OUTPUT.as_posix()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
