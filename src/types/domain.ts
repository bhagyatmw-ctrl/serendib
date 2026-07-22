export type PlaceCategory =
  | "accommodation"
  | "restaurant"
  | "guide"
  | "activity"
  | "transport";

export type PublishStatus = "draft" | "published" | "archived";
export type TripStatus = "draft" | "planned" | "active" | "completed" | "cancelled";
export type BudgetLevel = "budget" | "comfort" | "luxury";

export interface Coordinates {
  latitude: number;
  longitude: number;
}
