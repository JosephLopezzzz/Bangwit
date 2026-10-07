import type { Dictionary } from "../types";

export const filDictionary: Dictionary = {
  common: {
    appName: "Bangwit",
    tagline: "Bawat huli, may kuwento.",
    save: "I-save",
    saving: "Sine-save…",
    cancel: "Kanselahin",
    close: "Isara",
    skip: "Skip muna",
    next: "Next",
    back: "Back",
    done: "Tapos na",
    delete: "Burahin",
    edit: "I-edit",
    error: "May naganap na error",
    optional: "opsyonal",
    privateDeviceOnly: "Pribado · sa device lang",
    deviceOnlyStorage: "Device-only storage",
    offlineSaved: "Naka-save lang sa device mo",
    language: "Wika",
    theme: "Tema",
    light: "Light",
    dark: "Dark",
  },
  nav: {
    explore: "Explore",
    species: "Species",
    myCatches: "My Catches",
    mySpecies: "My Species",
    settings: "Settings",
    openGuide: "Buksan ang Bangwit guide",
    mainMenu: "Pangunahing menu",
    menuButton: "Menu",
  },
  policy: {
    tag: "Prototype access",
    title: "Privacy Notice at Terms of Use",
    desc: "Basahin muna ang Privacy Notice, kasunod ang Terms of Use bago magpatuloy.",
    readToContinue: "I-scroll hanggang dulo ang pinagsamang policy para ma-enable ang checkbox.",
    readComplete: "Nakarating ka na sa dulo. Maaari mo nang i-check ang kahon.",
    summaryTitle: "Mahahalagang limitasyon ng prototype",
    summaryText:
      "Hindi pa verified ang species coverage, fishing rules, boundaries, weather alerts, o food-safety guidance. Huwag gamitin ito para magpasya kung legal o ligtas mangisda o kung ligtas kainin ang huli.",
    agreeCheckbox:
      "Sumasang-ayon ako sa Privacy Notice at Terms of Use para sa prototype, at nauunawaan kong sa device lang na ito naka-save ang data ko.",
    agreeBtn: "Sumang-ayon at magpatuloy",
    disclaimer:
      "Draft ito para sa prototype. Kailangan ng policy review bago public launch. Hindi ito pahintulot para mag-upload ng data sa cloud.",
    selectLanguage: "Pumili ng wika / Select language",
  },
  onboarding: {
    tagFirst: "Mabilis na setup · puwedeng i-skip",
    tagEdit: "Preferences",
    title: "Kumusta, mangingisda!",
    desc: "Iangkop ang Bangwit sa paraan mo ng pangingisda. Mananatili sa device ang preferences sa prototype.",
    fisherTypeLabel: "Ano ang pinakamalapit sa iyo?",
    preferredWaterLabel: "Saan ka madalas mangisda?",
    skipBtn: "Skip muna",
    closeBtn: "Isara",
    continueBtn: "Ituloy",
    saveBtn: "I-save",
    types: {
      exploring: "Nag-e-explore pa lang",
      angler: "Recreational angler",
      livelihood: "Mangingisdang pangkabuhayan",
      both: "Pareho",
    },
    waters: {
      any: "Wala pang preference",
      saltwater: "Dagat o baybayin",
      freshwater: "Ilog o lawa",
      brackish: "Brackish o estuary",
    },
  },
  tour: {
    header: "Gabay sa Bangwit",
    stepCount: "Hakbang",
    steps: [
      {
        title: "Pumili muna ng lugar",
        text: "Pumili ng Cavite fishing ground. Ipapakita ng Bangwit ang verified na records kapag handa na ang lokal na data.",
      },
      {
        title: "Basahin ang status at coverage",
        text: "Paghiwalayin ang naitalang species, legal na rules, at personal mong huli. Kapag kulang ang datos, malinaw itong sasabihin.",
      },
      {
        title: "I-log ang huli mo",
        text: "Kapag bukas na ang journal, mase-save ang tala sa device kahit offline. Wala pang cloud sync at hindi kinukuha ang GPS.",
      },
      {
        title: "Buuin ang My Species",
        text: "Ang identified species sa personal mong catch log ang magbubukas ng collection card.",
      },
    ],
  },
  home: {
    tag: "Cavite · CALABARZON",
    pilotBadge: "Hindi pa verified ang local records",
    title: "Saan tayo mangingisda?",
    subtitle: "Pumili ng lugar at alamin ang katubigan ng Cavite.",
    safetyTag: "Bago bumiyahe",
    safetyTitle: "Safety at advisories",
    safetyStatus: "Hindi live",
    safetyDesc:
      "Wala pang live na PAGASA weather/flood feed o BFAR shellfish bulletin. Hindi ito nangangahulugang walang babala o ligtas bumiyahe; tingnan muna ang opisyal na abiso para sa napiling lugar.",
    pagasaLink: "PAGASA advisories",
    bfarLink: "BFAR red tide",
    ctaTitle: "Simulan ang kuwento ng mga huli mo",
    ctaDesc: "Kapag bukas na ang journal, mase-save ang catch sa device kahit walang signal.",
    ctaBtn: "Buksan ang My Catches",
    mascotAlt: "Si Bangwit, mabagal na lumalangoy pakanan.",
    footerLeft: "Bangwit prototype · Cavite pilot",
    footerRight: "Hindi pa verified ang map boundaries, species, rules, at live alerts.",
  },
  areaExplorer: {
    heading: "Explore Cavite waters",
    selectAreaLabel: "Pumili ng lugar",
    mapIllustrationNote: "Illustration lang · hindi para sa navigation",
    mapDescription:
      "Illustrated overview ng Manila Bay, Bacoor Bay at Cañacao Bay sa baybayin ng Cavite. Tinatayang lokasyon lang ang ipinapakita.",
    mapUnavailable: "Hindi maipakita ang mapa. Maaari ka pa ring pumili ng lugar sa listahan.",
    zoomIn: "Palakihin ang illustration",
    zoomOut: "Paliitin ang illustration",
    resetMap: "Ibalik ang buong mapa",
    sideTag: "Pumili ng lugar",
    sideHeading: "Saan mo gustong mag-explore?",
    sideDesc:
      "Pumili ng Cavite fishing ground. Hindi pa ipinapakita ang species o legal recommendations hangga’t hindi beripikado ang lokal na data.",
    pendingReviewTitle: "Wala pang verified local records",
    pendingReviewDesc:
      "Wala pang species data at fishing rules para sa lugar na ito. Hindi nito sinasabi kung legal o ligtas mangisda.",
    areas: {
      "Manila Bay": { subtitle: "West Cavite coast" },
      "Bacoor Bay": { subtitle: "Bacoor, Cavite" },
      "Cañacao Bay": { subtitle: "Cavite City" },
    },
  },
  catches: {
    title: "My Catches",
    subtitle: "Bawat huli, may kuwento. I-save ang sa iyo.",
    formTag: "Bagong entry",
    formTitle: "May huli ako!",
    formDesc: "Kapag bukas na ang journal, local ang save kahit walang signal.",
    photoLabel: "Magdagdag ng larawan",
    photoHelp: "Opsyonal · hanggang 10 MB · sa device mo lang",
    photoRemove: "Alisin",
    photoPreviewAlt: "Preview ng larawan ng huli",
    speciesLabel: "Species",
    speciesPlaceholder: "Anong nahuli mo?",
    speciesHelp: "Puwede itong iwanang blangko kung hindi pa matukoy.",
    dateLabel: "Petsa",
    todayBtn: "Ngayon",
    dateCalendarLabel: "Kalendaryo ng petsa ng huli",
    habitatLegend: "Uri ng tubig",
    moreDetailsSummary: "Dagdag na detalye",
    moreDetailsSummarySub: "Lugar, sukat, pain at tala",
    locationLabel: "Lugar",
    locationPlaceholder: "Bay, barangay, o private spot label",
    locationHelp: "Sa device lang ito naka-save. Huwag ilagay ang eksaktong spot kung ayaw mong itala.",
    lengthLabel: "Haba (cm)",
    weightLabel: "Timbang (g)",
    baitLabel: "Pain o pang-akit",
    baitPlaceholder: "Hal. bulate o lure",
    dispositionLabel: "Catch status",
    notesLabel: "Notes",
    notesPlaceholder: "Kondisyon, gear, o iba pang detalye",
    submitBtn: "I-save ang huli",
    submittingBtn: "Sine-save…",
    storageNote: "Naka-save sa browser ng device mo. Wala pang cloud sync o GPS.",
    journalHeading: "Ang iyong journal",
    catchesCount: "huli",
    loadingJournal: "Binubuksan ang journal…",
    emptyTitle: "Dito magsisimula ang kuwento mo",
    emptyDesc: "Wala ka pang naitatala. I-log ang unang huli mo sa form.",
    emptyPrivacyNote: "Ikaw lang ang may access sa mga tala sa browser na ito.",
    viewMySpecies: "Tingnan ang My Species",
    deleteCatchAria: "Burahin ang catch na",
    unidentifiedSpecies: "Hindi pa natukoy",
    dateNotRecorded: "Petsa hindi naitala",
    habitatNotRecorded: "Uri ng tubig hindi naitala",
    dispositionReleased: "Released",
    dispositionKept: "Kept",
    dispositionNotRecorded: "Not recorded",
    habitats: {
      saltwater: { label: "Saltwater", detail: "Dagat" },
      freshwater: { label: "Freshwater", detail: "Ilog o lawa" },
      brackish: { label: "Brackish", detail: "Halo ng alat at tabang" },
      unknown: { label: "Hindi alam", detail: "Idagdag mamaya" },
    },
  },
  species: {
    tag: "Cavite pilot · sourced records only",
    badge: "Coverage pending",
    title: "Species explorer",
    subtitle: "Hanapin ang naitalang yamang-tubig sa",
    searchPlaceholder: "Hanapin ang local o scientific name",
    waterFilterLabel: "Uri ng tubig",
    statusFilterLabel: "Status ng species",
    allWaters: "Lahat ng uri",
    allStatuses: "Lahat ng status",
    noRecordsTag: "No verified records loaded",
    noMatchTitle: "Wala pang verified match para sa",
    incompleteTitle: "Hindi pa kumpleto ang species list ng",
    gapDesc:
      "Ipinapakita muna namin ang data gap kaysa manghula. Lalabas lang ang species, local status, natural diet, toxicity information, at catch guidance kapag may angkop na source at local review.",
    warningBoxTitle: "Walang verified records sa view na ito.",
    warningBoxDesc:
      "Hindi ibig sabihin nito na walang yamang-tubig roon o puwedeng manghuli. Hindi pa inilalapat ang filters sa data dahil wala pang verified records para sa napiling lugar.",
    selectedGroundLabel: "Selected fishing ground:",
  },
  mySpecies: {
    tag: "Personal collection · device only",
    badge: "species discovered",
    title: "My Species",
    subtitle:
      "Bawat identified species sa personal catch log mo ay may card rito. Hindi ito public sighting o verified regional record.",
    loading: "Binubuksan ang collection…",
    emptyTag: "Your collection",
    emptyTitle: "Simulan ang species collection mo",
    emptyDesc:
      "Kapag nag-log ka ng identified species, mabubuksan dito ang collection card nito. Ang hindi pa natukoy ay mananatili sa My Catches.",
    logCatchBtn: "Mag-log ng catch",
    unidentifiedBanner: "hindi pa natukoy na catch ang nasa journal at hindi pa idinadagdag sa collection.",
    cardTag: "Personal collection",
    personalCatchesLabel: "personal catch",
    disclaimer: "Batay sa pribado mong catch log. Hindi ito patunay ng species status o dami sa lugar.",
  },
  settings: {
    tag: "Account & privacy",
    title: "Settings",
    subtitle: "Pamahalaan ang preferences, gabay, at data sa device mo.",
    languageTag: "Wika / Language",
    languageTitle: "Piliin ang wika ng app",
    languageDesc: "Maaari kang lumipat sa pagitan ng Filipino (Taglish) at English anumang oras.",
    profileTag: "Profile preferences",
    profileUnset: "Preferences not set",
    editProfileBtn: "I-edit preferences",
    helpTag: "Help",
    helpTitle: "Balikan ang in-app guide",
    helpDesc: "Iha-highlight ng guide ang pagpili ng lugar, species status, offline catch log, at collection.",
    restartTourBtn: "Ulitin ang guide",
    backupTag: "Local backup",
    backupTitle: "I-save o ibalik ang catch log",
    backupDesc:
      "Nasa browser address lang nakakabit ang local data. Gumawa ng backup bago lumipat ng address o browser. Kasama sa file ang photos at lahat ng fields.",
    downloadBackupBtn: "I-download ang backup",
    restoreBackupBtn: "I-restore ang backup",
    backupNote:
      "Ang restore ay papayag lang sa empty journal. Hindi nito papalitan o paghahaluin ang kasalukuyang records. Ingatan ang backup file dahil may pribadong impormasyon ito.",
    prototypeBackupNote:
      "Galing ba sa lumang Bangwit prototype ang entries mo? I-export muna sa old address na may local records:",
    prototypeBackupLink: "Buksan ang prototype backup page",
    privacyTag: "Privacy controls",
    privacyTitle: "Local prototype data",
    privacyDesc:
      "Catch logs at optional na larawan ay naka-save sa browser storage ng device na ito. Walang account o cloud sync. Walang kinukuhang GPS.",
    eraseBtn: "Burahin ang Bangwit data sa device",
    eraseConfirm:
      "Burahin ang lahat ng Bangwit catch logs, preferences, at policy acknowledgment sa browser na ito? Hindi ito maibabalik maliban kung may backup ka.",
    policiesTag: "Terms & privacy",
    policiesTitle: "Basahin ang mga policy",
    policiesDesc:
      "Prototype draft ang mga notice na ito. Ipa-review muna ang final text bago ilunsad sa publiko o magdagdag ng account, analytics, at cloud sync.",
    policiesLink: "Basahin ang Privacy Notice at Terms of Use",
  },
  offline: {
    tag: "Bangwit · Offline",
    title: "Mahina o walang signal",
    desc: "Hindi ma-load ang pahinang ito ngayon. Ang mga tala ng huli mo ay nasa device mo.",
    catchesBtn: "Puntahan ang My Catches",
  },
  termsPage: {
    tag: "Bangwit prototype · draft",
    title: "Terms of Use",
    lastUpdated: "Huling inayos: Setyembre 30, 2026 · para sa local prototype",
    sections: [
      {
        heading: "1. Prototype lamang",
        content:
          "Ang Bangwit build na ito ay pang-testing ng interface at local catch journal. Hindi pa verified ang species records, fishery boundaries, access points, fishing rules, closed seasons, protected-species guidance, diet o bait recommendations, weather, flood, at red-tide alerts.",
      },
      {
        heading: "2. Huwag gawing batayan ng kaligtasan o legal na desisyon",
        content:
          "Walang impormasyon sa prototype na garantiya na legal o ligtas mangisda, na puwedeng hulihin ang isang species, o na ligtas kainin ang isang catch. Tingnan ang kasalukuyang abiso ng BFAR, PAGASA, LGU, protected-area authorities, at iba pang kaukulang ahensiya. Sa panganib o aksidente, makipag-ugnayan agad sa lokal na emergency services.",
      },
      {
        heading: "3. Personal na tala",
        content:
          "Ikaw ang responsable sa katumpakan ng mga impormasyong inilagay mo sa personal na catch log. Mananatili ang log sa browser storage ng device na ito at hindi awtomatikong ia-upload o isi-sync sa Bangwit server. Maaari itong mawala kapag binura o na-evict ang browser data.",
      },
      {
        heading: "4. Walang garantiya ng serbisyo",
        content:
          "Maaaring magbago o hindi gumana ang prototype at maaaring wala itong internet o offline access sa ilang oras. Huwag umasa rito bilang navigation, emergency communications, o real-time advisory service.",
      },
      {
        heading: "5. Mga pagbabago at susunod na serbisyo",
        content:
          "Maaaring magbago ang mga tuntunin kapag nagdagdag ng verified data, accounts, sharing, o cloud sync. Hihingi ng hiwalay at malinaw na impormasyon at consent bago magproseso ng datos sa bagong paraan. Ang draft na ito ay hindi kapalit ng legal review bago public launch.",
      },
    ],
  },
  privacyPage: {
    tag: "Bangwit prototype · draft",
    title: "Privacy Notice",
    lastUpdated: "Huling inayos: Setyembre 30, 2026 · para sa local prototype",
    sections: [
      {
        heading: "Anong impormasyon ang mase-save",
        content:
          "Kapag nag-log ka ng huli, maaaring itago ng browser ang pangalan ng species, petsa, uri ng tubig, opsyonal na spot label, haba, timbang, pain, notes, catch status, at larawan. Opsyonal ang location field at ikaw ang naglalagay nito. Hindi kinukuha ng prototype ang GPS.",
      },
      {
        heading: "Saan ito naka-save",
        content:
          "Nasa lokal na storage ng browser ang catch log at photos ng device na ginagamit mo. Walang Bangwit account, cloud upload, o sync sa prototype. Ang Terms acknowledgment at optional preferences ay naka-save rin locally.",
      },
      {
        heading: "Pagbabahagi at access",
        content:
          "Walang community feed o public sharing sa build na ito. Ang sinumang may access sa browser profile at device na iyon ay maaaring makakita ng local data. Hindi awtomatikong nagbibigay ang browser storage ng encryption o hiwalay na account protection. Gumamit ng screen lock at huwag mag-log ng sensitibong lokasyon kung ayaw mong naroon ito.",
      },
      {
        heading: "Pag-backup, pag-export, at pagbura",
        content:
          "Maaari kang gumawa ng backup sa Settings. Kasama rito ang catch details, photo bytes, at optional na location text. Ingatan ang na-download na file. Maaari mo ring i-restore ito sa empty Bangwit journal o burahin ang local Bangwit data sa Settings. Ang browser data clearing o storage eviction ay maaari ring magtanggal ng records.",
      },
      {
        heading: "Pagbabago sa data handling",
        content:
          "Kung magdagdag sa hinaharap ng accounts, analytics, sharing, cloud sync, o external service, kailangang baguhin at ipaliwanag muna ang notice at kumuha ng angkop na consent. Ang pagtanggap sa prototype notice na ito ay hindi pahintulot para sa future cloud uploads.",
      },
      {
        heading: "Limitasyon",
        content:
          "Draft lang ang notice na ito para sa prototype. Kailangan itong ipa-review at palitan ng final notice na tumutugma sa aktuwal na data practices bago ilunsad sa publiko.",
      },
    ],
  },
};
