export type GuideItem = { name: string; detail: string; meta: string; price: string };
export type DestinationGuide = { stay: GuideItem[]; eat: GuideItem[]; do: GuideItem[]; transport: GuideItem[] };

const common = {
  stay: [
    { name: "Locally owned guesthouse", detail: "Friendly, simple and well placed for independent travellers.", meta: "Best for value", price: "From LKR 8,000" },
    { name: "Boutique heritage stay", detail: "Characterful rooms with breakfast and thoughtful local design.", meta: "Best for couples", price: "From LKR 24,000" },
    { name: "Full-service resort", detail: "Pool, restaurant and arranged transfers in one easy base.", meta: "Best for comfort", price: "From LKR 45,000" },
  ],
  eat: [
    { name: "Rice & curry lunch", detail: "A changing spread of vegetables, sambols and a main curry.", meta: "Local favourite", price: "LKR 1,200–2,500" },
    { name: "Evening kottu", detail: "Chopped roti, vegetables and spice cooked on a hot steel plate.", meta: "Casual dinner", price: "LKR 900–1,800" },
    { name: "Market fruit & short eats", detail: "Seasonal fruit, hoppers, vadai and bakery snacks.", meta: "Quick bite", price: "LKR 500–1,200" },
  ],
  do: [
    { name: "Guided orientation walk", detail: "Learn the place through stories, neighbourhoods and local context.", meta: "2–3 hours", price: "From LKR 6,000" },
    { name: "Sunrise nature walk", detail: "Start before the heat for softer light and active birdlife.", meta: "Early morning", price: "Free–LKR 4,000" },
    { name: "Local craft experience", detail: "Meet makers and understand a regional tradition hands-on.", meta: "Half day", price: "From LKR 5,000" },
  ],
  transport: [
    { name: "Tuk-tuk", detail: "Best for short local hops; agree the fare before departure.", meta: "Under 10 km", price: "LKR 150–250/km" },
    { name: "Public bus", detail: "Frequent and inexpensive, but allow time and travel light.", meta: "Regional", price: "From LKR 100" },
    { name: "Car with driver", detail: "The easiest option for multi-stop days and luggage.", meta: "Full day", price: "From LKR 18,000" },
  ],
};

const special: Record<string, Partial<DestinationGuide>> = {
  sigiriya: { do: [
    { name:"Sigiriya Rock Fortress",detail:"Climb through water gardens and fresco galleries to the citadel.",meta:"3–4 hours · start early",price:"LKR 11,935 foreign adult"},
    { name:"Pidurangala sunrise",detail:"A steeper rock scramble with the classic view towards Sigiriya.",meta:"2–3 hours",price:"Confirm locally"},
    { name:"Village cycle",detail:"Ride quiet tank roads and farmland with a local guide.",meta:"Half day",price:"From LKR 7,500"},
  ]},
  ella: { transport: [
    {name:"Scenic train",detail:"Reserve ahead for the Kandy–Ella mountain railway.",meta:"Long-distance highlight",price:"Reserved seat from LKR 1,200"},
    {name:"Tuk-tuk",detail:"Useful for Nine Arch Bridge, trailheads and tea estates.",meta:"Local",price:"Agree before travel"},
    {name:"Private transfer",detail:"Best for onward travel to Yala or the south coast.",meta:"Intercity",price:"Quote locally"},
  ]},
  yala: { do: [
    {name:"Dawn jeep safari",detail:"The coolest and most active window for wildlife viewing.",meta:"4–5 hours",price:"From LKR 20,000 plus park fees"},
    {name:"Tissamaharama wetlands",detail:"A quieter birding circuit around tanks and paddy fields.",meta:"Late afternoon",price:"Free–LKR 5,000"},
    {name:"Sithulpawwa",detail:"Ancient forest monastery and panoramic rock landscape.",meta:"Half day",price:"Confirm locally"},
  ]},
  mirissa: { do: [
    {name:"Responsible whale watching",detail:"Choose a licensed operator that keeps respectful distance.",meta:"Seasonal · early morning",price:"From LKR 18,000"},
    {name:"Beginner surf lesson",detail:"A guided introduction on a suitable nearby break.",meta:"90 minutes",price:"From LKR 6,500"},
    {name:"Coastal headland walk",detail:"Coconut Tree Hill and small coves in the cooler hours.",meta:"Sunrise or sunset",price:"Free"},
  ]},
};

export function getDestinationGuide(slug: string): DestinationGuide {
  return { stay: special[slug]?.stay ?? common.stay, eat: special[slug]?.eat ?? common.eat, do: special[slug]?.do ?? common.do, transport: special[slug]?.transport ?? common.transport };
}
