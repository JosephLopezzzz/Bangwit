/**
 * Public species-photo registry contract. Only rights-cleared, locally stored
 * images with a source-specific identification review belong here.
 */
export type SpeciesImageRecord = {
  /** A stable accepted-name key, preferably a verified taxon identifier. */
  taxonKey: string;
  taxonName: string;
  taxonomicAuthority: {
    name: string;
    url: string;
    checkedOn: string;
  };
  /** Curated files stay same-origin and outside the app's install precache. */
  src: `/assets/species/${string}`;
  /** Describe visible traits and view; do not repeat the nearby species heading. */
  alt: string;
  media: {
    title: string;
    creator?: string;
    sourceUrl: string;
    capturedOn?: string;
    specimenOrMediaId?: string;
  };
  rights: {
    status: "cleared";
    label: string;
    url?: string;
    /** Internal review reference; never expose a private permission letter. */
    evidenceRef: string;
    commercialUseAllowed: boolean;
    adaptationsAllowed: boolean;
    shareAlikeRequired?: boolean;
  };
  identification: {
    sourceTitle: string;
    sourceUrl: string;
    reviewedOn: string;
  };
};

/**
 * Key by a stable authority identifier so common-name changes do not break
 * the image link. Only cleared, locally stored references belong here.
 */
