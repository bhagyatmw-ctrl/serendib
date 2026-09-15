"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { ArrowLeft, BadgeDollarSign, CalendarDays, Check, ChevronDown, ChevronUp, CircleDollarSign, Clock3, Cloud, ExternalLink, Landmark, LogIn, MapPin, Plus, Printer, RotateCcw, Sparkles, Trash2, Users } from "lucide-react";
import { saveItinerary } from "@/src/features/trips/itinerary-actions";
import styles from "./planner.module.css";
import { BrandLogo } from "@/src/components/brand-logo";

export type Activity = { id: string; time: string; title: string; detail: string; cost: number; source?: string; priceType?: "published" | "estimate" | "free" };
export type PlanDay = { id: string; location: string; title: string; travel: string; activities: Activity[] };
export type Plan = { tripId?: string | null; name: string; travelers: number; style: string; interest: string; days: PlanDay[] };

const routes: Record<string, Array<[string, string, string, Array<[string, string, string]>]>> = {
  mix: [
    ["Negombo", "A gentle island arrival", "20 min from the airport", [["15:00", "Lagoon-side check-in", "Settle in and recover from your flight"], ["17:30", "Negombo beach walk", "Sunset, fishing boats and an easy seafood dinner"]]],
    ["Sigiriya", "Into the Cultural Triangle", "3 hr 30 min by car", [["10:00", "Dambulla Cave Temple", "Ancient murals and five sacred cave shrines"], ["16:30", "Pidurangala sunset", "A quieter climb with views of Lion Rock"]]],
    ["Sigiriya", "The lion rock citadel", "Local tuk-tuk transfers", [["06:30", "Sigiriya Rock Fortress", "Climb early for cooler air and open views"], ["15:00", "Village cycle", "Rice fields, tanks and a home-cooked meal"]]],
    ["Kandy", "Temple city & hill-country culture", "2 hr 45 min by car", [["14:00", "Temple of the Sacred Tooth", "Explore Sri Lanka's most revered Buddhist site"], ["17:00", "Kandy Lake promenade", "A relaxed golden-hour circuit"]]],
    ["Ella", "The great hill-country railway", "6–7 hr scenic train", [["08:45", "Kandy to Ella train", "Reserve observation or second class in advance"], ["17:30", "Ella town", "Check in, wander and dine locally"]]],
    ["Ella", "Trails, tea and viaducts", "Local tuk-tuk transfers", [["06:30", "Little Adam's Peak", "An easy sunrise hike"], ["09:00", "Nine Arch Bridge", "Walk through tea country to the viaduct"], ["14:00", "Tea estate visit", "Factory tour and guided tasting"]]],
    ["Galle", "Fort walls by the Indian Ocean", "3 hr 30 min by car", [["15:30", "Galle Fort lanes", "Boutiques, courtyards and maritime history"], ["17:45", "Sunset on the ramparts", "Finish at Flag Rock before dinner"]]],
    ["Mirissa", "A slow day on the south coast", "50 min by car", [["09:00", "Coconut Tree Hill", "Coastal views before the heat"], ["11:00", "Beach day", "Swim, read and lunch barefoot"], ["17:30", "Secret Beach sunset", "A tucked-away cove for the evening"]]],
    ["Colombo", "Contemporary island life", "2 hr 30 min by coastal train", [["14:00", "Pettah market walk", "Spices, textiles and colourful streets"], ["18:00", "Galle Face Green", "Street food beside the sea"]]],
  ],
  heritage: [],
  buddhist: [],
  nature: [],
  hills: [],
  coast: [],
};
routes.heritage = [["Anuradhapura", "The first sacred capital", "4 hr by car", [["08:00", "Anuradhapura Sacred City", "Explore the stupas, monasteries and ancient reservoirs"], ["16:00", "Mihintale", "Climb the steps of Buddhism's historic arrival point"]]], routes.mix[1], routes.mix[2], ["Polonnaruwa", "A medieval royal capital", "1 hr 20 min by car", [["08:00", "Polonnaruwa Ancient City", "Cycle between the Royal Palace, Quadrangle and Gal Vihara"], ["15:30", "Parakrama Samudra", "Sunset beside the great ancient reservoir"]]], routes.mix[3], routes.mix[6]];
routes.buddhist = [["Anuradhapura", "Living Buddhist heritage", "4 hr by car", [["07:30", "Anuradhapura Sacred City", "Visit Sri Maha Bodhi, Ruwanwelisaya and the monastic complexes"], ["16:00", "Mihintale", "Walk the sacred hill at the quiet end of day"]]], ["Polonnaruwa", "Stone shrines and royal monasteries", "2 hr 30 min by car", [["08:00", "Polonnaruwa Ancient City", "See Gal Vihara's monumental Buddha images"], ["15:00", "Somawathiya", "A revered stupa in a peaceful national park setting"]]], ["Dambulla", "Cave temples of the Cultural Triangle", "1 hr 30 min by car", [["08:30", "Dambulla Cave Temple", "Five painted caves with centuries of sacred art"], ["15:00", "Ritigala", "Forest monastery ruins on a cool mountain slope"]]], routes.mix[3], ["Colombo", "Temples of the capital", "3 hr by car", [["09:00", "Gangaramaya Temple", "A vibrant collection of Buddhist art and architecture"], ["16:00", "Kelaniya Raja Maha Vihara", "Murals, sculpture and an important pilgrimage site"]]]];
routes.nature = [routes.mix[0], routes.mix[1], ["Minneriya", "Elephants of the dry zone", "30 min by car", [["14:00", "Minneriya safari", "Search for elephant herds around the historic tank"]]], routes.mix[4], routes.mix[5], ["Yala", "Into the wild", "2 hr 30 min by car", [["05:30", "Yala safari", "Leopards, elephants and coastal wetlands"], ["16:00", "Tissamaharama lakes", "Birdlife and a quiet village cycle"]]], routes.mix[7]];
routes.hills = [routes.mix[3], ["Nuwara Eliya", "Tea gardens & cool mountain air", "3 hr by car", [["10:30", "Tea estate visit", "Factory tour and guided Ceylon tea tasting"], ["15:30", "Gregory Lake", "A gentle lakeside walk"]]], routes.mix[4], routes.mix[5], ["Haputale", "Ridges above the cloud forest", "1 hr 30 min by train", [["05:30", "Lipton's Seat", "Sunrise views across tea country"], ["11:30", "Dambatenne Tea Factory", "Follow tea from leaf to cup"]]], ["Kitulgala", "Rainforest adventure", "4 hr by car", [["09:00", "Kelani River rafting", "Guided white-water run through tropical forest"], ["15:00", "Makandawa rainforest walk", "Birds, streams and dense lowland forest"]]]];
routes.coast = [routes.mix[0], ["Kalpitiya", "Dolphins & open water", "3 hr 30 min by car", [["07:00", "Dolphin-watching boat", "Responsible small-group trip offshore"], ["14:00", "Lagoon kayak", "Mangroves and calm water"]]], routes.mix[6], routes.mix[7], ["Tangalle", "Coves and coastal calm", "1 hr 30 min by car", [["09:00", "Hiriketiya morning", "Swim or book a beginner surf lesson"], ["16:30", "Rekawa lagoon", "A quiet nature walk near the coast"]]]];

