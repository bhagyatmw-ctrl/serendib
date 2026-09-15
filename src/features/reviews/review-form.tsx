"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Star } from "lucide-react";
import { submitReview } from "./actions";
import styles from "@/app/destinations/destinations.module.css";

export function ReviewForm({ destinationId, slug, signedIn }: { destinationId: string; slug: string; signedIn: boolean }) {
  const [state, action, pending] = useActionState(submitReview, {});
  const [rating, setRating] = useState(5);
  if (!signedIn) return <div className={styles.reviewSignin}><Star size={22}/><div><strong>Been here?</strong><span>Sign in to share practical advice with other travelers.</span></div><Link href={`/auth/login?next=/destinations/${slug}`}>Sign in to review</Link></div>;
  return <form action={action} className={styles.reviewForm}>
    <input type="hidden" name="destinationId" value={destinationId}/><input type="hidden" name="slug" value={slug}/><input type="hidden" name="rating" value={rating}/>
    <label>Your rating<div className={styles.ratingPicker}>{[1,2,3,4,5].map(value=><button type="button" key={value} onClick={()=>setRating(value)} aria-label={`${value} star${value===1?"":"s"}`}><Star size={22} fill={value<=rating?"currentColor":"none"}/></button>)}</div></label>
    <label>Review title<input name="title" placeholder="What stood out?"/></label>
    <label>Your experience<textarea name="body" minLength={20} required placeholder="Share timing, transport, accessibility or another useful detail…"/></label>
    {state.error&&<p className={styles.reviewError}>{state.error}</p>}{state.success&&<p className={styles.reviewSuccess}>{state.success}</p>}
    <button className={styles.reviewSubmit} disabled={pending}>{pending?"Saving…":"Submit review"}</button>
  </form>;
}
