import { isSupabaseConfigured } from "@/src/lib/env";
import { createClient } from "@/src/lib/supabase/server";
import { decorateDestination, fallbackDestinations, type DestinationView } from "./catalog";

type DestinationRow = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string | null;
  province: string;
  district: string | null;
  latitude: number;
  longitude: number;
  entry_fee_lkr: number | null;
  best_months: number[];
};

function toView(row: DestinationRow): DestinationView {
  return decorateDestination({
    id: row.id,
    slug: row.slug,
    name: row.name,
    summary: row.summary,
    description: row.description,
    province: row.province,
    district: row.district,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    entryFeeLkr: row.entry_fee_lkr === null ? null : Number(row.entry_fee_lkr),
    bestMonths: row.best_months,
  });
}

export async function getDestinations(): Promise<DestinationView[]> {
  if (!isSupabaseConfigured) return fallbackDestinations;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("destinations")
      .select("id, slug, name, summary, description, province, district, latitude, longitude, entry_fee_lkr, best_months")
      .eq("status", "published")
      .order("featured", { ascending: false })
      .order("name");

    if (error || !data?.length) return fallbackDestinations;
    return (data as unknown as DestinationRow[]).map(toView);
  } catch {
    return fallbackDestinations;
  }
}

export async function getDestination(slug: string): Promise<DestinationView | null> {
  if (!isSupabaseConfigured) {
    return fallbackDestinations.find((destination) => destination.slug === slug) ?? null;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("destinations")
      .select("id, slug, name, summary, description, province, district, latitude, longitude, entry_fee_lkr, best_months")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error) return null;
    if (!data) return fallbackDestinations.find((destination) => destination.slug === slug) ?? null;
    return toView(data as unknown as DestinationRow);
  } catch {
    return fallbackDestinations.find((destination) => destination.slug === slug) ?? null;
  }
}
