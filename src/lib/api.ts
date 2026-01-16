import { AuthResponse, Project, Budget, Comment, Issue, User, PlatformStats, ProjectFilters, IssueFilters, UserFilters } from "@/types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper to get token
const getToken = () => localStorage.getItem('token');

// Helper to make authenticated requests
const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Request failed with status ${response.status}`);
  }

  return response.json();
};

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    return authFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  signup: async (name: string, email: string, password: string, role: 'citizen' | 'volunteer'): Promise<AuthResponse> => {
    return authFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
  },

  logout: async (): Promise<{ message: string }> => {
    return authFetch('/auth/logout', { method: 'POST' });
  },
};

// User API
export const userApi = {
  getProfile: async (): Promise<User> => {
    return authFetch('/users/profile');
  },

  updateProfile: async (data: { name?: string; password?: string }): Promise<User> => {
    return authFetch('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deactivate: async (): Promise<{ message: string }> => {
    return authFetch('/users/deactivate', { method: 'PUT' });
  },
};

// Projects API
export const projectsApi = {
  getAll: async (filters?: ProjectFilters): Promise<Project[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const queryString = params.toString();
    return authFetch(`/projects${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id: string): Promise<Project> => {
    return authFetch(`/projects/${id}`);
  },

  create: async (data: { title: string; description: string; department: string; location?: string }): Promise<Project> => {
    return authFetch('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Project>): Promise<Project> => {
    return authFetch(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  updateStatus: async (id: string, status: Project['status']): Promise<Project> => {
    return authFetch(`/projects/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  updateProgress: async (id: string, progress: number, notes?: string): Promise<Project> => {
    return authFetch(`/projects/${id}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ progress, notes }),
    });
  },

  archive: async (id: string): Promise<Project> => {
    return authFetch(`/projects/${id}/archive`, { method: 'PUT' });
  },
};

// Budget API
export const budgetApi = {
  getByProject: async (projectId: string): Promise<Budget> => {
    return authFetch(`/budgets/project/${projectId}`);
  },

  getHistory: async (projectId: string): Promise<Budget> => {
    return authFetch(`/budgets/project/${projectId}/history`);
  },

  create: async (projectId: string, allocatedAmount: number): Promise<Budget> => {
    return authFetch(`/budgets/project/${projectId}`, {
      method: 'POST',
      body: JSON.stringify({ allocatedAmount }),
    });
  },

  update: async (projectId: string, data: { allocatedAmount?: number; spentAmount?: number; notes?: string }): Promise<Budget> => {
    return authFetch(`/budgets/project/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Comments API
export const commentsApi = {
  getByProject: async (projectId: string): Promise<Comment[]> => {
    return authFetch(`/comments/project/${projectId}`);
  },

  create: async (projectId: string, content: string): Promise<Comment> => {
    return authFetch(`/comments/project/${projectId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  update: async (id: string, content: string): Promise<Comment> => {
    return authFetch(`/comments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  },

  delete: async (id: string): Promise<{ message: string }> => {
    return authFetch(`/comments/${id}`, { method: 'DELETE' });
  },
};

// Issues API
export const issuesApi = {
  getAll: async (filters?: IssueFilters): Promise<Issue[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const queryString = params.toString();
    return authFetch(`/issues${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id: string): Promise<Issue> => {
    return authFetch(`/issues/${id}`);
  },

  create: async (projectId: string, data: { title: string; description: string; category: string; priority?: 'low' | 'medium' | 'high' }): Promise<Issue> => {
    return authFetch(`/issues/project/${projectId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateStatus: async (id: string, status: Issue['status']): Promise<Issue> => {
    return authFetch(`/issues/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  respond: async (id: string, response: string): Promise<Issue> => {
    return authFetch(`/issues/${id}/respond`, {
      method: 'POST',
      body: JSON.stringify({ response }),
    });
  },

  escalate: async (id: string, escalatedTo: string): Promise<Issue> => {
    return authFetch(`/issues/${id}/escalate`, {
      method: 'POST',
      body: JSON.stringify({ escalatedTo }),
    });
  },
};

// Admin API
export const adminApi = {
  getUsers: async (filters?: UserFilters): Promise<User[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const queryString = params.toString();
    return authFetch(`/admin/users${queryString ? `?${queryString}` : ''}`);
  },

  getUserById: async (id: string): Promise<User> => {
    return authFetch(`/admin/users/${id}`);
  },

  assignRole: async (id: string, role: User['role']): Promise<User> => {
    return authFetch(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },

  blockUser: async (id: string): Promise<User> => {
    return authFetch(`/admin/users/${id}/block`, { method: 'PUT' });
  },

  unblockUser: async (id: string): Promise<User> => {
    return authFetch(`/admin/users/${id}/unblock`, { method: 'PUT' });
  },

  deactivateUser: async (id: string): Promise<User> => {
    return authFetch(`/admin/users/${id}/deactivate`, { method: 'PUT' });
  },

  reactivateUser: async (id: string): Promise<User> => {
    return authFetch(`/admin/users/${id}/reactivate`, { method: 'PUT' });
  },

  deleteComment: async (id: string): Promise<{ message: string }> => {
    return authFetch(`/admin/comments/${id}`, { method: 'DELETE' });
  },

  getStats: async (): Promise<PlatformStats> => {
    return authFetch('/admin/stats');
  },
};
