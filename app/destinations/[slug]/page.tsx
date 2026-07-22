import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, MapPin } from "lucide-react";
import { getDestination } from "@/src/features/destinations/queries";
import { createClient } from "@/src/lib/supabase/server";
import { FavoriteButton } from "@/src/features/favorites/favorite-button";
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
  if (user && !destination.id.startsWith("fallback-")) {
    const { data } = await supabase.from("favorites").select("user_id").eq("user_id", user.id).eq("destination_id", destination.id).maybeSingle();
    saved = Boolean(data);
  }

  const bestTime = destination.bestMonths.map((month) => monthNames[month - 1]).join(", ");
  const mapsUrl = `https://www.openstreetmap.org/?mlat=${destination.latitude}&mlon=${destination.longitude}#map=13/${destination.latitude}/${destination.longitude}`;

  return <main className={styles.page}>
    <header className={styles.detailHero}>
      <Image src={destination.image} alt={`${destination.name}, Sri Lanka`} fill priority sizes="100vw"/>
      <div className={styles.shade}/>
      <nav className={styles.nav}>
        <Link className={styles.brand} href="/"><span className={styles.brandMark}>S</span>serendib</Link>
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
        <div className={styles.fact}><span>Entry fee</span><strong>{destination.entryFeeLkr ? `LKR ${destination.entryFeeLkr.toLocaleString()}` : "Check locally"}</strong></div>
        <a className={styles.mapLink} href={mapsUrl} target="_blank" rel="noreferrer"><MapPin size={17}/> View on OpenStreetMap</a>
        {!destination.id.startsWith("fallback-") && <FavoriteButton destinationId={destination.id} slug={destination.slug} saved={saved}/>}
      </aside>
    </section>
  </main>;
}
