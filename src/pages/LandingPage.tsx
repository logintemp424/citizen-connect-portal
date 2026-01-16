import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Shield, 
  Users, 
  FolderKanban, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Building2,
  Eye,
  MessageSquare,
  ChevronRight
} from "lucide-react";

// Mock stats for demo
const stats = [
  { label: "Total Projects", value: "2,847", icon: FolderKanban, color: "text-primary" },
  { label: "Completed", value: "1,432", icon: CheckCircle, color: "text-indian-green" },
  { label: "Active Issues", value: "156", icon: AlertCircle, color: "text-saffron" },
  { label: "Registered Citizens", value: "45,892", icon: Users, color: "text-status-planned" },
];

const features = [
  {
    icon: Eye,
    title: "Transparent Tracking",
    description: "Monitor every government project from inception to completion with real-time progress updates.",
  },
  {
    icon: TrendingUp,
    title: "Budget Accountability",
    description: "Track fund allocation and spending for complete financial transparency.",
  },
  {
    icon: MessageSquare,
    title: "Citizen Participation",
    description: "Raise issues, provide feedback, and engage directly with officials.",
  },
  {
    icon: Building2,
    title: "Department Oversight",
    description: "Filter and view projects by department, location, and status.",
  },
];

const steps = [
  { step: 1, title: "Register", description: "Create your citizen or volunteer account" },
  { step: 2, title: "Explore", description: "Browse projects and budgets in your area" },
  { step: 3, title: "Participate", description: "Comment, raise issues, and track progress" },
  { step: 4, title: "Impact", description: "Help drive transparency and accountability" },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative gradient-hero text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-saffron/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        
        <div className="container relative py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm mb-6 animate-fade-in">
              <Shield className="w-4 h-4 text-saffron" />
              <span>Official Civic Governance Portal</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 animate-slide-up">
              Transparent Governance
              <span className="block text-saffron">For Every Citizen</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Track public projects, monitor budgets, and participate in civic decisions. 
              Empowering citizens through transparency and accountability.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/projects">
                <Button size="lg" className="bg-saffron hover:bg-saffron/90 text-white gap-2 w-full sm:w-auto">
                  <FolderKanban className="w-5 h-5" />
                  View Projects
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link to="/signup">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary gap-2 w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 -mt-10 relative z-10">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={stat.label} className="border-none shadow-lg animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 text-center">
                  <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                  <p className="text-3xl font-heading font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Empowering Citizens Through
              <span className="text-saffron"> Transparency</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              CivicFusion bridges the gap between government and citizens, providing tools for 
              monitoring, participation, and accountability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={feature.title} className="group hover:shadow-xl transition-all duration-300 hover:border-saffron/30 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-saffron/10 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary group-hover:text-saffron transition-colors" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              How It <span className="text-saffron">Works</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of citizens making a difference in their communities.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((item, index) => (
              <div key={item.step} className="relative animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-saffron to-transparent" />
                )}
                <div className="relative bg-card rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center mx-auto mb-4 font-heading font-bold text-2xl">
                    {item.step}
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="relative overflow-hidden rounded-2xl gradient-hero p-8 md:p-12 text-white text-center">
            <div className="absolute inset-0 pattern-dots opacity-10" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Ready to Make a Difference?
              </h2>
              <p className="text-white/80 max-w-xl mx-auto mb-8">
                Join CivicFusion today and become part of a movement for transparent governance 
                and citizen empowerment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button size="lg" className="bg-saffron hover:bg-saffron/90 gap-2 w-full sm:w-auto">
                    Create Account
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/projects">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary w-full sm:w-auto">
                    Explore Projects
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
