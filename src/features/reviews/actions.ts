"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";

export type ReviewState = { error?: string; success?: string };

export async function submitReview(_: ReviewState, formData: FormData): Promise<ReviewState> {
  const destinationId = String(formData.get("destinationId") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const rating = Number(formData.get("rating"));
  if (!destinationId || destinationId.startsWith("fallback-")) return { error: "Reviews will open when this destination is synced to the live catalogue." };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { error: "Choose a rating from 1 to 5." };
  if (body.length < 20) return { error: "Share at least 20 characters so the review is useful to other travelers." };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in before sharing a review." };
  const { error } = await supabase.from("reviews").upsert({
    user_id: user.id, destination_id: destinationId, place_id: null, rating, title: title || null, body, status: "draft",
  } as never, { onConflict: "user_id,destination_id,place_id" });
  if (error) return { error: error.message };
  revalidatePath(`/destinations/${slug}`);
  revalidatePath("/account");
  return { success: "Thank you. Your review was saved and is awaiting publication." };
}
