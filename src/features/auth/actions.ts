"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
export type AuthState = { error?: string; success?: string };
function credentials(formData: FormData) { return { email: String(formData.get("email") ?? "").trim(), password: String(formData.get("password") ?? "") }; }
export async function signIn(_: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient(); const { email, password } = credentials(formData);
  if (!email || password.length < 8) return { error: "Enter a valid email and a password of at least 8 characters." };
  const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) return { error: error.message }; redirect("/account");
}
export async function signUp(_: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient(); const { email, password } = credentials(formData); const displayName = String(formData.get("displayName") ?? "").trim();
  if (!displayName) return { error: "Please enter your name." }; if (!email || password.length < 8) return { error: "Enter a valid email and a password of at least 8 characters." };
  const { error, data } = await supabase.auth.signUp({ email, password, options: { data: { full_name: displayName }, emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3002"}/auth/callback` } });
  if (error) return { error: error.message }; if (data.session) redirect("/account"); return { success: "Check your email to confirm your account, then sign in." };
}
export async function signInWithGoogle() {
  const supabase = await createClient(); const { data, error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3002"}/auth/callback` } });
  if (error) redirect(`/auth/login?error=${encodeURIComponent(error.message)}`); if (data.url) redirect(data.url);
}
export async function signOut() { const supabase = await createClient(); await supabase.auth.signOut(); redirect("/"); }
export async function updateProfile(_: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return { error: "Your session has expired. Please sign in again." };
  const displayName = String(formData.get("displayName") ?? "").trim(); const homeCountry = String(formData.get("homeCountry") ?? "").trim(); if (!displayName) return { error: "Display name is required." };
  const { error } = await supabase.from("profiles").update({ display_name: displayName, home_country: homeCountry || null } as never).eq("id", user.id);
  return error ? { error: error.message } : { success: "Profile updated." };
}
