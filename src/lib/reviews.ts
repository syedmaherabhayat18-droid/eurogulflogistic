import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Review = Tables<"reviews">;

/** Public homepage: only approved reviews, newest first. */
export async function fetchApprovedReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(9);
  if (error) throw error;
  return data ?? [];
}

export const approvedReviewsQueryOptions = () =>
  queryOptions({ queryKey: ["reviews", "approved"], queryFn: fetchApprovedReviews });

/** Admin dashboard: every review, approved or hidden. RLS restricts this to staff/admin. */
export async function fetchAllReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export const allReviewsQueryOptions = () =>
  queryOptions({ queryKey: ["reviews", "all"], queryFn: fetchAllReviews });