const CCF_SOURCE = "https://ccf.gov.lk/is/index.php";
const RAIL_SOURCE = "https://railway.gov.lk/web/images/pdf/Ticket_Price_Line/main_line_rec.pdf";
const PACKAGE_SOURCE = "https://trustker.com/sri-lanka-tour-packages/7-8-days/";
const costCatalog: Record<string, { cost: number; source?: string; type: "published" | "estimate" | "free" }> = {
  "Sigiriya Rock Fortress": { cost: 11935, source: CCF_SOURCE, type: "published" },
  "Polonnaruwa Ancient City": { cost: 10230, source: CCF_SOURCE, type: "published" },
  "Anuradhapura Sacred City": { cost: 10230, source: CCF_SOURCE, type: "published" },
  "Ritigala": { cost: 2046, source: CCF_SOURCE, type: "published" },
  "Galle Fort lanes": { cost: 0, type: "free" }, "Sunset on the ramparts": { cost: 0, type: "free" },
  "Little Adam's Peak": { cost: 0, type: "free" }, "Nine Arch Bridge": { cost: 0, type: "free" },
  "Kandy to Ella train": { cost: 2500, source: RAIL_SOURCE, type: "published" },
};
const dailyAllowance: Record<string, number> = { budget: 15000, comfort: 28000, luxury: 52000 };
const estimatedActivity: Record<string, number> = { budget: 3000, comfort: 5500, luxury: 9500 };
const recommendations: Record<string, Array<{ name: string; region: string; note: string }>> = {
  mix: [{name:"Sigiriya",region:"Central",note:"Ancient citadel & panoramic climb"},{name:"Kandy",region:"Central",note:"Sacred city and living culture"},{name:"Ella",region:"Uva",note:"Tea country and scenic rail"},{name:"Galle",region:"Southern",note:"Fort ramparts and coast"}],
  heritage: [{name:"Anuradhapura",region:"North Central",note:"Sri Lanka's first ancient capital"},{name:"Sigiriya",region:"Central",note:"UNESCO rock fortress"},{name:"Polonnaruwa",region:"North Central",note:"Medieval royal city"},{name:"Galle Fort",region:"Southern",note:"Living colonial fort"}],
  buddhist: [{name:"Mihintale",region:"North Central",note:"Birthplace of Buddhism in Sri Lanka"},{name:"Dambulla",region:"Central",note:"Five painted shrine caves"},{name:"Kandy",region:"Central",note:"Temple of the Sacred Tooth"},{name:"Ritigala",region:"North Central",note:"Forest monastery ruins"}],
  nature: [{name:"Minneriya",region:"North Central",note:"Elephant gatherings"},{name:"Yala",region:"Southern",note:"Leopards and dry-zone wildlife"},{name:"Udawalawe",region:"Sabaragamuwa",note:"Reliable elephant sightings"},{name:"Sinharaja",region:"Sabaragamuwa",note:"UNESCO rainforest"}],
  hills: [{name:"Ella",region:"Uva",note:"Hikes, waterfalls and railway"},{name:"Nuwara Eliya",region:"Central",note:"Tea estates and cool climate"},{name:"Haputale",region:"Uva",note:"Mountain ridges and Lipton's Seat"},{name:"Kitulgala",region:"Sabaragamuwa",note:"Rainforest and river adventure"}],
  coast: [{name:"Mirissa",region:"Southern",note:"Beaches and whale watching"},{name:"Tangalle",region:"Southern",note:"Quiet coves and lagoons"},{name:"Trincomalee",region:"Eastern",note:"Clear water and marine life"},{name:"Arugam Bay",region:"Eastern",note:"World-class surf breaks"}],
};
const benchmarks: Record<string, { title: string; usd: number; route: string }> = {
  mix:{title:"Classic Sri Lanka Highlights",usd:780,route:"Sigiriya · Kandy · Ella · Bentota"},
  heritage:{title:"Sri Lanka UNESCO Highlights",usd:860,route:"Anuradhapura · Sigiriya · Kandy · Galle"},
  buddhist:{title:"Mihintale and Sacred Kingdoms",usd:860,route:"Anuradhapura · Polonnaruwa · Sigiriya · Kandy"},
  nature:{title:"Sri Lanka Big Three Parks",usd:1020,route:"Sigiriya · Udawalawe · Yala"},
  hills:{title:"Trains, Tea and Waterfalls",usd:900,route:"Kandy · Nuwara Eliya · Ella · Kitulgala"},
  coast:{title:"Tangalle and Hiriketiya Retreat",usd:750,route:"Tangalle"},
};
const numberFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const uid = () => Math.random().toString(36).slice(2, 9);

