"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Calendar, User, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        isScrolled
          ? "bg-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-gray-700/50"
          : "bg-gray-900/80 backdrop-blur-lg border-b border-gray-600/30"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo with animation */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Calendar className="h-8 w-8 text-blue-400 transition-all duration-300 group-hover:scale-110 group-hover:text-blue-300 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-blue-400/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
              EventHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {[
              { href: "/events", label: "Events" },
              { href: "/categories", label: "Categories" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Search and Auth */}
          <div className="flex items-center space-x-4">
            {/* Search Button - Improved Visibility */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex relative overflow-hidden group transition-all duration-300 hover:bg-gray-800/50 border border-gray-600/50"
            >
              <Search className="h-4 w-4 text-gray-300 transition-transform duration-300 group-hover:scale-110 group-hover:text-white" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>

            {user ? (
              <div className="flex items-center space-x-3">
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative overflow-hidden group transition-all duration-300 hover:bg-gray-800/50 border border-gray-600/50 text-gray-300 hover:text-white"
                  >
                    <User className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                    Dashboard
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="relative overflow-hidden border-gray-500 text-gray-300 hover:border-red-400 hover:text-red-300 transition-all duration-300 hover:bg-red-500/10"
                >
                  Logout
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="relative overflow-hidden group transition-all duration-300 hover:bg-gray-800/50 border border-gray-500 text-gray-700 hover:text-white hover:border-blue-400"
                  >
                    Login
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button
                    size="sm"
                    className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group border-0"
                  >
                    <span className="relative z-10">Sign Up</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden relative overflow-hidden transition-all duration-300 hover:bg-gray-800/50 border border-gray-600/50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-gray-300 transition-transform duration-300 rotate-90 scale-110" />
              ) : (
                <Menu className="h-5 w-5 text-gray-300 transition-transform duration-300 hover:scale-110" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation with animation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ${
            isMenuOpen
              ? "max-h-64 opacity-100 border-t border-gray-700/50"
              : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col space-y-4 py-4">
            {[
              { href: "/events", label: "Events" },
              { href: "/categories", label: "Categories" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 transform hover:translate-x-2 py-2 px-4 rounded-lg hover:bg-gray-800/50"
                style={{
                  animationDelay: isMenuOpen ? `${index * 100}ms` : "0ms",
                  animation: isMenuOpen
                    ? "slideInRight 0.3s ease-out forwards"
                    : "none",
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </header>
  );
}
