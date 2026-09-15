import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, MapPin, Star } from "lucide-react";
import { getDestination } from "@/src/features/destinations/queries";
import { createClient } from "@/src/lib/supabase/server";
import { FavoriteButton } from "@/src/features/favorites/favorite-button";
import { getDestinationGuide } from "@/src/features/destinations/guide-data";
import { PracticalGuide } from "./destination-guide";
import { ReviewForm } from "@/src/features/reviews/review-form";
import { BrandLogo } from "@/src/components/brand-logo";
import styles from "../destinations.module.css";

export const dynamic = "force-dynamic";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestination(slug);
  return destination ? { title: `${destination.name} | Serendib`, description: destination.summary } : {};
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const destination = await getDestination(slug);
  if (!destination) notFound();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let saved = false;
  let reviews: Array<{ id:string; rating:number; title:string|null; body:string; created_at:string; profiles:{display_name:string|null}|null }> = [];
  if (user && !destination.id.startsWith("fallback-")) {
    const { data } = await supabase.from("favorites").select("user_id").eq("user_id", user.id).eq("destination_id", destination.id).maybeSingle();
    saved = Boolean(data);
  }
  if (!destination.id.startsWith("fallback-")) {
    const { data } = await supabase.from("reviews").select("id,rating,title,body,created_at,profiles(display_name)").eq("destination_id",destination.id).eq("status","published").order("created_at",{ascending:false}).limit(6);
    reviews = (data ?? []) as unknown as typeof reviews;
  }

  const bestTime = destination.bestMonths.map((month) => monthNames[month - 1]).join(", ");
  const mapsUrl = `https://www.openstreetmap.org/?mlat=${destination.latitude}&mlon=${destination.longitude}#map=13/${destination.latitude}/${destination.longitude}`;
  const guide = getDestinationGuide(destination.slug);
  const firstTag = destination.tags?.[0] ?? "mix";
  const focus = ({ heritage:"heritage", buddhist:"buddhist", hills:"hills", wildlife:"nature", nature:"nature", coast:"coast" } as Record<string,string>)[firstTag] ?? "mix";

  return <main className={styles.page}>
    <header className={styles.detailHero}>
      <Image src={destination.image} alt={`${destination.name}, Sri Lanka`} fill priority sizes="100vw"/>
      <div className={styles.shade}/>
      <nav className={styles.nav}>
        <Link className={styles.brand} href="/"><BrandLogo/></Link>
        <Link className={styles.back} href="/destinations"><ArrowLeft size={16}/> All destinations</Link>
      </nav>
      <div className={styles.detailCopy}>
        <span className={styles.eyebrow}>{destination.province} Province · {destination.district ?? "Sri Lanka"}</span>
        <h1>{destination.name}</h1><p>{destination.summary}</p>
      </div>
    </header>
    <section className={styles.details}>
      <article className={styles.story}>
        <h2>Why go</h2><p>{destination.description ?? destination.summary}</p>
        <div className={styles.highlights}><h3>Don't miss</h3><ul>{destination.highlights.map((highlight) => <li key={highlight}><Check size={17}/>{highlight}</li>)}</ul></div>
      </article>
      <aside className={styles.facts}>
        <h2>Plan your visit</h2>
        <div className={styles.fact}><span>Best months</span><strong>{bestTime || "Year-round"}</strong></div>
        <div className={styles.fact}><span>Region</span><strong>{destination.district ?? destination.province}</strong></div>
        <div className={styles.fact}><span>Ideal stay</span><strong>{destination.idealDays ?? "1–2 days"}</strong></div>
        <div className={styles.fact}><span>Entry fee</span><strong>{destination.entryFeeLkr ? `LKR ${new Intl.NumberFormat("en-US").format(destination.entryFeeLkr)}` : "Check locally"}</strong></div>
        <a className={styles.mapLink} href={mapsUrl} target="_blank" rel="noreferrer"><MapPin size={17}/> View on OpenStreetMap</a>
        {!destination.id.startsWith("fallback-") && <FavoriteButton destinationId={destination.id} slug={destination.slug} saved={saved}/>}
      </aside>
    </section>
    <PracticalGuide guide={guide} name={destination.name} latitude={destination.latitude} longitude={destination.longitude} focus={focus}/>
    <section className={styles.reviewsSection}>
      <div className={styles.reviewsHeading}><span className={styles.eyebrow}>Traveler notes</span><h2>What people remember.</h2><p>Honest, practical observations from travelers who have experienced {destination.name}.</p></div>
      <div className={styles.reviewLayout}><div className={styles.reviewList}>{reviews.length?reviews.map(review=><article key={review.id}><div className={styles.reviewStars}>{[1,2,3,4,5].map(value=><Star key={value} size={14} fill={value<=review.rating?"currentColor":"none"}/>)}</div><h3>{review.title??"A traveler’s perspective"}</h3><p>{review.body}</p><span>{review.profiles?.display_name??"Serendib traveler"} · {new Intl.DateTimeFormat("en-US",{month:"short",year:"numeric"}).format(new Date(review.created_at))}</span></article>):<div className={styles.noReviews}><Star size={30}/><h3>Be the first published voice</h3><p>Thoughtful reviews help travelers plan with confidence.</p></div>}</div><ReviewForm destinationId={destination.id} slug={destination.slug} signedIn={Boolean(user)}/></div>
    </section>
  </main>;
}
