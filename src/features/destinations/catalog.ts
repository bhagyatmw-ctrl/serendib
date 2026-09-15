export type DestinationView = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string | null;
  province: string;
  district: string | null;
  latitude: number;
  longitude: number;
  entryFeeLkr: number | null;
  bestMonths: number[];
  image: string;
  highlights: string[];
  tags?: string[];
  idealDays?: string;
};

const images: Record<string, string> = {
  sigiriya: "https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1800&q=88",
  ella: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1800&q=88",
  "galle-fort": "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1800&q=88",
  anuradhapura: "https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1800&q=88",
  kandy: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1800&q=88",
  "nuwara-eliya": "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1800&q=88",
  yala: "https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1800&q=88",
  mirissa: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1800&q=88",
  trincomalee: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1800&q=88",
};

const highlights: Record<string, string[]> = {
  sigiriya: ["Lion Rock summit", "Ancient frescoes", "Royal water gardens"],
  ella: ["Nine Arch Bridge", "Little Adam's Peak", "Tea country rail journey"],
  "galle-fort": ["Sunset ramparts", "Maritime museum", "Historic lanes and courtyards"],
  anuradhapura: ["Sri Maha Bodhi", "Ruwanwelisaya", "Ancient monastic cities"],
  kandy: ["Temple of the Sacred Tooth", "Kandy Lake", "Royal Botanic Gardens"],
  "nuwara-eliya": ["Tea estate trails", "Horton Plains", "Gregory Lake"],
  yala: ["Dawn wildlife safari", "Leopard country", "Coastal lagoons"],
  mirissa: ["Whale-watching waters", "Coconut Tree Hill", "Secret Beach"],
  trincomalee: ["Nilaveli Beach", "Pigeon Island", "Koneswaram Temple"],
};
const tags: Record<string, string[]> = {
  sigiriya:["heritage","culture","nature"], ella:["hills","nature","adventure"], "galle-fort":["heritage","culture","coast"],
  anuradhapura:["heritage","culture","buddhist"], kandy:["culture","buddhist","hills"], "nuwara-eliya":["hills","nature"],
  yala:["wildlife","nature","adventure"], mirissa:["coast","wildlife"], trincomalee:["coast","culture","wildlife"],
};
const idealDays: Record<string,string> = {sigiriya:"2–3 days",ella:"2–3 days","galle-fort":"1–2 days",anuradhapura:"2 days",kandy:"2 days","nuwara-eliya":"2 days",yala:"1–2 days",mirissa:"2–4 days",trincomalee:"3–4 days"};

export const fallbackDestinations: DestinationView[] = [
  {
    id: "fallback-sigiriya",
    slug: "sigiriya",
    name: "Sigiriya",
    summary: "Ancient rock fortress rising above Sri Lanka's Cultural Triangle.",
    description: "Climb through landscaped gardens and fresco galleries to the fifth-century citadel.",
    province: "Central",
    district: "Matale",
    latitude: 7.957,
    longitude: 80.7603,
    entryFeeLkr: null,
    bestMonths: [1, 2, 3, 6, 7, 8],
    image: images.sigiriya,
    highlights: highlights.sigiriya,
    tags: tags.sigiriya,
    idealDays: idealDays.sigiriya,
  },
  {
    id: "fallback-ella",
    slug: "ella",
    name: "Ella",
    summary: "Tea country, mountain trails and one of Asia's most memorable train journeys.",
    description: "A relaxed highland base for Little Adam's Peak, Nine Arch Bridge and tea estates.",
    province: "Uva",
    district: "Badulla",
    latitude: 6.8667,
    longitude: 81.0466,
    entryFeeLkr: null,
    bestMonths: [1, 2, 3, 7, 8, 9],
    image: images.ella,
    highlights: highlights.ella,
    tags: tags.ella,
    idealDays: idealDays.ella,
  },
  {
    id: "fallback-galle-fort",
    slug: "galle-fort",
    name: "Galle Fort",
    summary: "A living coastal fort shaped by centuries of Sri Lankan and European history.",
    description: "Walk ramparts, lanes, museums and cafes inside the UNESCO-listed old town.",
    province: "Southern",
    district: "Galle",
    latitude: 6.026,
    longitude: 80.217,
    entryFeeLkr: null,
    bestMonths: [1, 2, 3, 12],
    image: images["galle-fort"],
    highlights: highlights["galle-fort"],
    tags: tags["galle-fort"],
    idealDays: idealDays["galle-fort"],
  },
  {id:"fallback-anuradhapura",slug:"anuradhapura",name:"Anuradhapura",summary:"Sacred stupas, ancient reservoirs and a living pilgrimage city.",description:"Cycle between monumental dagobas and monasteries in Sri Lanka's first great capital.",province:"North Central",district:"Anuradhapura",latitude:8.3114,longitude:80.4037,entryFeeLkr:10230,bestMonths:[1,2,3,6,7,8],image:images.anuradhapura,highlights:highlights.anuradhapura},
  {id:"fallback-kandy",slug:"kandy",name:"Kandy",summary:"A sacred lakeside city at the gateway to the hill country.",description:"Experience the Temple of the Sacred Tooth, gardens, dance and a vibrant central market.",province:"Central",district:"Kandy",latitude:7.2906,longitude:80.6337,entryFeeLkr:null,bestMonths:[1,2,3,7,8],image:images.kandy,highlights:highlights.kandy},
  {id:"fallback-nuwara-eliya",slug:"nuwara-eliya",name:"Nuwara Eliya",summary:"Tea gardens, cool air and highland landscapes above the clouds.",description:"Walk through working tea estates and use the town as a base for Horton Plains.",province:"Central",district:"Nuwara Eliya",latitude:6.9497,longitude:80.7891,entryFeeLkr:null,bestMonths:[1,2,3,4],image:images["nuwara-eliya"],highlights:highlights["nuwara-eliya"]},
  {id:"fallback-yala",slug:"yala",name:"Yala National Park",summary:"Sri Lanka's best-known wilderness for leopards, elephants and birds.",description:"Take an early jeep safari through dry forest, lagoons and dramatic coastline.",province:"Southern",district:"Hambantota",latitude:6.3725,longitude:81.5185,entryFeeLkr:null,bestMonths:[2,3,4,5,6,7],image:images.yala,highlights:highlights.yala},
  {id:"fallback-mirissa",slug:"mirissa",name:"Mirissa",summary:"A relaxed south-coast base for beaches, surf and marine life.",description:"Balance ocean mornings and hidden coves with easy access to the historic south.",province:"Southern",district:"Matara",latitude:5.9483,longitude:80.4716,entryFeeLkr:null,bestMonths:[1,2,3,12],image:images.mirissa,highlights:highlights.mirissa},
  {id:"fallback-trincomalee",slug:"trincomalee",name:"Trincomalee",summary:"Turquoise eastern beaches, coral islands and layered coastal history.",description:"Swim at Nilaveli, snorkel Pigeon Island and visit temples above one of Asia's great natural harbours.",province:"Eastern",district:"Trincomalee",latitude:8.5874,longitude:81.2152,entryFeeLkr:4092,bestMonths:[4,5,6,7,8,9],image:images.trincomalee,highlights:highlights.trincomalee},
];

export function decorateDestination(row: Omit<DestinationView, "image" | "highlights">): DestinationView {
  return {
    ...row,
    image: images[row.slug] ?? images.sigiriya,
    highlights: highlights[row.slug] ?? ["Local culture", "Scenic landscapes", "Regional cuisine"],
    tags: tags[row.slug] ?? ["culture","nature"],
    idealDays: idealDays[row.slug] ?? "1–2 days",
  };
}
