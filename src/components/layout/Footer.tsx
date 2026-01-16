import { Link } from "react-router-dom";
import { Shield, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Tricolor Strip */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-saffron" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-indian-green" />
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-saffron flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-heading font-bold">CivicFusion</span>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Empowering citizens through transparent governance. Track public projects, 
              monitor budgets, and participate in civic decisions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/projects" className="text-primary-foreground/80 hover:text-saffron transition-colors">
                  Public Projects
                </Link>
              </li>
              <li>
                <Link to="/issues" className="text-primary-foreground/80 hover:text-saffron transition-colors">
                  Community Issues
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-primary-foreground/80 hover:text-saffron transition-colors">
                  Get Involved
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-saffron transition-colors">
                  About CivicFusion
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-saffron transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-saffron transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-saffron transition-colors">
                  Help & Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Mail className="w-4 h-4 text-saffron" />
                support@civicfusion.gov.in
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Phone className="w-4 h-4 text-saffron" />
                1800-XXX-XXXX (Toll Free)
              </li>
              <li className="flex items-start gap-2 text-primary-foreground/80">
                <MapPin className="w-4 h-4 text-saffron mt-0.5" />
                <span>
                  Ministry of Urban Development<br />
                  New Delhi, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-primary-foreground/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/60">
              © {new Date().getFullYear()} CivicFusion. An initiative for transparent governance.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-primary-foreground/40">
                Built for the citizens of India
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
