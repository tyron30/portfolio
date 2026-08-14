import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/motion/animated-counter";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: { value: string; positive?: boolean };
  className?: string;
}

export function StatCard({ label, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          {typeof value === "number" ? (
            <AnimatedCounter value={value} className="mt-1 block text-2xl font-semibold text-gradient" />
          ) : (
            <p className="mt-1 text-2xl font-semibold text-gradient">{value}</p>
          )}
          {trend && (
            <p className={cn("mt-1 text-xs", trend.positive ? "text-emerald-500" : "text-destructive")}>
              {trend.value}
            </p>
          )}
        </div>
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
