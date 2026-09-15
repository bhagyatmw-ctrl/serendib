"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BedDouble, Bus, CloudRain, ExternalLink, LoaderCircle, Sparkles, Sun, UtensilsCrossed } from "lucide-react";
import type { DestinationGuide } from "@/src/features/destinations/guide-data";
import styles from "../destinations.module.css";

type Forecast = { current:{temperature_2m:number;apparent_temperature:number;weather_code:number};daily:{time:string[];temperature_2m_max:number[];temperature_2m_min:number[];precipitation_probability_max:number[]} };
const tabs=[["stay","Stay",BedDouble],["eat","Eat",UtensilsCrossed],["do","Experience",Sparkles],["transport","Get around",Bus]] as const;
const condition=(code:number)=>code<2?"Clear":code<4?"Partly cloudy":code<60?"Cloudy":code<80?"Rain showers":"Stormy";

export function PracticalGuide({guide,name,latitude,longitude,focus}:{guide:DestinationGuide;name:string;latitude:number;longitude:number;focus:string}){
 const[tab,setTab]=useState<keyof DestinationGuide>("stay");const[weather,setWeather]=useState<Forecast|null>(null);const[weatherError,setWeatherError]=useState(false);
 useEffect(()=>{let live=true;fetch(`/api/weather?lat=${latitude}&lon=${longitude}`).then(r=>{if(!r.ok)throw new Error();return r.json()}).then(data=>{if(live)setWeather(data)}).catch(()=>{if(live)setWeatherError(true)});return()=>{live=false}},[latitude,longitude]);
 return <section className={styles.guideSection}>
  <div className={styles.guideHeading}><span className={styles.eyebrow}>Build your visit</span><h2>A practical guide to {name}</h2><p>Browse considered starting points, compare indicative prices, and carry this destination into your route.</p></div>
  <div className={styles.weatherCard}>{weather?<><div><span>Right now</span><strong>{Math.round(weather.current.temperature_2m)}°C</strong><small>Feels like {Math.round(weather.current.apparent_temperature)}° · {condition(weather.current.weather_code)}</small></div><div className={styles.forecast}>{weather.daily.time.slice(1,4).map((date,index)=><span key={date}>{new Intl.DateTimeFormat("en-US",{weekday:"short"}).format(new Date(`${date}T12:00:00Z`))}<strong>{Math.round(weather.daily.temperature_2m_max[index+1])}°</strong><small>{weather.daily.precipitation_probability_max[index+1]}% rain</small></span>)}</div></>:weatherError?<div><CloudRain/><strong>Forecast unavailable</strong><small>Check again shortly.</small></div>:<div><LoaderCircle className={styles.spinner}/><strong>Loading live weather</strong></div>}<a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Weather by Open-Meteo <ExternalLink size={11}/></a></div>
  <div className={styles.guideTabs} role="tablist">{tabs.map(([key,label,Icon])=><button key={key} role="tab" aria-selected={tab===key} className={tab===key?styles.activeTab:""} onClick={()=>setTab(key)}><Icon size={17}/>{label}</button>)}</div>
  <div className={styles.guideGrid}>{guide[tab].map((item,index)=><article key={item.name}><span>0{index+1}</span><small>{item.meta}</small><h3>{item.name}</h3><p>{item.detail}</p><strong>{item.price}</strong></article>)}</div>
  <div className={styles.planBanner}><div><Sun size={26}/><span>Ready to shape the route?</span><strong>Add {name} to a personalised Sri Lanka itinerary.</strong></div><Link href={`/planner?interest=${focus}&days=7`}>Plan this journey <ArrowRight size={16}/></Link></div>
 </section>
}
