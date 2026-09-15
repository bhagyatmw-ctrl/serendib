import type { Metadata } from "next";
import { Planner } from "./planner";
import { createClient } from "@/src/lib/supabase/server";

export const metadata: Metadata = {
  title: "Itinerary Planner | Serendib",
  description: "Build a day-by-day Sri Lanka itinerary with routes, costs and travel notes.",
};

export default async function PlannerPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const days = Math.min(14, Math.max(3, Number(query.days) || 7));
  const style = ["budget", "comfort", "luxury"].includes(String(query.style)) ? String(query.style) : "comfort";
  const interest = ["mix", "heritage", "buddhist", "nature", "hills", "coast"].includes(String(query.interest)) ? String(query.interest) : "mix";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const requestedTripId = typeof query.trip === "string" ? query.trip : null;
  let savedPlan: Parameters<typeof Planner>[0]["savedPlan"] = null;

  if (user && requestedTripId) {
    const { data: tripData } = await supabase.from("trips").select("id,title,party_size,budget_level,interests").eq("id", requestedTripId).eq("user_id", user.id).maybeSingle();
    if (tripData) {
      const trip = tripData as unknown as { id: string; title: string; party_size: number; budget_level: string; interests: string[] };
      const { data: dayData } = await supabase.from("itinerary_days").select("id,day_number,title,notes").eq("trip_id", trip.id).order("day_number");
      const dayRows = (dayData ?? []) as unknown as Array<{ id: string; day_number: number; title: string | null; notes: string | null }>;
      const dayIds = dayRows.map(day => day.id);
      const { data: itemData } = dayIds.length ? await supabase.from("itinerary_items").select("id,itinerary_day_id,title,starts_at,estimated_cost_lkr,notes,sort_order").in("itinerary_day_id", dayIds).order("sort_order") : { data: [] };
      const itemRows = (itemData ?? []) as unknown as Array<{ id: string; itinerary_day_id: string; title: string; starts_at: string | null; estimated_cost_lkr: number; notes: string | null; sort_order: number }>;
      if (dayRows.length) savedPlan = {
        tripId: trip.id, name: trip.title, travelers: trip.party_size, style: trip.budget_level, interest: trip.interests[0] === "culture" ? "heritage" : trip.interests[0] ?? "mix",
        days: dayRows.map(day => {
          const [location, title] = (day.title ?? "Sri Lanka — A day to explore").split(" — ");
          return { id: day.id, location, title: title ?? "A day to explore", travel: day.notes ?? "Local transfers", activities: itemRows.filter(item => item.itinerary_day_id === day.id).map(item => ({ id: item.id, time: item.starts_at?.slice(0, 5) ?? "09:00", title: item.title, detail: item.notes ?? "", cost: Number(item.estimated_cost_lkr) })) };
        }),
      };
    }
  }
  return <Planner initialDays={days} initialStyle={style} initialInterest={interest} savedPlan={savedPlan} signedIn={Boolean(user)} />;
}
