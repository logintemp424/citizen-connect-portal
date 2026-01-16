// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "citizen" | "volunteer" | "official" | "admin";
  isActive: boolean;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "citizen" | "volunteer" | "official" | "admin";
}

// Project Types
export interface ProgressEntry {
  progress: number;
  updatedBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  department: string;
  location?: string;
  status: "planned" | "ongoing" | "completed" | "stalled";
  progress: number;
  progressHistory: ProgressEntry[];
  createdBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

// Budget Types
export interface BudgetHistoryEntry {
  allocatedAmount: number;
  spentAmount: number;
  updatedBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  _id: string;
  project: {
    _id: string;
    title: string;
    description: string;
  };
  allocatedAmount: number;
  spentAmount: number;
  history: BudgetHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

// Comment Types
export interface Comment {
  _id: string;
  project: {
    _id: string;
    title: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  content: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Issue Types
export interface IssueResponse {
  respondedBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  response: string;
  createdAt: string;
  updatedAt: string;
}

export interface Issue {
  _id: string;
  project: {
    _id: string;
    title: string;
    description: string;
  };
  raisedBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  title: string;
  description: string;
  category: string;
  status: "open" | "in_progress" | "resolved";
  priority: "low" | "medium" | "high";
  responses: IssueResponse[];
  isEscalated: boolean;
  escalatedTo?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface PlatformStats {
  totalUsers: number;
  totalProjects: number;
  activeIssues: number;
  completedProjects: number;
}

// Filter Types
export interface ProjectFilters {
  department?: string;
  status?: string;
  location?: string;
}

export interface IssueFilters {
  project?: string;
  status?: string;
  category?: string;
  priority?: string;
}

export interface UserFilters {
  role?: string;
  isActive?: boolean;
  isBlocked?: boolean;
}