function buildPlan(count: number, style: string, interest: string): PlanDay[] {
  const source = routes[interest]?.length ? routes[interest] : routes.mix;
  return Array.from({ length: count }, (_, index) => {
    const entry = source[index % source.length];
    return {
      id: uid(), location: entry[0], title: entry[1], travel: entry[2],
      activities: entry[3].map((activity) => {
        const priced = costCatalog[activity[1]];
        return ({
        id: uid(), time: activity[0], title: activity[1], detail: activity[2],
        cost: priced?.cost ?? estimatedActivity[style], source: priced?.source, priceType: priced?.type ?? "estimate",
      })}),
    };
  });
}

export function Planner({ initialDays, initialStyle, initialInterest, savedPlan, signedIn }: { initialDays: number; initialStyle: string; initialInterest: string; savedPlan: Plan | null; signedIn: boolean }) {
  const [trip, setTrip] = useState<Plan>(() => savedPlan ?? ({ tripId: null, name: "My Sri Lanka journey", travelers: 2, style: initialStyle, interest: initialInterest, days: buildPlan(initialDays, initialStyle, initialInterest) }));
  const [openDay, setOpenDay] = useState(0);
  const [saved, setSaved] = useState(false);
  const [accountMessage, setAccountMessage] = useState("");
  const [savingAccount, startSavingAccount] = useTransition();

  useEffect(() => {
    if (savedPlan) { setSaved(true); return; }
    const stored = localStorage.getItem("serendib-itinerary");
    if (stored) try { setTrip(JSON.parse(stored)); setSaved(true); } catch {}
  }, [savedPlan]);
  useEffect(() => {
    localStorage.setItem("serendib-itinerary", JSON.stringify(trip));
    const timer = window.setTimeout(() => setSaved(true), 250);
    setSaved(false);
    return () => window.clearTimeout(timer);
  }, [trip]);

  const total = useMemo(() => trip.days.reduce((sum, day) => sum + day.activities.reduce((daySum, item) => daySum + item.cost, 0) + dailyAllowance[trip.style], 0) * trip.travelers, [trip]);
  const updateDay = (index: number, patch: Partial<PlanDay>) => setTrip(current => ({ ...current, days: current.days.map((day, i) => i === index ? { ...day, ...patch } : day) }));
  const updateActivity = (dayIndex: number, id: string, patch: Partial<Activity>) => updateDay(dayIndex, { activities: trip.days[dayIndex].activities.map(item => item.id === id ? { ...item, ...patch } : item) });
  const regenerate = () => { setTrip(current => ({ ...current, days: buildPlan(current.days.length, current.style, current.interest) })); setOpenDay(0); };
  const saveToAccount = () => startSavingAccount(async () => {
    setAccountMessage("");
    const result = await saveItinerary({ tripId: trip.tripId, name: trip.name, travelers: trip.travelers, style: trip.style, interest: trip.interest, days: trip.days });
    if (result.error) setAccountMessage(result.error);
    else {
      setTrip(current => ({ ...current, tripId: result.tripId }));
      setAccountMessage("Saved to your journeys.");
      if (result.tripId) window.history.replaceState(null, "", `/planner?trip=${result.tripId}`);
    }
  });

  return <main className={styles.page}>
    <header className={styles.header}>
      <nav><Link className={styles.brand} href="/"><BrandLogo/></Link><Link href="/"><ArrowLeft size={16}/> Back to discover</Link></nav>
      <div className={styles.heading}><div><p>Your island, mapped out</p><input aria-label="Trip name" value={trip.name} onChange={e => setTrip({ ...trip, name: e.target.value })}/><span className={styles.saveState}>{saved ? "Draft saved on this device" : "Saving draft…"}</span></div><div className={styles.actions}><button onClick={() => window.print()}><Printer size={16}/> Print</button>{signedIn ? <button className={styles.accountSave} onClick={saveToAccount} disabled={savingAccount}>{accountMessage.startsWith("Saved") ? <Check size={16}/> : <Cloud size={16}/>} {savingAccount ? "Saving…" : trip.tripId ? "Update journey" : "Save to journeys"}</button> : <Link href="/auth/login?next=/planner"><LogIn size={16}/> Sign in to save</Link>}</div></div>
      {accountMessage && <p className={accountMessage.startsWith("Saved") ? styles.accountSuccess : styles.accountError}>{accountMessage}</p>}
    </header>

    <section className={styles.controls} aria-label="Itinerary settings">
      <label><CalendarDays size={17}/><span>Trip length</span><select value={trip.days.length} onChange={e => setTrip({ ...trip, days: buildPlan(Number(e.target.value), trip.style, trip.interest) })}>{[5,7,10,14].map(n => <option key={n} value={n}>{n} days</option>)}</select></label>
      <label><Users size={17}/><span>Travelers</span><input type="number" min="1" max="12" value={trip.travelers} onChange={e => setTrip({ ...trip, travelers: Math.max(1, Number(e.target.value)) })}/></label>
      <label><CircleDollarSign size={17}/><span>Travel style</span><select value={trip.style} onChange={e => setTrip({ ...trip, style: e.target.value })}><option value="budget">Budget</option><option value="comfort">Comfort</option><option value="luxury">Luxury</option></select></label>
      <label><Sparkles size={17}/><span>Journey focus</span><select value={trip.interest} onChange={e => { const interest=e.target.value; setTrip({ ...trip, interest, days:buildPlan(trip.days.length,trip.style,interest)}); setOpenDay(0); }}><option value="mix">Island highlights</option><option value="heritage">Cultural heritage</option><option value="buddhist">Buddhist heritage</option><option value="nature">Nature & wildlife</option><option value="hills">Hill country & tea</option><option value="coast">Coast & surf</option></select></label>
      <button className={styles.regenerate} onClick={regenerate}><RotateCcw size={16}/> Rebuild route</button>
    </section>

    <section className={styles.suggestions}>
      <div className={styles.suggestionIntro}><span><Landmark size={16}/> Best matches</span><h2>Ideal places for {trip.interest === "mix" ? "your first island journey" : trip.interest.replace("heritage","heritage travel")}</h2><p>Changing the focus updates both these recommendations and the complete day-by-day route.</p></div>
      <div className={styles.placeCards}>{(recommendations[trip.interest] ?? recommendations.mix).map((place,index)=><button key={place.name} onClick={()=>{const dayIndex=trip.days.findIndex(day=>day.location.includes(place.name.split(" ")[0]));if(dayIndex>=0)setOpenDay(dayIndex)}}><span>0{index+1}</span><small>{place.region}</small><strong>{place.name}</strong><p>{place.note}</p><ArrowLeft size={16}/></button>)}</div>
    </section>

    <div className={styles.layout}>
      <aside className={styles.summary}>
        <p className={styles.eyebrow}>Journey overview</p><h2>{trip.days.length} days across Sri Lanka</h2>
        <div className={styles.route}>{trip.days.map((day, index) => <button key={day.id} onClick={() => setOpenDay(index)} className={openDay === index ? styles.activeStop : ""}><span>{index + 1}</span><div><strong>{day.location}</strong><small>{day.title}</small></div></button>)}</div>
        <div className={styles.total}><span>Estimated trip total</span><strong>LKR {numberFormatter.format(total)}</strong><small>For {trip.travelers} traveler{trip.travelers === 1 ? "" : "s"} · stay, meals, local travel and listed activities</small></div>
        <div className={styles.benchmark}><BadgeDollarSign size={18}/><div><span>Package benchmark</span><strong>{(benchmarks[trip.interest] ?? benchmarks.mix).title}</strong><small>From USD {numberFormatter.format((benchmarks[trip.interest] ?? benchmarks.mix).usd)} pp · {(benchmarks[trip.interest] ?? benchmarks.mix).route}</small><a href={PACKAGE_SOURCE} target="_blank" rel="noreferrer">View reference package <ExternalLink size={11}/></a></div></div>
        <p className={styles.costNote}>Published attraction fees use the Central Cultural Fund rate dated 15 July 2026. Other amounts are planning estimates and should be confirmed before booking.</p>
      </aside>

      <section className={styles.days} aria-label="Day by day itinerary">
        {trip.days.map((day, dayIndex) => <article className={styles.day} key={day.id}>
          <button className={styles.dayHead} onClick={() => setOpenDay(openDay === dayIndex ? -1 : dayIndex)} aria-expanded={openDay === dayIndex}>
            <span className={styles.dayNumber}>Day {dayIndex + 1}</span><span><strong>{day.location}</strong><small>{day.title}</small></span>{openDay === dayIndex ? <ChevronUp/> : <ChevronDown/>}
          </button>
          {openDay === dayIndex && <div className={styles.dayBody}>
            <div className={styles.dayFields}><label>Overnight in<input value={day.location} onChange={e => updateDay(dayIndex, { location: e.target.value })}/></label><label>Day theme<input value={day.title} onChange={e => updateDay(dayIndex, { title: e.target.value })}/></label></div>
            <p className={styles.travel}><MapPin size={15}/>{day.travel}</p>
            <div className={styles.activityList}>{day.activities.map(item => <div className={styles.activity} key={item.id}>
              <label className={styles.time}><Clock3 size={15}/><input aria-label="Start time" type="time" value={item.time} onChange={e => updateActivity(dayIndex, item.id, { time: e.target.value })}/></label>
              <div><input className={styles.activityTitle} aria-label="Activity title" value={item.title} onChange={e => updateActivity(dayIndex, item.id, { title: e.target.value })}/><textarea aria-label="Activity notes" value={item.detail} onChange={e => updateActivity(dayIndex, item.id, { detail: e.target.value })}/><span className={styles.priceMeta}>{item.priceType === "published" ? "Published fee" : item.priceType === "free" ? "Free entry" : "Planning estimate"}{item.source&&<a href={item.source} target="_blank" rel="noreferrer"> source <ExternalLink size={10}/></a>}</span></div>
              <label className={styles.cost}>LKR<input aria-label="Estimated cost" type="number" step="500" min="0" value={item.cost} onChange={e => updateActivity(dayIndex, item.id, { cost: Number(e.target.value) })}/></label>
              <button className={styles.delete} aria-label={`Remove ${item.title}`} onClick={() => updateDay(dayIndex, { activities: day.activities.filter(activity => activity.id !== item.id) })}><Trash2 size={16}/></button>
            </div>)}</div>
            <button className={styles.add} onClick={() => updateDay(dayIndex, { activities: [...day.activities, { id: uid(), time: "12:00", title: "New activity", detail: "Add a note or booking detail", cost: 0 }] })}><Plus size={16}/> Add activity</button>
          </div>}
        </article>)}
      </section>
    </div>
  </main>;
}
