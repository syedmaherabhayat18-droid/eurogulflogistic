import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Loader2, PackageSearch, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { buildSeo } from "@/lib/seo";

const TITLE = "Track Your Request | Euro Gulf Logistics";
const DESCRIPTION = "Check the status of your heavy haulage or equipment request.";

export const Route = createFileRoute("/track")({
  validateSearch: (search: Record<string, unknown>) => ({
    ref: typeof search.ref === "string" ? search.ref : undefined,
  }),
  head: () =>
    buildSeo({ title: TITLE, description: DESCRIPTION, canonicalPath: "/track", forceNoIndex: true }),
  component: TrackPage,
});

const STATUS_COPY: Record<string, { label: string; note: string }> = {
  New: {
    label: "Request Received",
    note: "Dispatch has your request and is checking equipment availability and scope.",
  },
  "In Progress": {
    label: "Being Actioned",
    note: "A coordinator is preparing your pricing, availability, and mobilisation details.",
  },
  Completed: {
    label: "Completed",
    note: "This request has been closed out. Contact dispatch if you need it reopened.",
  },
};

function TrackPage() {
  const search = Route.useSearch();
  const [refId, setRefId] = useState(search.ref ?? "");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<{
    status: string;
    service_requested: string;
    created_at: string;
  } | null>(null);
  const [notFound, setNotFound] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("get_quote_status", {
        p_id: refId.trim(),
        p_email: email.trim(),
      });
      if (error) throw error;
      return data?.[0] ?? null;
    },
    onSuccess: (data) => {
      setResult(data);
      setNotFound(!data);
    },
    onError: () => {
      setResult(null);
      setNotFound(true);
    },
  });

  return (
    <section className="mx-auto max-w-xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 text-amber">
        <PackageSearch className="size-5" aria-hidden="true" />
        <p className="text-xs font-bold uppercase tracking-widest">Track Your Request</p>
      </div>
      <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Where&rsquo;s my job?</h1>
      <p className="mt-3 text-muted-foreground">
        Enter the reference number from your confirmation page, along with the email you submitted
        the request with.
      </p>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!refId.trim() || !email.trim()) return;
          mutation.mutate();
        }}
        className="mt-8 space-y-4 rounded border border-border p-6"
      >
        <div className="space-y-1.5">
          <Label htmlFor="track_ref">Reference number</Label>
          <Input
            id="track_ref"
            value={refId}
            onChange={(event) => setRefId(event.target.value)}
            placeholder="e.g. 3f2a1c9e-..."
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="track_email">Email used on the request</Label>
          <Input
            id="track_email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            required
          />
        </div>
        <Button type="submit" variant="amber" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Search className="size-4" aria-hidden="true" />
          )}
          Track Request
        </Button>
      </form>

      {result ? (
        <div className="mt-6 rounded border border-border p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {STATUS_COPY[result.status]?.label ?? result.status}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {STATUS_COPY[result.status]?.note ?? ""}
          </p>
          <div className="mt-4 grid gap-2 text-sm">
            <p>
              <span className="font-bold">Service:</span> {result.service_requested}
            </p>
            <p>
              <span className="font-bold">Submitted:</span>{" "}
              {new Date(result.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      ) : null}

      {notFound ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No request found matching that reference and email. Double-check both, or contact
          dispatch directly for help.
        </p>
      ) : null}
    </section>
  );
}
