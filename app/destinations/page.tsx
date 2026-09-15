import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getDestinations } from "@/src/features/destinations/queries";
import { DestinationExplorer } from "./destination-explorer";
import styles from "./destinations.module.css";
import { BrandLogo } from "@/src/components/brand-logo";

export const dynamic = "force-dynamic";

export default async function DestinationsPage() {
  const destinations = await getDestinations();
  return <main className={styles.page}>
    <header className={styles.header}>
      <nav className={styles.nav}><Link className={styles.brand} href="/"><BrandLogo/></Link><Link className={styles.back} href="/"><ArrowLeft size={16}/> Back home</Link></nav>
      <div className={styles.hero}><div><span className={styles.eyebrow}>Explore the island</span><h1>Find your<br/>kind of wonder.</h1></div><p>Search by place, region or travel style. Compare the ideal time to stay, then carry your favourites straight into the itinerary planner.</p></div>
    </header>
    <DestinationExplorer destinations={destinations}/>
  </main>;
}
