"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { signIn, signUp, signInWithGoogle, type AuthState } from "./actions";
import styles from "@/app/auth/auth.module.css";
const initialState: AuthState = {};
export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [state, formAction, pending] = useActionState(mode === "login" ? signIn : signUp, initialState); const [showPassword, setShowPassword] = useState(false);
  return <><form action={signInWithGoogle}><button className={styles.google} type="submit"><span>G</span> Continue with Google</button></form><div className={styles.divider}><span>or continue with email</span></div>
    <form action={formAction} className={styles.form}>{mode === "signup" && <label>Full name<input name="displayName" autoComplete="name" required placeholder="How should we call you?"/></label>}<label>Email address<input name="email" type="email" autoComplete="email" required placeholder="you@example.com"/></label><label>Password<div className={styles.password}><input name="password" type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={8} required placeholder="At least 8 characters"/><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div></label>{state.error && <p className={styles.error} role="alert">{state.error}</p>}{state.success && <p className={styles.success} role="status">{state.success}</p>}<button className={styles.submit} disabled={pending} type="submit">{pending ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}</button></form>
    <p className={styles.switch}>{mode === "login" ? "New to Serendib?" : "Already have an account?"} <Link href={mode === "login" ? "/auth/signup" : "/auth/login"}>{mode === "login" ? "Create one" : "Sign in"}</Link></p></>;
}
