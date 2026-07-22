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
};

const images: Record<string, string> = {
  sigiriya: "https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1800&q=88",
  ella: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1800&q=88",
  "galle-fort": "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1800&q=88",
};

const highlights: Record<string, string[]> = {
  sigiriya: ["Lion Rock summit", "Ancient frescoes", "Royal water gardens"],
  ella: ["Nine Arch Bridge", "Little Adam's Peak", "Tea country rail journey"],
  "galle-fort": ["Sunset ramparts", "Maritime museum", "Historic lanes and courtyards"],
};

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
  },
];

export function decorateDestination(row: Omit<DestinationView, "image" | "highlights">): DestinationView {
  return {
    ...row,
    image: images[row.slug] ?? images.sigiriya,
    highlights: highlights[row.slug] ?? ["Local culture", "Scenic landscapes", "Regional cuisine"],
  };
}
