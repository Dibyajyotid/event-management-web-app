"use client";

import Link from "next/link";
import {
  Calendar,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    setIsSubscribed(true);
    setEmail("");
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <footer className="bg-gradient-to-b from-gray-950 to-black border-t border-gray-800/70 relative overflow-hidden">
      {/* Darker Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/3 rounded-full blur-3xl" />
        {/* Additional dark overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          variants={footerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-6 gap-8 mb-12"
        >
          {/* Brand Section */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 space-y-6"
          >
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg"
              >
                <Calendar className="h-6 w-6 text-white" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                EventHub
              </span>
            </Link>

            <p className="text-gray-400 leading-relaxed max-w-md">
              Discover amazing events and connect with like-minded people in
              your community. Join thousands of professionals shaping their
              careers through unforgettable experiences.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-500">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-sm">hello@eventhub.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500">
                <Phone className="h-4 w-4 text-green-400" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500">
                <MapPin className="h-4 w-4 text-red-400" />
                <span className="text-sm">New York, NY 10001</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {[
                { icon: Twitter, href: "#", color: "hover:text-blue-400" },
                { icon: Facebook, href: "#", color: "hover:text-blue-500" },
                { icon: Instagram, href: "#", color: "hover:text-pink-500" },
                { icon: Linkedin, href: "#", color: "hover:text-blue-600" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`text-gray-500 ${social.color} transition-colors duration-300`}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Events Links */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="font-semibold text-gray-200 text-lg">Events</h3>
            <div className="space-y-3">
              {[
                { href: "/events", label: "Browse Events" },
                { href: "/events?category=conference", label: "Conferences" },
                { href: "/events?category=workshop", label: "Workshops" },
                { href: "/events?category=networking", label: "Networking" },
                { href: "/events?category=seminar", label: "Seminars" },
              ].map((link, index) => (
                <motion.div
                  key={link.href}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-blue-400 transition-colors duration-300 text-sm block"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="font-semibold text-gray-200 text-lg">Company</h3>
            <div className="space-y-3">
              {[
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
                { href: "/careers", label: "Careers" },
                { href: "/blog", label: "Blog" },
                { href: "/press", label: "Press Kit" },
              ].map((link, index) => (
                <motion.div
                  key={link.href}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-purple-400 transition-colors duration-300 text-sm block"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Support Links */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="font-semibold text-gray-200 text-lg">Support</h3>
            <div className="space-y-3">
              {[
                { href: "/help", label: "Help Center" },
                { href: "/terms", label: "Terms of Service" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/refund", label: "Refund Policy" },
                { href: "/security", label: "Security" },
              ].map((link, index) => (
                <motion.div
                  key={link.href}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-green-400 transition-colors duration-300 text-sm block"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Newsletter Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="font-semibold text-gray-200 text-lg">
              Stay Updated
            </h3>
            <p className="text-gray-500 text-sm">
              Get the latest event updates and exclusive offers delivered to
              your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-900/80 border-gray-700 text-gray-200 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                  required
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white whitespace-nowrap shadow-lg border border-blue-500/20"
                  >
                    Subscribe
                  </Button>
                </motion.div>
              </div>

              <AnimatePresence>
                {isSubscribed && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-green-400 text-sm"
                  >
                    Thanks for subscribing! 🎉
                  </motion.p>
                )}
              </AnimatePresence>
            </form>

            <p className="text-gray-600 text-xs">
              By subscribing, you agree to our Privacy Policy and consent to
              receive updates.
            </p>
          </motion.div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-gray-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div className="text-gray-500 text-sm text-center md:text-left">
            <p>&copy; 2025 EventHub. All rights reserved.</p>
          </div>

          {/* Scroll to Top Button */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToTop}
              className="text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 border border-gray-700/50"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
