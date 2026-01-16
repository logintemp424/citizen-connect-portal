import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { projectsApi } from "@/lib/api";
import { Project, ProjectFilters } from "@/types";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Grid3X3, 
  List, 
  X,
  Filter
} from "lucide-react";

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "planned", label: "Planned" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "stalled", label: "Stalled" },
];

// Mock data for demo when API is not available
const mockProjects: Project[] = [
  {
    _id: "1",
    title: "Smart City Infrastructure Development",
    description: "Implementation of smart traffic management, LED street lighting, and IoT sensors across the city for better urban management and resource optimization.",
    department: "Urban Development",
    location: "New Delhi",
    status: "ongoing",
    progress: 65,
    progressHistory: [],
    createdBy: { _id: "1", name: "Rajesh Kumar", email: "rajesh@gov.in", role: "official" },
    isArchived: false,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "Rural Healthcare Centers Expansion",
    description: "Construction and equipping of 50 new Primary Health Centers in rural areas to improve healthcare accessibility for underserved communities.",
    department: "Health & Family Welfare",
    location: "Maharashtra",
    status: "planned",
    progress: 15,
    progressHistory: [],
    createdBy: { _id: "2", name: "Priya Sharma", email: "priya@gov.in", role: "official" },
    isArchived: false,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "3",
    title: "National Highway Expansion Project",
    description: "Four-lane highway construction connecting major cities for improved transportation and economic growth in the region.",
    department: "Road Transport & Highways",
    location: "Karnataka",
    status: "ongoing",
    progress: 42,
    progressHistory: [],
    createdBy: { _id: "3", name: "Amit Patel", email: "amit@gov.in", role: "official" },
    isArchived: false,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "4",
    title: "Digital India Education Initiative",
    description: "Providing tablets and internet connectivity to 10,000 government schools for digital learning and skill development.",
    department: "Education",
    location: "Tamil Nadu",
    status: "completed",
    progress: 100,
    progressHistory: [],
    createdBy: { _id: "4", name: "Sunita Devi", email: "sunita@gov.in", role: "admin" },
    isArchived: false,
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "5",
    title: "Clean River Mission",
    description: "Comprehensive river cleaning and rejuvenation project including sewage treatment plants and public awareness campaigns.",
    department: "Environment",
    location: "Uttar Pradesh",
    status: "stalled",
    progress: 28,
    progressHistory: [],
    createdBy: { _id: "5", name: "Vikram Singh", email: "vikram@gov.in", role: "official" },
    isArchived: false,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "6",
    title: "Solar Power Plant Installation",
    description: "Setting up 500 MW solar power plant to promote renewable energy and reduce carbon footprint.",
    department: "Energy",
    location: "Rajasthan",
    status: "ongoing",
    progress: 78,
    progressHistory: [],
    createdBy: { _id: "1", name: "Rajesh Kumar", email: "rajesh@gov.in", role: "official" },
    isArchived: false,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function ProjectsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<ProjectFilters>({});

  const canCreateProject = user?.role === "official" || user?.role === "admin";

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await projectsApi.getAll(filters);
      setProjects(data);
    } catch (err) {
      // Use mock data if API fails
      console.log("Using mock data - API not available");
      setProjects(mockProjects);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusFilter = (value: string) => {
    if (value === "all") {
      const { status, ...rest } = filters;
      setFilters(rest);
    } else {
      setFilters({ ...filters, status: value });
    }
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery("");
  };

  const hasActiveFilters = Object.keys(filters).length > 0 || searchQuery.length > 0;

  // Filter projects by search query
  const filteredProjects = projects.filter((project) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      project.title.toLowerCase().includes(query) ||
      project.department.toLowerCase().includes(query) ||
      project.location?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="gradient-header text-white py-8">
        <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold flex items-center gap-3">
                <FolderKanban className="w-8 h-8" />
                Public Projects
              </h1>
              <p className="text-white/80 mt-1">
                Track government projects and their progress
              </p>
            </div>
            {canCreateProject && (
              <Link to="/projects/new">
                <Button className="bg-saffron hover:bg-saffron/90 gap-2">
                  <Plus className="w-4 h-4" />
                  Create Project
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Filters Section */}
        <div className="bg-card rounded-lg border p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search projects by title, department, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select
              value={filters.status || "all"}
              onValueChange={handleStatusFilter}
            >
              <SelectTrigger className="w-full lg:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {filters.status && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  Status: {filters.status}
                  <button onClick={() => handleStatusFilter("all")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-saffron/10 text-saffron text-xs rounded-full">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery("")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Projects Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredProjects.length}</span> projects
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchProjects}>Try Again</Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredProjects.length === 0 && (
          <EmptyState
            title="No projects found"
            message={hasActiveFilters 
              ? "Try adjusting your filters or search query"
              : "No projects have been created yet"
            }
            icon={<FolderKanban className="w-8 h-8 text-muted-foreground" />}
            action={hasActiveFilters ? {
              label: "Clear Filters",
              onClick: clearFilters
            } : undefined}
          />
        )}

        {/* Projects Grid/List */}
        {!isLoading && !error && filteredProjects.length > 0 && (
          <div className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-4"
          }>
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                showActions={canCreateProject}
                onEdit={() => navigate(`/projects/${project._id}/edit`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
