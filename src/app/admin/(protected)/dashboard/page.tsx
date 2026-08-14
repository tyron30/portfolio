"use client";

import { useQuery } from "@tanstack/react-query";
import { FolderKanban, Award, Images, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";

async function fetchCounts() {
  const supabase = createClient();
  const [{ count: projects }, { count: certificates }, { count: gallery }, { count: unreadMessages }] =
    await Promise.all([
      supabase.from("projects").select("*", { count: "exact", head: true }).is("deleted_at", null),
      supabase.from("certificates").select("*", { count: "exact", head: true }).is("deleted_at", null),
      supabase.from("gallery").select("*", { count: "exact", head: true }).is("deleted_at", null),
      supabase.from("messages").select("*", { count: "exact", head: true }).eq("status", "unread"),
    ]);

  return {
    projects: projects ?? 0,
    certificates: certificates ?? 0,
    gallery: gallery ?? 0,
    unreadMessages: unreadMessages ?? 0,
  };
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ["dashboard-stats"], queryFn: fetchCounts });

  return (
    <div>
      <PageHeader title="Dashboard" description="A quick snapshot of your portfolio content." />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StaggerItem>
            <StatCard label="Projects" value={data?.projects ?? 0} icon={FolderKanban} />
          </StaggerItem>
          <StaggerItem>
            <StatCard label="Certificates" value={data?.certificates ?? 0} icon={Award} />
          </StaggerItem>
          <StaggerItem>
            <StatCard label="Gallery Photos" value={data?.gallery ?? 0} icon={Images} />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              label="Unread Messages"
              value={data?.unreadMessages ?? 0}
              icon={Mail}
              trend={data?.unreadMessages ? { value: "Needs attention", positive: false } : undefined}
            />
          </StaggerItem>
        </StaggerContainer>
      )}
    </div>
  );
}
