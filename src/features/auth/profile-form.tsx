"use client";
import { useActionState } from "react";
import { updateProfile, type AuthState } from "./actions";
import styles from "@/app/account/account.module.css";
export function ProfileForm({ displayName, homeCountry }: { displayName: string; homeCountry: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(updateProfile, {});
  return <form className={styles.profileForm} action={action}><label>Display name<input name="displayName" defaultValue={displayName} required/></label><label>Home country<input name="homeCountry" defaultValue={homeCountry} placeholder="Sri Lanka"/></label>{state.error && <p className={styles.formError}>{state.error}</p>}{state.success && <p className={styles.formSuccess}>{state.success}</p>}<button disabled={pending} type="submit">{pending ? "Saving..." : "Save profile"}</button></form>;
}
