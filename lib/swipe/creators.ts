// Every creator featured in Swipe by PIXELUP LABS (/swipe).
//
// Seeded on 2026-10-20 from the public creator and post index of swiped.design.
// Post copy is ours: every title and summary was written fresh, and the
// creators' own text is never stored here. Each post opens as the real thing
// through X's or LinkedIn's official embed (lib/swipe/embeds.ts).
// Edit this file directly from here on.

import type { SwipeCategory } from "./posts";

export interface SwipeCreator {
  /** Stable slug, used as the anchor id and as SwipePost.creator. */
  id: string;
  name: string;
  /** Monogram shown in place of a photo. */
  initials: string;
  /** Short descriptor, only where the creator has one on LinkedIn. */
  role?: string;
  /** X handle without the @. */
  x?: string;
  /** LinkedIn vanity name (linkedin.com/in/<this>). */
  linkedin?: string;
  /** Categories they're featured in, most frequent first. */
  categories: SwipeCategory[];
}

/** Sorted by number of featured posts, then by total likes. */
export const swipeCreators: SwipeCreator[] = [
  {
    "id": "adriankuleszo",
    "name": "Adrian Kuleszo",
    "initials": "AK",
    "x": "adriankuleszo",
    "categories": [
      "Educational",
      "Business",
      "Resources",
      "Opinion",
      "Personal",
      "Work"
    ]
  },
  {
    "id": "chalaska",
    "name": "Chris Halaska",
    "initials": "CH",
    "x": "chalaska",
    "categories": [
      "Business",
      "Educational",
      "Opinion",
      "Personal"
    ]
  },
  {
    "id": "namyakhann",
    "name": "Namya @ Supafast",
    "initials": "NS",
    "x": "namyakhann",
    "categories": [
      "Opinion",
      "Business",
      "Personal",
      "Resources",
      "Educational"
    ]
  },
  {
    "id": "vanschneider",
    "name": "Tobias van Schneider",
    "initials": "TS",
    "x": "vanschneider",
    "linkedin": "tobiasvanschneider",
    "categories": [
      "Opinion",
      "Work",
      "Personal"
    ]
  },
  {
    "id": "brettfromdj",
    "name": "Brett",
    "initials": "B",
    "x": "BrettFromDJ",
    "categories": [
      "Business",
      "Personal",
      "Opinion",
      "Resources"
    ]
  },
  {
    "id": "heysatya",
    "name": "Satya",
    "initials": "S",
    "x": "heysatya_",
    "categories": [
      "Personal",
      "Work",
      "Business",
      "Opinion"
    ]
  },
  {
    "id": "nickbakeddesign",
    "name": "Nick",
    "initials": "N",
    "x": "nickbakeddesign",
    "categories": [
      "Business",
      "Educational",
      "Opinion",
      "Resources"
    ]
  },
  {
    "id": "0xcharlota",
    "name": "charlota",
    "initials": "C",
    "x": "0xCharlota",
    "categories": [
      "Educational",
      "Business",
      "Opinion"
    ]
  },
  {
    "id": "denisjeliazkov",
    "name": "Denislav Jeliazkov",
    "initials": "DJ",
    "x": "DenisJeliazkov",
    "categories": [
      "Resources",
      "Educational"
    ]
  },
  {
    "id": "joshpuckett",
    "name": "Josh Puckett",
    "initials": "JP",
    "x": "joshpuckett",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "felixhhaas",
    "name": "Felix Haas",
    "initials": "FH",
    "role": "Design at Lovable",
    "x": "felixhhaas",
    "linkedin": "felixhhaas",
    "categories": [
      "Opinion",
      "Personal"
    ]
  },
  {
    "id": "lennysan",
    "name": "Lenny Rachitsky",
    "initials": "LR",
    "x": "lennysan",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "dmitrykurash",
    "name": "Dmitry Kurash",
    "initials": "DK",
    "x": "DmitryKurash",
    "categories": [
      "Educational",
      "Resources"
    ]
  },
  {
    "id": "kubadesign",
    "name": "kuba",
    "initials": "K",
    "x": "kubadesign",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "pauljun",
    "name": "Paul Jun",
    "initials": "PJ",
    "role": "Brand at Ramp",
    "x": "PaulJun_",
    "linkedin": "paul-jun-3544a167",
    "categories": [
      "Opinion",
      "Work"
    ]
  },
  {
    "id": "designownow",
    "name": "Camden @ Designownow",
    "initials": "CD",
    "x": "Designownow_",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "vadim-carazan",
    "name": "Vadim Carazan",
    "initials": "VC",
    "role": "Brand designer",
    "linkedin": "vadim-carazan-153816ab",
    "categories": [
      "Personal",
      "Work"
    ]
  },
  {
    "id": "jayneil",
    "name": "Jayneil Dalal",
    "initials": "JD",
    "x": "jayneil",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "alex-barashkov",
    "name": "Alex Barashkov",
    "initials": "AB",
    "x": "alex_barashkov",
    "categories": [
      "Educational",
      "Opinion"
    ]
  },
  {
    "id": "designertom",
    "name": "Tommy Geoco 🇺🇸",
    "initials": "TG",
    "x": "designertom",
    "categories": [
      "Educational",
      "Opinion"
    ]
  },
  {
    "id": "alexaperios",
    "name": "Alex Aperios",
    "initials": "AA",
    "x": "AlexAperios",
    "categories": [
      "Opinion",
      "Personal"
    ]
  },
  {
    "id": "filip-justic",
    "name": "Filip Justić",
    "initials": "FJ",
    "role": "Co-founder, Afternow",
    "linkedin": "filip-justic",
    "categories": [
      "Opinion",
      "Work"
    ]
  },
  {
    "id": "dishashah66",
    "name": "Disha Shah",
    "initials": "DS",
    "x": "dishashah66",
    "categories": [
      "Educational",
      "Opinion"
    ]
  },
  {
    "id": "emirayaz",
    "name": "Emir Ayaz",
    "initials": "EA",
    "x": "emirayaz",
    "categories": [
      "Business",
      "Work"
    ]
  },
  {
    "id": "by-huy",
    "name": "Huy Nguyen",
    "initials": "HN",
    "x": "by__huy",
    "categories": [
      "Opinion",
      "Personal"
    ]
  },
  {
    "id": "audrey-t",
    "name": "Audrey T",
    "initials": "AT",
    "role": "Founder, mapo studio",
    "linkedin": "audreycaprianni",
    "categories": [
      "Educational",
      "Opinion"
    ]
  },
  {
    "id": "marina-uiux",
    "name": "Marina Budarina",
    "initials": "MB",
    "x": "marina_uiux",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "marcelkargul",
    "name": "Marcel",
    "initials": "M",
    "x": "marcelkargul",
    "categories": [
      "Resources"
    ]
  },
  {
    "id": "rexan-wong",
    "name": "Rexan Wong",
    "initials": "RW",
    "x": "rexan_wong",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "jared-hawkins",
    "name": "Jared Hawkins",
    "initials": "JH",
    "role": "Director of Design, Harness",
    "linkedin": "jaredhawkins",
    "categories": [
      "Opinion"
    ]
  },
  {
    "id": "dinesh-subramani",
    "name": "Dinesh Subramani",
    "initials": "DS",
    "role": "Design Team Lead, 6July Design Studio",
    "linkedin": "dinesh-subramani-939302110",
    "categories": [
      "Personal"
    ]
  },
  {
    "id": "kelly-mackenzie",
    "name": "Kelly Mackenzie",
    "initials": "KM",
    "role": "Founder, White Bear Studio",
    "linkedin": "kellymackenzie1",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "artiom-dashinsky",
    "name": "Artiom Dashinsky",
    "initials": "AD",
    "linkedin": "dashinsky",
    "categories": [
      "Opinion"
    ]
  },
  {
    "id": "leomeethewoo",
    "name": "leo",
    "initials": "L",
    "x": "leomeethewoo",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "cj-cawley",
    "name": "Cj Cawley",
    "initials": "CC",
    "role": "Brand designer",
    "linkedin": "cj-cawley-60311714b",
    "categories": [
      "Work"
    ]
  },
  {
    "id": "emilkowalski",
    "name": "Emil Kowalski",
    "initials": "EK",
    "x": "emilkowalski",
    "categories": [
      "Opinion"
    ]
  },
  {
    "id": "zoink",
    "name": "Dylan Field",
    "initials": "DF",
    "x": "zoink",
    "categories": [
      "Opinion"
    ]
  },
  {
    "id": "flohoeller",
    "name": "Flo",
    "initials": "F",
    "x": "flohoeller",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "onzexbt",
    "name": "Marlay",
    "initials": "M",
    "x": "onzeXBT",
    "categories": [
      "Opinion"
    ]
  },
  {
    "id": "kurissuuu",
    "name": "Chris Andrews",
    "initials": "CA",
    "x": "kurissuuu",
    "categories": [
      "Opinion"
    ]
  },
  {
    "id": "james-martin",
    "name": "James Martin",
    "initials": "JM",
    "role": "Design director",
    "linkedin": "madebyjamesmartin",
    "categories": [
      "Opinion"
    ]
  },
  {
    "id": "heyrico",
    "name": "rico",
    "initials": "R",
    "x": "_heyrico",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "howard-pinsky",
    "name": "Howard Pinsky",
    "initials": "HP",
    "role": "Design Evangelist at Adobe",
    "linkedin": "howardpinsky",
    "categories": [
      "Personal"
    ]
  },
  {
    "id": "jonathan-holburn",
    "name": "Jonathan Holburn",
    "initials": "JH",
    "role": "Brand & packaging designer",
    "linkedin": "jonathan-holburn-64212386",
    "categories": [
      "Personal"
    ]
  },
  {
    "id": "creativemints",
    "name": "Mike I Creative Mints",
    "initials": "MM",
    "x": "creativemints",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "breejeanadkat",
    "name": "Breeje Anadkat",
    "initials": "BA",
    "x": "BreejeAnadkat",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "dannpetty",
    "name": "Dann Petty",
    "initials": "DP",
    "x": "DannPetty",
    "categories": [
      "Opinion"
    ]
  },
  {
    "id": "socoloffalex",
    "name": "Alex Socoloff",
    "initials": "AS",
    "x": "socoloffalex",
    "categories": [
      "Opinion"
    ]
  },
  {
    "id": "prachiruns",
    "name": "Prachi Sethi",
    "initials": "PS",
    "x": "prachiruns",
    "categories": [
      "Work"
    ]
  },
  {
    "id": "mikesmith187",
    "name": "Mike Smith",
    "initials": "MS",
    "x": "mikesmith187",
    "categories": [
      "Work"
    ]
  },
  {
    "id": "raul-dronca",
    "name": "Raul",
    "initials": "R",
    "x": "raul_dronca",
    "categories": [
      "Resources"
    ]
  },
  {
    "id": "rocky-roark",
    "name": "Rocky Roark",
    "initials": "RR",
    "role": "Branding & Strategy, Blue Cyclops",
    "linkedin": "rockyroark",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "esteban-gonzalez",
    "name": "Esteban González",
    "initials": "EG",
    "role": "Motion designer",
    "linkedin": "estebangonzalezuy",
    "categories": [
      "Opinion"
    ]
  },
  {
    "id": "semochkin-alex",
    "name": "Alex",
    "initials": "A",
    "x": "semochkin_alex",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "safee-ullah",
    "name": "Safee Ullah",
    "initials": "SU",
    "role": "Creative Director & Co-founder, Deztopia",
    "linkedin": "safee-ullah-95733a102",
    "categories": [
      "Work"
    ]
  },
  {
    "id": "mrinalikamath",
    "name": "Mrinali Kamath",
    "initials": "MK",
    "x": "mrinalikamath",
    "categories": [
      "Opinion"
    ]
  },
  {
    "id": "nazar-melnyk",
    "name": "Nazar Melnyk",
    "initials": "NM",
    "role": "Design engineer",
    "linkedin": "nrmk13",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "pizzaboy",
    "name": "Dan Holdsworth",
    "initials": "DH",
    "x": "pizzaboy",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "lisa-demchenko",
    "name": "Lisa Demchenko",
    "initials": "LD",
    "role": "Fractional design partner",
    "linkedin": "lisa-demchenko-5a7490130",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "jessa-wolfe",
    "name": "Jessa Wolfe",
    "initials": "JW",
    "role": "Sr. Product Design Manager",
    "linkedin": "jessawolfe",
    "categories": [
      "Opinion"
    ]
  },
  {
    "id": "jo-bird",
    "name": "Jo Bird",
    "initials": "JB",
    "role": "Brand designer",
    "linkedin": "justjobird",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "fonsmans",
    "name": "Fons Mans",
    "initials": "FM",
    "x": "FonsMans",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "rsms",
    "name": "Rasmus Andersson",
    "initials": "RA",
    "x": "rsms",
    "categories": [
      "Work"
    ]
  },
  {
    "id": "fazurrehman",
    "name": "Faizur Rehman",
    "initials": "FR",
    "x": "fazurrehman",
    "categories": [
      "Business"
    ]
  },
  {
    "id": "james-greenfield",
    "name": "James Greenfield",
    "initials": "JG",
    "role": "CEO & Founder, Koto",
    "linkedin": "james-greenfield-74416921",
    "categories": [
      "Business"
    ]
  },
  {
    "id": "poistudioltd",
    "name": "Bobo Wong",
    "initials": "BW",
    "x": "poistudioltd",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "karrisaarinen",
    "name": "Karri Saarinen",
    "initials": "KS",
    "x": "karrisaarinen",
    "categories": [
      "Opinion"
    ]
  },
  {
    "id": "rahulluthra22",
    "name": "Rahul Luthra",
    "initials": "RL",
    "x": "rahulluthra22",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "emmettshine",
    "name": "Emmett Shine",
    "initials": "ES",
    "x": "emmettshine",
    "categories": [
      "Work"
    ]
  },
  {
    "id": "roelof-otten",
    "name": "Roelof Otten",
    "initials": "RO",
    "linkedin": "roelof-otten",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "atul-khola",
    "name": "Atul Khola",
    "initials": "AK",
    "role": "Product designer",
    "linkedin": "atulkhola",
    "categories": [
      "Opinion"
    ]
  },
  {
    "id": "mengto",
    "name": "Meng To",
    "initials": "MT",
    "x": "MengTo",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "ciprian-irimies",
    "name": "Ciprian Irimies",
    "initials": "CI",
    "role": "Product Strategy & Design Leadership",
    "linkedin": "ciprianirimies",
    "categories": [
      "Opinion"
    ]
  },
  {
    "id": "luciebajgart",
    "name": "Lucie Bajgart",
    "initials": "LB",
    "x": "LucieBajgart",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "christine-vallaure-de-la-paz",
    "name": "Christine Vallaure de la Paz",
    "initials": "CP",
    "role": "Designer & educator, moonlearning.io",
    "linkedin": "christinevallaure",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "laura-vlad",
    "name": "Laura Vlad",
    "initials": "LV",
    "role": "Brand designer",
    "linkedin": "laura-mihaela",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "rylan-phillips",
    "name": "Rylan Phillips",
    "initials": "RP",
    "role": "Designer & developer, Vienna",
    "linkedin": "rylan-phillips",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "mathurahravi",
    "name": "mathurah",
    "initials": "M",
    "x": "mathurahravi",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "tony-alicea",
    "name": "Tony Alicea",
    "initials": "TA",
    "role": "UX, Nielsen Norman Group",
    "linkedin": "tonyalicea",
    "categories": [
      "Opinion"
    ]
  },
  {
    "id": "jamesm",
    "name": "James McDonald",
    "initials": "JM",
    "x": "jamesm",
    "categories": [
      "Personal"
    ]
  },
  {
    "id": "luis-vasquez",
    "name": "Luis Vásquez",
    "initials": "LV",
    "role": "Co-Founder & Creative Director, VASK® Studio",
    "linkedin": "luisvask",
    "categories": [
      "Work"
    ]
  },
  {
    "id": "jessperate",
    "name": "Jess Rosenberg",
    "initials": "JR",
    "x": "jessperate",
    "categories": [
      "Personal"
    ]
  },
  {
    "id": "dan-allan",
    "name": "Dan Allan",
    "initials": "DA",
    "role": "Design & branding, UK",
    "linkedin": "dan-allan-72490495",
    "categories": [
      "Opinion"
    ]
  },
  {
    "id": "felix-lee",
    "name": "Felix Lee",
    "initials": "FL",
    "role": "Solo founder",
    "linkedin": "felixleezd",
    "categories": [
      "Work"
    ]
  },
  {
    "id": "jake-bliese",
    "name": "Jake Bliese",
    "initials": "JB",
    "role": "Designer, 15+ years",
    "linkedin": "jake-bliese-3934699b",
    "categories": [
      "Personal"
    ]
  },
  {
    "id": "pedro-mello",
    "name": "Pedro Mello",
    "initials": "PM",
    "role": "Product designer",
    "linkedin": "pedrodesinmello",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "ridd-design",
    "name": "Ridd",
    "initials": "R",
    "x": "ridd_design",
    "categories": [
      "Educational"
    ]
  },
  {
    "id": "mais-tazagulov",
    "name": "Mais Tazagulov",
    "initials": "MT",
    "role": "Brand designer",
    "linkedin": "maisjandesign",
    "categories": [
      "Opinion"
    ]
  },
  {
    "id": "lukeadesign",
    "name": "Luke",
    "initials": "L",
    "x": "LukeADesign",
    "categories": [
      "Opinion"
    ]
  },
  {
    "id": "tom-scott",
    "name": "Tom Scott",
    "initials": "TS",
    "role": "Design recruiter, Verified",
    "linkedin": "tomscottt",
    "categories": [
      "Opinion"
    ]
  },
  {
    "id": "shedsgns",
    "name": "Juliette",
    "initials": "J",
    "x": "shedsgns",
    "categories": [
      "Opinion"
    ]
  },
  {
    "id": "philhedayatnia",
    "name": "Phil Hedayatnia",
    "initials": "PH",
    "x": "PhilHedayatnia",
    "categories": [
      "Personal"
    ]
  },
  {
    "id": "hellohex",
    "name": "HEX",
    "initials": "H",
    "x": "helloHEX",
    "categories": [
      "Educational"
    ]
  }
];
