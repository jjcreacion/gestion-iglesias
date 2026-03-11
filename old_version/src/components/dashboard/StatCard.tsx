import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "accent";
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
}: StatCardProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-elevated animate-fade-in",
      variant === "primary" && "bg-primary text-primary-foreground",
      variant === "accent" && "bg-accent text-accent-foreground",
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className={cn(
              "text-sm font-medium",
              variant === "default" ? "text-muted-foreground" : "opacity-90"
            )}>
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="font-serif text-3xl font-bold tracking-tight">
                {value}
              </h3>
              {trend && (
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.isPositive ? "text-success" : "text-destructive",
                    variant !== "default" && "opacity-90"
                  )}
                >
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>
              )}
            </div>
            {description && (
              <p className={cn(
                "text-xs",
                variant === "default" ? "text-muted-foreground" : "opacity-80"
              )}>
                {description}
              </p>
            )}
          </div>
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            variant === "default" && "bg-primary/10",
            variant === "primary" && "bg-primary-foreground/20",
            variant === "accent" && "bg-accent-foreground/20"
          )}>
            <Icon className={cn(
              "h-6 w-6",
              variant === "default" && "text-primary",
              variant !== "default" && "opacity-90"
            )} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
