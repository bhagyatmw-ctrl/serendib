"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, MapPin, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import type { DestinationView } from "@/src/features/destinations/catalog";
import styles from "./destinations.module.css";

const filters = [
  ["all","All places"],["heritage","Heritage"],["buddhist","Sacred"],["hills","Hill country"],
  ["wildlife","Wildlife"],["coast","Coast"],["adventure","Adventure"],
];
const focusMap: Record<string,string> = {heritage:"heritage",buddhist:"buddhist",hills:"hills",wildlife:"nature",nature:"nature",coast:"coast",adventure:"nature"};

export function DestinationExplorer({ destinations }: { destinations: DestinationView[] }) {
  const [query,setQuery]=useState("");
  const [filter,setFilter]=useState("all");
  const [region,setRegion]=useState("all");
  const regions=useMemo(()=>Array.from(new Set(destinations.map(item=>item.province))).sort(),[destinations]);
  const visible=useMemo(()=>destinations.filter(destination=>{
    const text=`${destination.name} ${destination.province} ${destination.district} ${destination.summary} ${(destination.tags??[]).join(" ")}`.toLowerCase();
    return (!query||text.includes(query.toLowerCase()))&&(filter==="all"||(destination.tags??[]).includes(filter))&&(region==="all"||destination.province===region);
  }),[destinations,query,filter,region]);
  const clear=()=>{setQuery("");setFilter("all");setRegion("all")};

  return <section className={styles.explorer}>
    <div className={styles.searchBar}>
      <label><Search size={19}/><span>Search the island</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try Sigiriya, beaches, wildlife…"/></label>
      <label><MapPin size={18}/><span>Region</span><select value={region} onChange={e=>setRegion(e.target.value)}><option value="all">Every province</option>{regions.map(item=><option key={item}>{item}</option>)}</select></label>
      <div className={styles.resultCount}><strong>{visible.length}</strong><span>places found</span></div>
    </div>
    <div className={styles.filterRow}><span><SlidersHorizontal size={15}/> Travel style</span>{filters.map(([value,label])=><button key={value} className={filter===value?styles.selectedFilter:""} onClick={()=>setFilter(value)}>{label}</button>)}</div>
    {visible.length ? <div className={styles.grid} aria-label="Sri Lanka destinations">
      {visible.map((destination,index)=><article className={styles.card} key={destination.id}>
        <div className={styles.image}><Image src={destination.image} alt={`${destination.name}, Sri Lanka`} fill sizes="(max-width: 800px) 100vw, 33vw"/><span className={styles.cardIndex}>{String(index+1).padStart(2,"0")}</span><div className={styles.tagCloud}>{(destination.tags??["culture"]).slice(0,2).map(tag=><span key={tag}>{tag}</span>)}</div></div>
        <div className={styles.content}><span className={styles.region}>{destination.province} Province</span><h2>{destination.name}</h2><p>{destination.summary}</p><div className={styles.cardMeta}><span><CalendarDays size={14}/>{destination.idealDays??"1–2 days"}</span><span><MapPin size={14}/>{destination.district??destination.province}</span></div><div className={styles.cardActions}><Link className={styles.explore} href={`/destinations/${destination.slug}`}>Explore <ArrowRight size={16}/></Link><Link className={styles.planLink} href={`/planner?interest=${focusMap[(destination.tags??[])[0]]??"mix"}&days=7`}><Sparkles size={14}/> Add to plan</Link></div></div>
      </article>)}
    </div>:<div className={styles.noResults}><Search size={30}/><h2>No island matches yet</h2><p>Try another place, theme or province.</p><button onClick={clear}><X size={15}/> Clear filters</button></div>}
  </section>;
}
