import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { stories } from "@/src/features/stories/catalog";
import styles from "./stories.module.css";
import { BrandLogo } from "@/src/components/brand-logo";
export const metadata={title:"Stories | Serendib",description:"Thoughtful field notes and practical Sri Lanka travel stories."};
export default function StoriesPage(){return <main className={styles.page}><header><nav><Link className={styles.brand} href="/"><BrandLogo/></Link><Link href="/"><ArrowLeft size={15}/> Back home</Link></nav><div className={styles.hero}><span>Stories from the island</span><h1>Go beyond<br/><em>the postcard.</em></h1><p>Field notes, practical advice and slower ways to understand Sri Lanka.</p></div></header><section className={styles.featured}><article><div className={styles.featureImage}><Image src={stories[0].image} alt="" fill sizes="60vw"/></div><div><span>{stories[0].category} · {stories[0].readTime}</span><h2>{stories[0].title}</h2><p>{stories[0].excerpt}</p><Link href={`/stories/${stories[0].slug}`}>Read the story <ArrowRight size={16}/></Link></div></article></section><section className={styles.storyGrid}>{stories.slice(1).map(story=><article key={story.slug}><div><Image src={story.image} alt="" fill sizes="(max-width:800px) 100vw, 50vw"/></div><span>{story.category} · {story.readTime}</span><h2>{story.title}</h2><p>{story.excerpt}</p><Link href={`/stories/${story.slug}`}><BookOpen size={15}/> Read story</Link></article>)}</section></main>}
