import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { issuesApi } from "@/lib/api";
import { Issue, IssueFilters } from "@/types";
import { IssueCard } from "@/components/issues/IssueCard";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  AlertCircle, 
  Search, 
  X,
  Filter,
  Calendar,
  MessageSquare
} from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { UserAvatar } from "@/components/common/UserAvatar";
import { RoleBadge } from "@/components/common/RoleBadge";
import { formatDistanceToNow } from "date-fns";

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
];

const priorityOptions = [
  { value: "all", label: "All Priority" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

// Mock data for demo
const mockIssues: Issue[] = [
  {
    _id: "1",
    project: { _id: "1", title: "Smart City Infrastructure", description: "Smart city project" },
    raisedBy: { _id: "1", name: "Ankit Verma", email: "ankit@example.com", role: "citizen" },
    title: "Street lights not working in Sector 15",
    description: "Multiple street lights in Sector 15 have been non-functional for over two weeks, creating safety concerns for residents and pedestrians during night hours.",
    category: "Infrastructure",
    status: "open",
    priority: "high",
    responses: [],
    isEscalated: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    project: { _id: "3", title: "National Highway Expansion", description: "Highway project" },
    raisedBy: { _id: "2", name: "Meera Joshi", email: "meera@example.com", role: "volunteer" },
    title: "Traffic congestion due to construction",
    description: "The ongoing construction has created severe traffic congestion during peak hours. Request for better traffic management.",
    category: "Traffic",
    status: "in_progress",
    priority: "medium",
    responses: [
      {
        respondedBy: { _id: "3", name: "Amit Patel", email: "amit@gov.in", role: "official" },
        response: "We have deployed additional traffic personnel during peak hours. A diversion route has been created.",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ],
    isEscalated: false,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "3",
    project: { _id: "5", title: "Clean River Mission", description: "River cleaning" },
    raisedBy: { _id: "4", name: "Ramesh Kumar", email: "ramesh@example.com", role: "citizen" },
    title: "Industrial waste still being dumped",
    description: "Despite the cleanup efforts, industrial waste is still being dumped into the river from factories upstream.",
    category: "Environment",
    status: "open",
    priority: "high",
    responses: [],
    isEscalated: true,
    escalatedTo: { _id: "5", name: "District Collector", email: "dc@gov.in", role: "admin" },
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "4",
    project: { _id: "2", title: "Rural Healthcare Centers", description: "Healthcare expansion" },
    raisedBy: { _id: "5", name: "Sunita Devi", email: "sunita@example.com", role: "citizen" },
    title: "Request for ambulance service",
    description: "The new healthcare center lacks ambulance service. In emergencies, patients have to arrange their own transport.",
    category: "Healthcare",
    status: "resolved",
    priority: "medium",
    responses: [
      {
        respondedBy: { _id: "2", name: "Priya Sharma", email: "priya@gov.in", role: "official" },
        response: "An ambulance has been allocated to the center. 24x7 service is now operational.",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ],
    isEscalated: false,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function IssuesPage() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<IssueFilters>({});
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  useEffect(() => {
    fetchIssues();
  }, [filters]);

  const fetchIssues = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await issuesApi.getAll(filters);
      setIssues(data);
    } catch (err) {
      console.log("Using mock data - API not available");
      setIssues(mockIssues);
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

  const handlePriorityFilter = (value: string) => {
    if (value === "all") {
      const { priority, ...rest } = filters;
      setFilters(rest);
    } else {
      setFilters({ ...filters, priority: value });
    }
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery("");
  };

  const hasActiveFilters = Object.keys(filters).length > 0 || searchQuery.length > 0;

  const filteredIssues = issues.filter((issue) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      issue.title.toLowerCase().includes(query) ||
      issue.description.toLowerCase().includes(query) ||
      issue.category.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="gradient-header text-white py-8">
        <div className="container">
          <h1 className="text-2xl md:text-3xl font-heading font-bold flex items-center gap-3">
            <AlertCircle className="w-8 h-8" />
            Community Issues
          </h1>
          <p className="text-white/80 mt-1">
            Track and report issues related to public projects
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Filters Section */}
        <div className="bg-card rounded-lg border p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={filters.status || "all"}
              onValueChange={handleStatusFilter}
            >
              <SelectTrigger className="w-full lg:w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.priority || "all"}
              onValueChange={handlePriorityFilter}
            >
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
              {filters.priority && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-warning/10 text-warning text-xs rounded-full">
                  Priority: {filters.priority}
                  <button onClick={() => handlePriorityFilter("all")}>
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

        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredIssues.length}</span> issues
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {!isLoading && !error && filteredIssues.length === 0 && (
          <EmptyState
            title="No issues found"
            message={hasActiveFilters 
              ? "Try adjusting your filters"
              : "No issues have been reported yet"
            }
            icon={<AlertCircle className="w-8 h-8 text-muted-foreground" />}
            action={hasActiveFilters ? { label: "Clear Filters", onClick: clearFilters } : undefined}
          />
        )}

        {!isLoading && !error && filteredIssues.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredIssues.map((issue) => (
              <IssueCard
                key={issue._id}
                issue={issue}
                onClick={() => setSelectedIssue(issue)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Issue Detail Modal */}
      <Dialog open={!!selectedIssue} onOpenChange={() => setSelectedIssue(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedIssue && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <DialogTitle className="text-xl font-heading">
                    {selectedIssue.title}
                  </DialogTitle>
                  <div className="flex gap-2 shrink-0">
                    <StatusBadge status={selectedIssue.status} type="issue" />
                    <StatusBadge status={selectedIssue.priority} type="priority" />
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Meta */}
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="px-2 py-1 bg-muted rounded">{selectedIssue.category}</span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {formatDistanceToNow(new Date(selectedIssue.createdAt), { addSuffix: true })}
                  </span>
                </div>

                {/* Raised By */}
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <UserAvatar name={selectedIssue.raisedBy.name} size="sm" />
                  <div>
                    <p className="text-sm font-medium">{selectedIssue.raisedBy.name}</p>
                    <RoleBadge role={selectedIssue.raisedBy.role as any} />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">{selectedIssue.description}</p>
                </div>

                {/* Responses */}
                {selectedIssue.responses.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Official Responses ({selectedIssue.responses.length})
                    </h4>
                    <div className="space-y-3">
                      {selectedIssue.responses.map((response, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-indian-green/5 border-indian-green/20">
                          <div className="flex items-center gap-2 mb-2">
                            <UserAvatar name={response.respondedBy.name} size="sm" />
                            <div>
                              <p className="text-sm font-medium">{response.respondedBy.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(response.createdAt), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm">{response.response}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
