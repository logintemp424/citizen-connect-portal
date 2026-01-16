import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/common/UserAvatar";
import { RoleBadge } from "@/components/common/RoleBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Menu, 
  LogOut, 
  User, 
  FolderKanban, 
  AlertCircle, 
  Shield,
  Home,
  Plus,
  ChevronDown
} from "lucide-react";
import { useState } from "react";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const canCreateProject = user?.role === 'official' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/projects", label: "Projects", icon: FolderKanban },
    { href: "/issues", label: "Issues", icon: AlertCircle },
  ];

  if (isAdmin) {
    navLinks.push({ href: "/admin", label: "Admin", icon: Shield });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-saffron/20 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75">
      {/* Tricolor Strip */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-saffron" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-indian-green" />
      </div>
      
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full gradient-header flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="text-xl font-heading font-bold text-primary">CivicFusion</span>
            <p className="text-[10px] text-muted-foreground -mt-1">Transparent Governance Portal</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href}>
              <Button variant="ghost" className="gap-2">
                <link.icon className="w-4 h-4" />
                {link.label}
              </Button>
            </Link>
          ))}
          {canCreateProject && (
            <Link to="/projects/new">
              <Button variant="default" size="sm" className="gap-2 ml-2 bg-saffron hover:bg-saffron/90">
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            </Link>
          )}
        </nav>

        {/* User Menu / Auth Buttons */}
        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 hidden sm:flex">
                  <UserAvatar name={user.name} size="sm" />
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-medium">{user.name}</p>
                    <RoleBadge role={user.role} showIcon={false} className="text-[10px] py-0" />
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex gap-2">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-saffron hover:bg-saffron/90">Sign Up</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <div className="flex flex-col gap-4 mt-6">
                {isAuthenticated && user && (
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <UserAvatar name={user.name} />
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <RoleBadge role={user.role} />
                    </div>
                  </div>
                )}
                
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <link.icon className="w-4 h-4" />
                        {link.label}
                      </Button>
                    </Link>
                  ))}
                  
                  {canCreateProject && (
                    <Link to="/projects/new" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full justify-start gap-2 bg-saffron hover:bg-saffron/90 mt-2">
                        <Plus className="w-4 h-4" />
                        New Project
                      </Button>
                    </Link>
                  )}
                </nav>

                <div className="mt-auto pt-4 border-t">
                  {isAuthenticated ? (
                    <>
                      <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start gap-2">
                          <User className="w-4 h-4" />
                          My Profile
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-2 text-destructive"
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full">Login</Button>
                      </Link>
                      <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-saffron hover:bg-saffron/90">Sign Up</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
