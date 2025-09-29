"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, Sparkles, Users } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechCorp",
      avatar: "/diverse-woman-portrait.png",
      rating: 5,
      content:
        "EventHub made it incredibly easy to find and book professional development events. The platform is intuitive and the booking process is seamless.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Michael Chen",
      role: "Software Engineer",
      company: "StartupXYZ",
      avatar: "/man.jpg",
      rating: 5,
      content:
        "I've discovered so many amazing networking events through EventHub. The personalized recommendations are spot-on and have helped me grow my professional network.",
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Emily Rodriguez",
      role: "Event Organizer",
      company: "Creative Events",
      avatar: "/diverse-woman-portrait.png",
      rating: 5,
      content:
        "As an event organizer, EventHub has been a game-changer. The platform makes it easy to reach our target audience and manage bookings efficiently.",
      color: "from-orange-500 to-red-500",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      ref={ref}
      className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <motion.div
        animate={{
          opacity: [0.05, 0.08, 0.05],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          opacity: [0.05, 0.07, 0.05],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Users className="h-4 w-4 text-yellow-400" />
            </motion.div>
            <span className="text-sm font-semibold text-yellow-400">
              TRUSTED BY THOUSANDS
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-200 to-orange-400 bg-clip-text text-transparent">
            What Our Users Say
          </h2>

          <motion.p
            className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Join{" "}
            <span className="text-yellow-400 font-semibold">
              10,000+ professionals
            </span>{" "}
            who trust EventHub for their event discovery and management needs
          </motion.p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { type: "spring", stiffness: 300 },
              }}
              className="group relative"
            >
              {/* Glow Effect */}
              <motion.div
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.5,
                }}
                className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} rounded-xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`}
              />

              <Card className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 overflow-hidden group-hover:border-gray-600/70 transition-all duration-300 h-full">
                <CardContent className="p-6 relative">
                  {/* Quote Icon */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    className="absolute top-4 right-4"
                  >
                    <Quote className="h-8 w-8 text-gray-600/50" />
                  </motion.div>

                  {/* Rating Stars */}
                  <motion.div
                    className="flex items-center gap-1 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          delay: index * 0.1 + i * 0.1,
                          type: "spring",
                          stiffness: 200,
                        }}
                      >
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 drop-shadow-lg" />
                      </motion.div>
                    ))}
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-yellow-500/20 text-yellow-400 border-yellow-400/30"
                    >
                      {testimonial.rating}.0
                    </Badge>
                  </motion.div>

                  {/* Testimonial Content */}
                  <motion.p
                    className="text-gray-300 mb-6 leading-relaxed text-lg relative z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                  >
                    "{testimonial.content}"
                  </motion.p>

                  {/* User Info */}
                  <motion.div
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.6 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="relative"
                    >
                      <Avatar className="h-12 w-12 border-2 border-gray-600 group-hover:border-yellow-400/50 transition-colors duration-300">
                        <AvatarImage
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                        />
                        <AvatarFallback className="bg-gradient-to-r from-gray-700 to-gray-600 text-white font-semibold">
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      {/* Online Indicator */}
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900"
                      />
                    </motion.div>

                    <div className="flex-1">
                      <motion.div
                        className="font-semibold text-white group-hover:text-yellow-400 transition-colors duration-300"
                        whileHover={{ x: 2 }}
                      >
                        {testimonial.name}
                      </motion.div>
                      <motion.div
                        className="text-sm text-gray-400"
                        whileHover={{ x: 2 }}
                      >
                        {testimonial.role}
                      </motion.div>
                      <motion.div
                        className="text-xs text-gray-500"
                        whileHover={{ x: 2 }}
                      >
                        {testimonial.company}
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Bottom Gradient Border */}
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ delay: index * 0.1 + 0.8, duration: 0.8 }}
                    className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${testimonial.color} rounded-full`}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-8 border-t border-gray-700/50"
        >
          {[
            { number: "10K+", label: "Active Users" },
            { number: "4.9/5", label: "Average Rating" },
            { number: "500+", label: "Events Monthly" },
            { number: "98%", label: "Satisfaction Rate" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-sm text-gray-400 mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
