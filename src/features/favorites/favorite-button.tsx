"use client";
import { useFormStatus } from "react-dom"; import { Heart } from "lucide-react"; import { toggleFavorite } from "./actions"; import styles from "@/app/destinations/destinations.module.css";
function Submit({saved}:{saved:boolean}){const{pending}=useFormStatus();return <button className={styles.favoriteButton} disabled={pending}><Heart size={18} fill={saved?"currentColor":"none"}/>{pending?"Saving...":saved?"Saved to favorites":"Save destination"}</button>}
export function FavoriteButton({destinationId,slug,saved}:{destinationId:string;slug:string;saved:boolean}){return <form action={toggleFavorite}><input type="hidden" name="destinationId" value={destinationId}/><input type="hidden" name="slug" value={slug}/><Submit saved={saved}/></form>}
