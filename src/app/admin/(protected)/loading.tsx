import { Skeleton } from "@/components/ui/skeleton";

/**
 * Next.js automatically shows this while a Server Component segment under
 * (protected) is loading — e.g. the brief moment the About/Contact singleton
 * pages fetch their auth check before rendering. Keeps admin navigation
 * feeling instant instead of a blank flash between pages.
 */
export default function AdminLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
