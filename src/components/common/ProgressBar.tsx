import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ProgressBar({ 
  progress, 
  showPercentage = true, 
  size = "md",
  className 
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  const getProgressColor = () => {
    if (clampedProgress >= 81) return "bg-status-planned";
    if (clampedProgress >= 51) return "bg-warning";
    return "bg-status-ongoing";
  };

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("flex-1 bg-muted rounded-full overflow-hidden", sizeClasses[size])}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            getProgressColor()
          )}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showPercentage && (
        <span className="text-sm font-medium text-muted-foreground min-w-[3rem] text-right">
          {clampedProgress}%
        </span>
      )}
    </div>
  );
}