export const speciesImageRegistry = {
  "worms:293639": {
    taxonKey: "worms:293639",
    taxonName: "Oreochromis niloticus",
    taxonomicAuthority: {
      name: "World Register of Marine Species",
      url: "https://www.marinespecies.org/aphia.php?p=taxdetails&id=293639",
      checkedOn: "2026-11-11",
    },
    src: "/assets/species/oreochromis-niloticus-commons-925316833.jpg",
    alt: "Side view of a deep-bodied fish with silver-gray scales, dark fin markings, and a pale underside against a light background.",
    media: {
      title: "Oreochromis niloticus, Northern Nile Delta, Egypt",
      creator: "Magdy A. Saleh",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Oreochromis_niloticus_Egypt.jpg?oldid=925316833",
      specimenOrMediaId: "Wikimedia Commons revision 925316833; FishBase image autoctr 13729",
    },
    rights: {
      status: "cleared",
      label: "CC BY 3.0",
      url: "https://creativecommons.org/licenses/by/3.0/",
      evidenceRef: "docs/SPECIES_IMAGE_STANDARD.md#approved-image-review-oreochromis-niloticus",
      commercialUseAllowed: true,
      adaptationsAllowed: true,
    },
    identification: {
      sourceTitle: "FishBase image record 13729",
      sourceUrl: "https://www.fishbase.se/photos/UploadedBy.php?autoctr=13729&win=uploaded",
      reviewedOn: "2026-11-11",
    },
  },
  "worms:280130": {
    taxonKey: "worms:280130",
    taxonName: "Channa striata",
    taxonomicAuthority: {
      name: "World Register of Marine Species",
      url: "https://www.marinespecies.org/aphia.php?p=taxdetails&id=280130",
      checkedOn: "2026-11-11",
    },
    src: "/assets/species/channa-striata-bedo-commons-854138233.jpg",
    alt: "Side view of a long-bodied fish with a mottled gray back, rounded head, long dorsal fin, and reddish pectoral fin in an aquarium.",
    media: {
      title: "Channa striata",
      creator: "BEDO (Thailand)",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Channa_striata.jpg?oldid=854138233",
      specimenOrMediaId: "Wikimedia Commons revision 854138233",
    },
    rights: {
      status: "cleared",
      label: "CC BY-SA 4.0",
      url: "https://creativecommons.org/licenses/by-sa/4.0/",
      evidenceRef: "docs/SPECIES_IMAGE_STANDARD.md#approved-image-review-channa-striata",
      commercialUseAllowed: true,
      adaptationsAllowed: true,
      shareAlikeRequired: true,
    },
    identification: {
      sourceTitle: "BEDO species-labeled photo record",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Channa_striata.jpg?oldid=854138233",
      reviewedOn: "2026-11-11",
    },
  },
  "worms:212280": {
    taxonKey: "worms:212280",
    taxonName: "Stolephorus indicus",
    taxonomicAuthority: {
      name: "World Register of Marine Species",
      url: "https://www.marinespecies.org/aphia.php?p=taxdetails&id=212280",
      checkedOn: "2026-11-11",
    },
    src: "/assets/species/stolephorus-indicus-bedo-commons-942888770.jpg",
    alt: "Side view of a slender silver anchovy with a bright reflective stripe, pale belly, and blue background.",
    media: {
      title: "Stolephorus indicus",
      creator: "BEDO (Thailand)",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Stolephorus_indicus.jpg?oldid=942888770",
      specimenOrMediaId: "Wikimedia Commons revision 942888770",
    },
    rights: {
      status: "cleared",
      label: "CC BY-SA 4.0",
      url: "https://creativecommons.org/licenses/by-sa/4.0/",
      evidenceRef: "docs/SPECIES_IMAGE_STANDARD.md#approved-image-review-stolephorus-indicus",
      commercialUseAllowed: true,
      adaptationsAllowed: true,
      shareAlikeRequired: true,
    },
    identification: {
      sourceTitle: "BEDO species-labeled photo record",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Stolephorus_indicus.jpg?oldid=942888770",
      reviewedOn: "2026-11-11",
    },
  },
  "worms:1016224": {
    taxonKey: "worms:1016224",
    taxonName: "Sardinella tawilis",
    taxonomicAuthority: {
      name: "World Register of Marine Species",
      url: "https://www.marinespecies.org/aphia.php?p=taxdetails&id=1016224",
      checkedOn: "2026-11-11",
    },
    src: "/assets/species/sardinella-tawilis-nfrdi-commons-1184849116.png",
    alt: "Side view of a silvery fish with reflective scales and a forked tail, shown above a centimeter ruler on a pale background.",
    media: {
      title: "Sardinella tawilis",
      creator: "NFRDI-NFBC",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Sardinella_tawilis.png?oldid=1184849116",
      specimenOrMediaId: "Wikimedia Commons revision 1184849116; sourced from the FishBase tawilis photo gallery",
    },
    rights: {
      status: "cleared",
      label: "CC BY 3.0",
      url: "https://creativecommons.org/licenses/by/3.0/",
      evidenceRef: "docs/SPECIES_IMAGE_STANDARD.md#approved-image-review-sardinella-tawilis",
      commercialUseAllowed: true,
      adaptationsAllowed: true,
    },
    identification: {
      sourceTitle: "NFRDI-NFBC species-labelled photo record",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Sardinella_tawilis.png?oldid=1184849116",
      reviewedOn: "2026-11-11",
    },
  },
  "worms:218641": {
    taxonKey: "worms:218641",
    taxonName: "Otolithes ruber",
    taxonomicAuthority: {
      name: "World Register of Marine Species",
      url: "https://www.marinespecies.org/aphia.php?p=taxdetails&id=218641",
      checkedOn: "2026-11-11",
    },
    src: "/assets/species/otolithes-ruber-tran-commons-1122106262.jpg",
    alt: "Side view of a pale silver fish with a large eye, elongated body, and long dorsal and tail fins against a black background.",
    media: {
      title: "Silver Teraglin, Otolithes ruber",
      creator: "Dinh D. Tran",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:OtolithRuberDinhDTran.jpg?oldid=1122106262",
      specimenOrMediaId: "Wikimedia Commons revision 1122106262",
    },
    rights: {
      status: "cleared",
      label: "CC BY 3.0",
      url: "https://creativecommons.org/licenses/by/3.0/",
      evidenceRef: "docs/SPECIES_IMAGE_STANDARD.md#approved-image-review-otolithes-ruber",
      commercialUseAllowed: true,
      adaptationsAllowed: true,
    },
    identification: {
      sourceTitle: "Fishes of Australia species 670",
      sourceUrl: "https://fishesofaustralia.net.au/home/species/670",
      reviewedOn: "2026-11-11",
    },
  },
  "worms:1006861": {
    taxonKey: "worms:1006861",
    taxonName: "Stiphodon palawanensis",
    taxonomicAuthority: {
      name: "World Register of Marine Species",
      url: "https://www.marinespecies.org/aphia.php?p=taxdetails&id=1006861",
      checkedOn: "2026-11-12",
    },
    src: "/assets/species/stiphodon-palawanensis-maeda-palla-2015-fig5d.jpg",
    alt: "Side view of a pale-brown goby on a stream rock, with dark bars along the body and dark spots on the dorsal fin.",
    media: {
      title: "Maeda & Palla 2015, Figure 5d; cropped panel of a live male",
      sourceUrl: "https://www.mapress.com/zt/article/download/zootaxa.4018.3.3/37431/38815",
      specimenOrMediaId: "Figure 5d; live male observed at Barake Stream, Aborlan, 15 May 2015. Original multi-panel image preserved at data/research/philippines/national/reviews/stiphodon-palawanensis-maeda-palla-fig5-original-2015.jpg",
    },
    rights: {
      status: "cleared",
      label: "CC BY 3.0 (panel d crop)",
      url: "https://creativecommons.org/licenses/by/3.0/",
      evidenceRef: "docs/SPECIES_IMAGE_STANDARD.md#approved-image-review-stiphodon-palawanensis",
      commercialUseAllowed: true,
      adaptationsAllowed: true,
    },
    identification: {
      sourceTitle: "Maeda & Palla 2015, Figure 5 caption",
      sourceUrl: "https://www.mapress.com/zt/article/download/zootaxa.4018.3.3/37431/38815",
      reviewedOn: "2026-11-12",
    },
  },
} satisfies Record<string, SpeciesImageRecord>;
