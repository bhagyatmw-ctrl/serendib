import type { MetadataRoute } from "next";
import { fallbackDestinations } from "@/src/features/destinations/catalog";
import { stories } from "@/src/features/stories/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3002";
  const staticRoutes = ["", "/destinations", "/planner", "/stories", "/travel-tools"];
  return [
    ...staticRoutes.map((route) => ({ url: `${baseUrl}${route}`, changeFrequency: "weekly" as const, priority: route === "" ? 1 : 0.8 })),
    ...fallbackDestinations.map((destination) => ({ url: `${baseUrl}/destinations/${destination.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...stories.map((story) => ({ url: `${baseUrl}/stories/${story.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
