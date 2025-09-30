"use client";

import { Hero } from "@/components/sections/Hero";
import { FeaturedEvents } from "@/components/sections/FeaturedEvents";
import { Categories } from "@/components/sections/Categories";
import { motion } from "framer-motion";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTA } from "@/components/sections/CTA";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EventRecommendations } from "@/components/events/EventRecommendations";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        {/* <Stats /> */}
        {/* <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <EventRecommendations />
          </div>
        </section> */}

        <section className="relative py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
          {/* Futuristic Background Elements */}
          <div className="absolute inset-0">
            {/* Animated Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

            {/* Floating Glow Elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse-slow" />
            <div
              className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow"
              style={{ animationDelay: "2s" }}
            />

            {/* Animated Orbs */}
            <motion.div
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/3 left-1/3 w-8 h-8 bg-cyan-400/20 rounded-full blur-xl"
            />
            <motion.div
              animate={{
                y: [20, -20, 20],
                x: [10, -10, 10],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute bottom-1/4 right-1/3 w-6 h-6 bg-purple-400/20 rounded-full blur-xl"
            />

            {/* Scan Lines Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(34,211,238,0.02)_50%,transparent_100%)] bg-[length:100%_4px] opacity-30" />
          </div>

          {/* Subtle Border Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10 pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10">
            <EventRecommendations />
          </div>

          {/* Add CSS animations */}
          <style jsx>{`
            @keyframes pulse-slow {
              0%,
              100% {
                opacity: 0.05;
              }
              50% {
                opacity: 0.1;
              }
            }
            .animate-pulse-slow {
              animation: pulse-slow 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
          `}</style>
        </section>
        <FeaturedEvents />
        <Categories />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
