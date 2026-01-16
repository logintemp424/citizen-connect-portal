import { Link } from "react-router-dom";
import { Project } from "@/types";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ProgressBar } from "@/components/common/ProgressBar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, Calendar, Edit, Archive } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ProjectCardProps {
  project: Project;
  showActions?: boolean;
  onEdit?: () => void;
  onArchive?: () => void;
}

export function ProjectCard({ project, showActions = false, onEdit, onArchive }: ProjectCardProps) {
  return (
    <Link to={`/projects/${project._id}`}>
      <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-saffron/30 group cursor-pointer overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-saffron via-white to-indian-green opacity-60 group-hover:opacity-100 transition-opacity" />
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <StatusBadge status={project.status} type="project" />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Building2 className="w-4 h-4 text-primary" />
              <span className="line-clamp-1">{project.department}</span>
            </div>
            {project.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-saffron" />
                <span className="line-clamp-1">{project.location}</span>
              </div>
            )}
          </div>

          {/* Progress */}
          <ProgressBar progress={project.progress} size="sm" />

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              by {project.createdBy.name}
            </span>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex gap-2 pt-2" onClick={(e) => e.preventDefault()}>
              {onEdit && (
                <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={onEdit}>
                  <Edit className="w-3 h-3" />
                  Edit
                </Button>
              )}
              {onArchive && (
                <Button size="sm" variant="outline" className="gap-1" onClick={onArchive}>
                  <Archive className="w-3 h-3" />
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
