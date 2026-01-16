import { Link } from "react-router-dom";
import { Issue } from "@/types";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageSquare, AlertTriangle, Calendar, FolderKanban } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface IssueCardProps {
  issue: Issue;
  onClick?: () => void;
}

export function IssueCard({ issue, onClick }: IssueCardProps) {
  return (
    <Card 
      className="hover:shadow-lg transition-all duration-300 hover:border-saffron/30 cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading font-semibold line-clamp-2">
            {issue.title}
          </h3>
          <div className="flex flex-col gap-1 items-end shrink-0">
            <StatusBadge status={issue.status} type="issue" />
            <StatusBadge status={issue.priority} type="priority" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {issue.description}
        </p>

        {/* Category and Project */}
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted rounded text-muted-foreground">
            {issue.category}
          </span>
          <Link 
            to={`/projects/${issue.project._id}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/5 rounded text-primary hover:bg-primary/10 transition-colors"
          >
            <FolderKanban className="w-3 h-3" />
            {issue.project.title}
          </Link>
        </div>

        {/* Escalated indicator */}
        {issue.isEscalated && (
          <div className="flex items-center gap-1 text-sm text-warning">
            <AlertTriangle className="w-4 h-4" />
            <span>Escalated</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>by {issue.raisedBy.name}</span>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              <span>{issue.responses.length}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
