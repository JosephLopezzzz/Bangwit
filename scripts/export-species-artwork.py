"""Export the approved habitat drawing tiles; never infer occurrence or taxonomy.

Usage: python scripts/export-species-artwork.py --source-dir <approved-originals>
The original atlases/prompts stay outside public/. Only the explicitly mapped,
already-represented taxa below receive derivatives. Unmatched taxa get no image.
"""

import argparse
import hashlib
import io
import json
from pathlib import Path
from xml.sax.saxutils import escape

from PIL import Image

MAPPINGS = [
    ("worms:293639", "Oreochromis niloticus", 1, "Freshwater river", "Ilog-tabang"),
    ("worms:154582", "Cyprinus carpio", 2, "Freshwater lake", "Lawang-tabang"),
    ("worms:280130", "Channa striata", 4, "Vegetated freshwater pool", "Tubig-tabang na may mga halaman"),
    ("worms:218777", "Oreochromis mossambicus", 9, "Brackish lagoon", "Lagunang may maalat-tabang na tubig"),
    ("worms:276970", "Scatophagus argus", 11, "Mangrove estuary", "Estuwaryong may bakawan"),
    ("worms:303762", "Leiognathus equula", 20, "Coastal sandy shallows", "Mababaw na baybaying may buhangin"),
    ("worms:1016224", "Sardinella tawilis", 23, "Freshwater lake", "Lawang-tabang"),
    ("worms:217457", "Anguilla marmorata", 33, "Freshwater river", "Ilog-tabang"),
]


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-dir", required=True, type=Path)
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    destination = root / "public" / "assets" / "species"
    destination.mkdir(parents=True, exist_ok=True)
    registry = root / "src" / "data" / "species-artwork.json"
    previous = json.loads(registry.read_text(encoding="utf-8"))["records"] if registry.exists() else []
    records = []
    for taxon_id, scientific_name, tile, habitat_en, habitat_fil in MAPPINGS:
        atlas_key = "abc"[tile // 16]
        atlas_name = f"atlas-{atlas_key}-habitat-original.png"
        original = args.source_dir / atlas_name
        prompt = (args.source_dir / f"atlas-{atlas_key}-habitat-prompt.txt").read_text(encoding="utf-8")
        image = Image.open(original).convert("RGB")
        if image.size != (1536, 1024):
            raise ValueError(f"Unexpected approved atlas size: {image.size}")
        position = tile % 16
        x, y = (position % 4) * 384, (position // 4) * 256
        derivative = image.crop((x, y, x + 384, y + 256))
        source_hash = sha256(original)
        description = "Approved generated habitat illustration; derivative tile export. " + prompt
        xmp = (
            '<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">'
            '<rdf:Description xmlns:dc="http://purl.org/dc/elements/1.1/">'
            f"<dc:source>{escape(atlas_name + ' sha256:' + source_hash)}</dc:source>"
            f"<dc:description>{escape(description)}</dc:description>"
            "</rdf:Description></rdf:RDF></x:xmpmeta>"
        ).encode("utf-8")
        output = io.BytesIO()
        derivative.save(output, "WEBP", quality=80, method=6, xmp=xmp)
        content = output.getvalue()
        content_hash = hashlib.sha256(content).hexdigest()
        filename = scientific_name.lower().replace(" ", "-") + "." + content_hash[:12] + ".webp"
        target = destination / filename
        target.write_bytes(content)
        # WebP's Impeccable provenance reader uses a JSON sidecar fallback.
        # Keep that portable prompt alongside the embedded XMP provenance.
        target.with_suffix(target.suffix + ".json").write_text(
            json.dumps({"prompt": prompt}, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8", newline="\n",
        )
        records.append({
            "taxonId": taxon_id,
            "scientificName": scientific_name,
            "src": f"/assets/species/{filename}",
            "width": 384,
            "height": 256,
            "alt": {
                "en": f"Illustration of {scientific_name} against a representative habitat background",
                "fil": f"Guhit ng {scientific_name} sa isang kinatawang tirahan",
            },
            "habitat": {"en": habitat_en, "fil": habitat_fil},
            "provenance": {
                "kind": "generated-illustration",
                "sourceAtlas": atlas_name,
                "sourceSha256": source_hash,
                "tile": tile,
                "promptSha256": hashlib.sha256(prompt.encode("utf-8")).hexdigest(),
                "derivativeSha256": sha256(target),
                "bytes": target.stat().st_size,
                "reviewStatus": "approved-visual-reference-not-identification-evidence",
            },
        })
    registry.write_text(json.dumps({"schemaVersion": 1, "records": records}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    current_names = {Path(record["src"]).name for record in records}
    for record in previous:
        old_file = destination / Path(record["src"]).name
        if old_file.name not in current_names and old_file.resolve().parent == destination.resolve() and old_file.is_file():
            old_file.unlink()
            old_sidecar = old_file.with_suffix(old_file.suffix + ".json")
            if old_sidecar.is_file():
                old_sidecar.unlink()
    print(f"Exported {len(records)} approved derivatives, {sum(r['provenance']['bytes'] for r in records):,} bytes.")


if __name__ == "__main__":
    main()
