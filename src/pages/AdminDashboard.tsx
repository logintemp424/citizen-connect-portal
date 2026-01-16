import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";
import { User, PlatformStats } from "@/types";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { UserAvatar } from "@/components/common/UserAvatar";
import { RoleBadge } from "@/components/common/RoleBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Shield,
  Users,
  FolderKanban,
  AlertCircle,
  CheckCircle,
  Search,
  MoreVertical,
  UserX,
  UserCheck,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

// Mock data
const mockStats: PlatformStats = {
  totalUsers: 45892,
  totalProjects: 2847,
  activeIssues: 156,
  completedProjects: 1432,
};

const mockUsers: User[] = [
  { _id: "1", name: "Rajesh Kumar", email: "rajesh@gov.in", role: "official", isActive: true, isBlocked: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "2", name: "Priya Sharma", email: "priya@gov.in", role: "official", isActive: true, isBlocked: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "3", name: "Amit Patel", email: "amit@example.com", role: "citizen", isActive: true, isBlocked: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "4", name: "Sunita Devi", email: "sunita@example.com", role: "volunteer", isActive: true, isBlocked: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "5", name: "Vikram Singh", email: "vikram@example.com", role: "citizen", isActive: false, isBlocked: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsData, usersData] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers(),
      ]);
      setStats(statsData);
      setUsers(usersData);
    } catch (error) {
      console.log("Using mock data");
      setStats(mockStats);
      setUsers(mockUsers);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlockUser = async (userId: string, isBlocked: boolean) => {
    try {
      if (isBlocked) {
        await adminApi.unblockUser(userId);
        toast.success("User unblocked");
      } else {
        await adminApi.blockUser(userId);
        toast.success("User blocked");
      }
      fetchData();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleRoleChange = async (userId: string, newRole: User["role"]) => {
    try {
      await adminApi.assignRole(userId, newRole);
      toast.success("Role updated");
      fetchData();
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = !searchQuery || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (isLoading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="gradient-header text-white py-8">
        <div className="container">
          <h1 className="text-2xl md:text-3xl font-heading font-bold flex items-center gap-3">
            <Shield className="w-8 h-8" />
            Admin Dashboard
          </h1>
          <p className="text-white/80 mt-1">
            Platform management and statistics
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold">{stats.totalUsers.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-saffron">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-saffron/10">
                    <FolderKanban className="w-6 h-6 text-saffron" />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold">{stats.totalProjects.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Projects</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-destructive">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-destructive/10">
                    <AlertCircle className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold">{stats.activeIssues}</p>
                    <p className="text-sm text-muted-foreground">Active Issues</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-indian-green">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-indian-green/10">
                    <CheckCircle className="w-6 h-6 text-indian-green" />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold">{stats.completedProjects.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="citizen">Citizen</SelectItem>
                  <SelectItem value="volunteer">Volunteer</SelectItem>
                  <SelectItem value="official">Official</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Users Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <UserAvatar name={user.name} size="sm" />
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <RoleBadge role={user.role} />
                      </TableCell>
                      <TableCell>
                        {user.isBlocked ? (
                          <span className="inline-flex items-center gap-1 text-xs text-destructive">
                            <UserX className="w-3 h-3" />
                            Blocked
                          </span>
                        ) : user.isActive ? (
                          <span className="inline-flex items-center gap-1 text-xs text-indian-green">
                            <UserCheck className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Inactive</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleRoleChange(user._id, "citizen")}>
                              Set as Citizen
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(user._id, "volunteer")}>
                              Set as Volunteer
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(user._id, "official")}>
                              <ShieldCheck className="w-4 h-4 mr-2" />
                              Set as Official
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleBlockUser(user._id, user.isBlocked)}
                              className={user.isBlocked ? "text-indian-green" : "text-destructive"}
                            >
                              {user.isBlocked ? "Unblock User" : "Block User"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
