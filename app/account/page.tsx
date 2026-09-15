import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BookOpen, CalendarDays, Heart, Map, Sparkles, Star } from "lucide-react";
import { createClient } from "@/src/lib/supabase/server";
import { signOut } from "@/src/features/auth/actions";
import { ProfileForm } from "@/src/features/auth/profile-form";
import { TripForm } from "@/src/features/trips/trip-form";
import { deleteTrip } from "@/src/features/trips/actions";
import { getDestinations } from "@/src/features/destinations/queries";
import styles from "./account.module.css";
import featureStyles from "./features.module.css";
import { BrandLogo } from "@/src/components/brand-logo";

export const dynamic = "force-dynamic";
type Trip = { id: string; title: string; start_date: string | null; end_date: string | null; party_size: number; budget_level: string };

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  const [p, tc, fc, rc, tl, fl, destinations] = await Promise.all([
    supabase.from("profiles").select("display_name, home_country").eq("id", user.id).maybeSingle(),
    supabase.from("trips").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("favorites").select("user_id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("reviews").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("trips").select("id,title,start_date,end_date,party_size,budget_level").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(10),
    supabase.from("favorites").select("destination_id").eq("user_id", user.id).not("destination_id", "is", null),
    getDestinations(),
  ]);
  const profile = p.data as unknown as { display_name: string | null; home_country: string | null } | null;
  const name = profile?.display_name || user.user_metadata.full_name || user.email?.split("@")[0] || "Traveler";
  const trips = (tl.data ?? []) as unknown as Trip[];
  const ids = new Set(((fl.data ?? []) as unknown as { destination_id: string | null }[]).map(x => x.destination_id));
  const favorites = destinations.filter(x => ids.has(x.id));

  return <main className={styles.page}>
    <nav className={styles.nav}><Link className={styles.brand} href="/"><BrandLogo/></Link><Link className={styles.homeLink} href="/">Home</Link><div className={styles.navLinks}><Link href="/destinations">Explore</Link><Link href="#planner">Itinerary planner</Link><Link href="#favorites">Favorites</Link><Link href="#profile">Profile</Link></div><form action={signOut}><button className={styles.signout}>Sign out</button></form></nav>
    <header className={styles.hero}><span className={styles.eyebrow}>Your travel space</span><h1>Ayubowan, {name}.</h1><p>Keep your ideas, journeys, and island discoveries together.</p></header>
    <div className={styles.content}>
      <section className={styles.stats}><article className={styles.stat}><Map size={23}/><strong>{tc.count ?? 0}</strong><span>Saved trips</span></article><article className={styles.stat}><Heart size={23}/><strong>{fc.count ?? 0}</strong><span>Favorite places</span></article><article className={styles.stat}><Star size={23}/><strong>{rc.count ?? 0}</strong><span>Reviews shared</span></article></section>
      <section className={styles.plannerCard} id="planner">
        <div className={styles.plannerVisual}><span className={styles.sun}/><span className={styles.routeLine}/><i className={styles.stopOne}/><i className={styles.stopTwo}/><i className={styles.stopThree}/><div className={styles.plannerBadge}><CalendarDays size={17}/><span>Day by day</span></div></div>
        <div className={styles.plannerCopy}><span className={styles.eyebrow}>Interactive itinerary studio</span><h2>Shape your island journey.</h2><p>Generate a route, open each day, change stops and times, add activities, track costs, and print the finished plan.</p><div className={styles.plannerChips}><span>Smart routes</span><span>Live budget</span><span>Auto-saved</span></div><Link href="/planner"><Sparkles size={17}/> Open itinerary planner <ArrowRight size={17}/></Link></div>
      </section>
      <section className={styles.sections} id="trips">
        <article className={styles.panel}><h2>Your saved journeys</h2><p className={styles.panelLead}>Resume a trip in the visual planner, or keep a simple trip record below.</p>
          {trips.length ? <div className={featureStyles.tripList}>{trips.map(t => {
            const days = t.start_date && t.end_date ? Math.max(5, Math.min(14, Math.round((new Date(t.end_date).getTime() - new Date(t.start_date).getTime()) / 86400000) + 1)) : 7;
            return <article className={featureStyles.tripItem} key={t.id}><div><strong>{t.title}</strong><span>{t.start_date ? `${t.start_date}${t.end_date ? ` to ${t.end_date}` : ""}` : "Dates not set"} · {t.party_size} traveler{t.party_size === 1 ? "" : "s"} · {t.budget_level}</span></div><div className={featureStyles.tripActions}><Link href={`/planner?trip=${t.id}&days=${days}&style=${t.budget_level}&interest=mix`}>Plan itinerary <ArrowRight size={14}/></Link><form action={deleteTrip}><input type="hidden" name="tripId" value={t.id}/><button>Delete</button></form></div></article>;
          })}</div> : <div className={styles.empty}><BookOpen size={28}/><p>No saved trips yet.</p><Link href="/planner">Create an itinerary</Link></div>}
          <details className={styles.simpleTrip}><summary>Save trip dates and preferences</summary><TripForm/></details>
        </article>
        <aside className={styles.panel} id="profile"><h2>Your profile</h2><p className={styles.panelLead}>{user.email}</p><ProfileForm displayName={name} homeCountry={profile?.home_country ?? ""}/></aside>
      </section>
      <section className={`${styles.panel} ${featureStyles.favoritePanel}`} id="favorites"><h2>Favorite destinations</h2>{favorites.length ? <div className={featureStyles.favoriteList}>{favorites.map(d => <Link href={`/destinations/${d.slug}`} key={d.id}><Heart size={16} fill="currentColor"/><span><strong>{d.name}</strong><small>{d.province} Province</small></span></Link>)}</div> : <div className={styles.empty}><Heart size={28}/><p>Save destinations to find them here.</p><Link href="/destinations">Explore destinations</Link></div>}</section>
    </div>
  </main>;
}
