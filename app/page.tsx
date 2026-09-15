import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Compass, Map, Play, Sparkles, WalletCards } from "lucide-react";
import { isSupabaseConfigured } from "@/src/lib/env";
import { createClient } from "@/src/lib/supabase/server";
import { BrandLogo } from "@/src/components/brand-logo";

export const dynamic = "force-dynamic";

type FeaturedDestination = {
  slug: string;
  name: string;
  region: string;
  image: string;
  blurb: string;
};

const destinationImages: Record<string, string> = {
  sigiriya: "https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=85",
  ella: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=85",
  "galle-fort": "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=85",
};

const fallbackDestinations: FeaturedDestination[] = [
  {
    slug: "sigiriya",
    name: "Sigiriya",
    region: "Cultural Triangle",
    image: destinationImages.sigiriya,
    blurb: "Climb an ancient rock fortress above emerald forest.",
  },
  {
    slug: "ella",
    name: "Ella",
    region: "Central Highlands",
    image: destinationImages.ella,
    blurb: "Ride through tea country and mist-wrapped mountains.",
  },
  {
    slug: "galle-fort",
    name: "Galle Fort",
    region: "Southern Province",
    image: destinationImages["galle-fort"],
    blurb: "Walk historic ramparts where the old city meets the sea.",
  },
];

async function getFeaturedDestinations(): Promise<FeaturedDestination[]> {
  if (!isSupabaseConfigured) return fallbackDestinations;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("destinations")
      .select("slug, name, province, summary")
      .eq("status", "published")
      .eq("featured", true)
      .order("name")
      .limit(3);

    if (error || !data?.length) return fallbackDestinations;

    const rows = data as unknown as Array<{
      slug: string;
      name: string;
      province: string;
      summary: string;
    }>;

    return rows.map((destination) => ({
      slug: destination.slug,
      name: destination.name,
      region: destination.province,
      blurb: destination.summary,
      image: destinationImages[destination.slug] ?? destinationImages.sigiriya,
    }));
  } catch {
    return fallbackDestinations;
  }
}

const features = [
  { icon: Sparkles, title: "A trip made for you", text: "Tell us your pace, interests, and budget. We will shape the route." },
  { icon: Map, title: "Everything on one map", text: "Save sights, stays, food, and experiences without juggling tabs." },
  { icon: WalletCards, title: "Know before you go", text: "See realistic cost ranges and keep your plan within budget." },
];

export default async function Home() {
  const destinations = await getFeaturedDestinations();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <main>
      <section className="hero">
        <video className="heroMedia" autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=2000&q=90">
          <source src="/media/sri-lanka-hero.mp4" type="video/mp4" />
        </video>
        <div className="heroShade" />
        <nav className="nav shell" aria-label="Main navigation">
          <Link className="brand" href="/" aria-label="Serendib home"><BrandLogo/></Link>
          <div className="navLinks"><Link href="/destinations">Discover</Link><Link href="#plan">Plan a trip</Link><Link href="/stories">Stories</Link><Link href="/travel-tools">Travel tools</Link></div>
          <Link className="navCta" href={user ? "/account" : "/auth/login"}>{user ? "My account" : "Sign in"} <ArrowRight size={16} /></Link>
        </nav>

        <div className="heroContent shell">
          <p className="eyebrow"><Compass size={16} /> Island journeys, thoughtfully made</p>
          <h1>Find your way<br />to <em>wonder.</em></h1>
          <p className="heroCopy">From misty tea country to sunlit shores, build a Sri Lankan journey that feels entirely your own.</p>
          <div className="heroActions">
            <Link href="#plan" className="primaryButton">Plan my journey <ArrowRight size={18} /></Link>
            <button className="watchButton"><span className="play"><Play size={15} fill="currentColor" /></span> Watch the island story</button>
          </div>
        </div>

        <div className="heroFoot shell">
          <span>Scroll to explore</span><span className="line" />
          <div className="quickFacts"><span>25°C–30°C</span><span>Year-round journeys</span><span>8 UNESCO sites</span></div>
        </div>
      </section>

      <section className="intro shell" id="discover">
        <div><p className="sectionLabel">A small island. A thousand stories.</p><h2>Travel deeper than<br />the postcard.</h2></div>
        <p className="introCopy">Sri Lanka rewards curiosity. We bring the island’s places, people, flavours, and practical details together—so you can spend less time searching and more time experiencing.</p>
      </section>

      <section className="destinationGrid shell" aria-label="Featured destinations">
        {destinations.map((destination, index) => (
          <article className={`destinationCard card${index + 1}`} key={destination.name}>
            <Image src={destination.image} alt={`${destination.name}, Sri Lanka`} fill sizes="(max-width: 800px) 100vw, 33vw" />
            <div className="cardShade" /><div className="cardCopy"><span>{destination.region}</span><h3>{destination.name}</h3><p>{destination.blurb}</p><Link href={`/destinations/${destination.slug}`} aria-label={`Explore ${destination.name}`}><ArrowRight size={18} /></Link></div>
          </article>
        ))}
      </section>

      <section className="planner" id="plan">
        <div className="shell plannerInner">
          <div><p className="sectionLabel light">Your journey, your rhythm</p><h2>A better trip starts<br />with a better plan.</h2></div>
          <form className="plannerForm" action="/planner">
            <label><span><CalendarDays size={16} /> Length</span><select name="days" defaultValue="7"><option value="5">5 days</option><option value="7">7 days</option><option value="10">10 days</option><option value="14">14 days</option></select></label>
            <label><span><WalletCards size={16} /> Travel style</span><select name="style" defaultValue="comfort"><option value="budget">Budget</option><option value="comfort">Comfort</option><option value="luxury">Luxury</option></select></label>
            <label><span><Compass size={16} /> Most interested in</span><select name="interest" defaultValue="mix"><option value="mix">A little of everything</option><option value="heritage">Cultural heritage</option><option value="buddhist">Buddhist heritage</option><option value="nature">Nature & wildlife</option><option value="hills">Hill country & tea</option><option value="coast">Beaches & surf</option></select></label>
            <button type="submit">Create my itinerary <Sparkles size={17} /></button>
          </form>
        </div>
      </section>

      <section className="features shell" id="about">
        {features.map(({ icon: Icon, title, text }) => <article key={title}><Icon size={24} /><h3>{title}</h3><p>{text}</p></article>)}
      </section>

      <footer><div className="shell"><Link className="brand dark" href="/"><BrandLogo/></Link><p>Your thoughtful companion for exploring Sri Lanka.</p><span>© 2026 Serendib</span></div></footer>
    </main>
  );
}
