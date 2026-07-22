"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
export async function toggleFavorite(formData: FormData) {
  const destinationId=String(formData.get("destinationId")??""); const slug=String(formData.get("slug")??""); const supabase=await createClient(); const{data:{user}}=await supabase.auth.getUser();
  if(!user) redirect(`/auth/login?next=${encodeURIComponent(`/destinations/${slug}`)}`);
  const{data:existing}=await supabase.from("favorites").select("user_id").eq("user_id",user.id).eq("destination_id",destinationId).maybeSingle();
  if(existing) await supabase.from("favorites").delete().eq("user_id",user.id).eq("destination_id",destinationId); else await supabase.from("favorites").insert({user_id:user.id,destination_id:destinationId,place_id:null} as never);
  revalidatePath(`/destinations/${slug}`); revalidatePath("/account");
}
