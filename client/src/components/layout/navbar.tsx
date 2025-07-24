import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/academy", label: "Academy" },
    { href: "/blog", label: "Resources" },
  ];

  const isActive = (href: string) => location === href;

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <div className="font-space font-bold text-2xl text-primary cursor-pointer">
                TechNurture
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span
                    className={`transition-colors duration-200 font-medium cursor-pointer ${
                      isActive(item.href)
                        ? "text-gray-900"
                        : "text-gray-500 hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
              <Link href="/contact">
                <Button className="bg-primary text-white hover:bg-blue-700">
                  Contact
                </Button>
              </Link>
              <Link href="/admin/login">
                <Button variant="outline" size="sm" className="ml-2 border-primary text-primary hover:bg-primary hover:text-white">
                  🔐 Admin
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span
                  className={`block px-3 py-2 cursor-pointer ${
                    isActive(item.href)
                      ? "text-gray-900 font-medium"
                      : "text-gray-500 hover:text-primary"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </span>
              </Link>
            ))}
            <Link href="/contact">
              <span
                className="block px-3 py-2 text-primary font-medium cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </span>
            </Link>
            <Link href="/admin/login">
              <span
                className="block px-3 py-2 text-primary font-bold cursor-pointer border-l-4 border-primary bg-blue-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🔐 Admin Login
              </span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
