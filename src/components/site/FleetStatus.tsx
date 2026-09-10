import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { servicesQueryOptions } from "@/lib/services";

/**
 * Live fleet availability strip for the homepage.
 * Pulls real availability from Supabase (the same `is_available` flag
 * staff toggle from the admin dashboard) — not decorative, reflects
 * actual current state.
 */
export function FleetStatus() {
  const { data, isPending, isError } = useQuery(servicesQueryOptions());

  if (isPending || isError || !data || data.length === 0) return null;

  const available = data.filter((s) => s.is_available).length;
  const total = data.length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Link
        to="/services"
        className="flex flex-wrap items-center justify-between gap-4 rounded border border-border bg-card px-6 py-4 shadow-industrial transition-shadow hover:shadow-lift"
      >
        <div className="flex items-center gap-3">
          <span className="relative flex size-3">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex size-3 rounded-full bg-success" />
          </span>
          <p className="text-sm font-bold uppercase tracking-widest text-navy-soft">
            Live Fleet Status
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          <span className="font-black text-foreground">{available}</span> of{" "}
          <span className="font-black text-foreground">{total}</span> units available right now
        </p>
        <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-amber">
          View fleet <ArrowRight className="size-4" />
        </span>
      </Link>
    </div>
  );
}
