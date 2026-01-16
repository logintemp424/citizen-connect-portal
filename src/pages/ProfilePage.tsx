import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { userApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { UserAvatar } from "@/components/common/UserAvatar";
import { RoleBadge } from "@/components/common/RoleBadge";
import { User, Lock, AlertTriangle, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsUpdatingName(true);
    try {
      await userApi.updateProfile({ name });
      toast.success("Name updated successfully");
    } catch (error) {
      toast.error("Failed to update name");
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await userApi.updateProfile({ password: newPassword });
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      await userApi.deactivate();
      toast.success("Account deactivated");
      await logout();
    } catch (error) {
      toast.error("Failed to deactivate account");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="gradient-header text-white py-8">
        <div className="container">
          <h1 className="text-2xl md:text-3xl font-heading font-bold flex items-center gap-3">
            <User className="w-8 h-8" />
            My Profile
          </h1>
          <p className="text-white/80 mt-1">
            Manage your account settings
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <UserAvatar name={user.name} size="lg" />
                <div>
                  <h2 className="text-2xl font-heading font-bold">{user.name}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                  <RoleBadge role={user.role} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Update Name */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5" />
                Update Name
              </CardTitle>
              <CardDescription>Change your display name</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateName} className="flex gap-4">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="flex-1"
                />
                <Button type="submit" disabled={isUpdatingName || name === user.name}>
                  {isUpdatingName ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Update Password */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Change Password
              </CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isUpdatingPassword || !newPassword || newPassword !== confirmPassword}
                >
                  {isUpdatingPassword ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible account actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    Deactivate Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will deactivate your account. You will be logged out and won't be able 
                      to access your account until an administrator reactivates it.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeactivate} className="bg-destructive hover:bg-destructive/90">
                      Deactivate
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
