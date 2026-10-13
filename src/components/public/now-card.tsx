import { getExperience } from "@/lib/supabase/public-queries";

/* eslint-disable @typescript-eslint/no-explicit-any */
/** Floating "currently" pill driven by the current job in Experience (is_current = true). */
export async function NowCard() {
  const exp = ((await getExperience()) as any[]) ?? [];
  const cur = exp.find((e) => e.is_current);
  if (!cur) return null;
  return (
    <div className="glass fixed bottom-4 left-4 z-40 hidden max-w-[16rem] items-center gap-3 rounded-2xl px-4 py-2.5 shadow-lg lg:flex">
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
      </span>
      <div className="min-w-0 leading-tight">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Currently</p>
        <p className="truncate text-xs font-medium">{cur.position}</p>
        <p className="truncate text-[11px] text-muted-foreground">{cur.company_name}</p>
      </div>
    </div>
  );
}
