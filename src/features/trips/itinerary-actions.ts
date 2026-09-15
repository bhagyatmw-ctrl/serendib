"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";

type ActivityPayload = { time: string; title: string; detail: string; cost: number };
type DayPayload = { location: string; title: string; travel: string; activities: ActivityPayload[] };
export type ItineraryPayload = { tripId?: string | null; name: string; travelers: number; style: string; interest: string; days: DayPayload[] };
export type SaveItineraryResult = { tripId?: string; error?: string };

export async function saveItinerary(payload: ItineraryPayload): Promise<SaveItineraryResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to save this itinerary to your account." };
  if (!payload.name.trim() || !payload.days.length) return { error: "Your itinerary needs a name and at least one day." };

  let tripId = payload.tripId ?? null;
  const tripValues = {
    title: payload.name.trim(),
    party_size: Math.max(1, Math.min(50, payload.travelers)),
    budget_level: ["budget", "comfort", "luxury"].includes(payload.style) ? payload.style : "comfort",
    interests: [payload.interest],
    status: "planned",
  };

  if (tripId) {
    const { data: ownedTrip } = await supabase.from("trips").select("id").eq("id", tripId).eq("user_id", user.id).maybeSingle();
    if (!ownedTrip) return { error: "This trip could not be found in your account." };
    const { error } = await supabase.from("trips").update(tripValues as never).eq("id", tripId).eq("user_id", user.id);
    if (error) return { error: error.message };
    const { error: deleteError } = await supabase.from("itinerary_days").delete().eq("trip_id", tripId);
    if (deleteError) return { error: deleteError.message };
  } else {
    const { data, error } = await supabase.from("trips").insert({ ...tripValues, user_id: user.id } as never).select("id").single();
    if (error || !data) return { error: error?.message ?? "Unable to create the trip." };
    tripId = (data as { id: string }).id;
  }

  for (let index = 0; index < payload.days.length; index++) {
    const day = payload.days[index];
    const { data, error } = await supabase.from("itinerary_days").insert({
      trip_id: tripId, day_number: index + 1, title: `${day.location} — ${day.title}`, notes: day.travel,
    } as never).select("id").single();
    if (error || !data) return { error: error?.message ?? `Unable to save day ${index + 1}.` };
    const dayId = (data as { id: string }).id;
    if (day.activities.length) {
      const items = day.activities.map((item, itemIndex) => ({
        itinerary_day_id: dayId,
        title: item.title.trim() || "Untitled activity",
        starts_at: item.time || null,
        estimated_cost_lkr: Math.max(0, item.cost || 0),
        notes: item.detail,
        transport_mode: null,
        sort_order: itemIndex,
      }));
      const { error: itemError } = await supabase.from("itinerary_items").insert(items as never);
      if (itemError) return { error: itemError.message };
    }
  }

  revalidatePath("/account");
  revalidatePath("/planner");
  return { tripId };
}
