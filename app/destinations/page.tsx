import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getDestinations } from "@/src/features/destinations/queries";
import styles from "./destinations.module.css";

export const dynamic = "force-dynamic";

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return <main className={styles.page}>
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link className={styles.brand} href="/"><span className={styles.brandMark}>S</span>serendib</Link>
        <Link className={styles.back} href="/"><ArrowLeft size={16}/> Back home</Link>
      </nav>
      <div className={styles.hero}>
        <div><span className={styles.eyebrow}>Explore the island</span><h1>Places worth<br/>the journey.</h1></div>
        <p>From sacred cities and cloud forests to surf towns and living forts, find the places that make Sri Lanka unforgettable.</p>
      </div>
    </header>
    <section className={styles.grid} aria-label="Sri Lanka destinations">
      {destinations.map((destination) => <article className={styles.card} key={destination.id}>
        <div className={styles.image}><Image src={destination.image} alt={`${destination.name}, Sri Lanka`} fill sizes="(max-width: 800px) 100vw, 33vw"/></div>
        <div className={styles.content}>
          <span className={styles.region}>{destination.province} Province</span>
          <h2>{destination.name}</h2><p>{destination.summary}</p>
          <Link className={styles.explore} href={`/destinations/${destination.slug}`}>Explore destination <ArrowRight size={17}/></Link>
        </div>
      </article>)}
    </section>
  </main>;
}
