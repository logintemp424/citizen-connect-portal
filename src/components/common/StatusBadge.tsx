import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  type: "project" | "issue" | "priority";
  className?: string;
}

const projectStatusStyles: Record<string, string> = {
  planned: "bg-status-planned/10 text-status-planned border-status-planned/20",
  ongoing: "bg-status-ongoing/10 text-status-ongoing border-status-ongoing/20",
  completed: "bg-status-completed/10 text-status-completed border-status-completed/20",
  stalled: "bg-status-stalled/10 text-status-stalled border-status-stalled/20",
};

const issueStatusStyles: Record<string, string> = {
  open: "bg-status-stalled/10 text-status-stalled border-status-stalled/20",
  in_progress: "bg-warning/10 text-warning border-warning/20",
  resolved: "bg-status-ongoing/10 text-status-ongoing border-status-ongoing/20",
};

const priorityStyles: Record<string, string> = {
  low: "bg-priority-low/10 text-priority-low border-priority-low/20",
  medium: "bg-priority-medium/10 text-priority-medium border-priority-medium/20",
  high: "bg-priority-high/10 text-priority-high border-priority-high/20",
};

export function StatusBadge({ status, type, className }: StatusBadgeProps) {
  let styles = "";
  
  switch (type) {
    case "project":
      styles = projectStatusStyles[status] || projectStatusStyles.planned;
      break;
    case "issue":
      styles = issueStatusStyles[status] || issueStatusStyles.open;
      break;
    case "priority":
      styles = priorityStyles[status] || priorityStyles.medium;
      break;
  }

  const displayText = status.replace(/_/g, " ");

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border",
        styles,
        className
      )}
    >
      {displayText}
    </span>
  );
}
