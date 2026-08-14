"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public-client";

const WATCHED_TABLES = [
  "about",
  "education",
  "experience",
  "projects",
  "project_images",
  "certificates",
  "seminars",
  "gallery",
  "tech_stack",
  "social_links",
  "contact_info",
  "resume",
  "settings",
];

/**
 * Subscribes to Postgres change notifications on every table the public
 * site reads from. When you add/edit/delete something in the admin panel,
 * this fires and calls router.refresh() — which re-runs the Server
 * Component data fetching and patches the page in place, so visitors (and
 * you, previewing your own edits) see the update within a second or two
 * without a manual reload.
 *
 * Requires Realtime to be enabled on these tables in Supabase — see
 * supabase-migration-enable-realtime.sql.
 */
export function LiveRefresh() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createPublicClient();
    const channel = supabase.channel("public-site-live-updates");

    WATCHED_TABLES.forEach((table) => {
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => {
          router.refresh();
        }
      );
    });

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
