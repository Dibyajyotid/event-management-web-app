"use client";

import type React from "react";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Star, Heart, Users, Clock } from "lucide-react";
import { useState } from "react";
import { Event } from "@/types/eventTypes";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface EventCardProps {
  event: Event;
  viewMode?: "grid" | "list";
  className?: string;
}

export function EventCard({
  event,
  viewMode = "grid",
  className,
}: EventCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getLowestPrice = () => {
    if (!event.ticketTypes || event.ticketTypes.length === 0) return "Free";
    const prices = event.ticketTypes
      .map((ticket) => ticket.price)
      .filter((price) => price > 0);
    return prices.length > 0 ? `$${Math.min(...prices)}` : "Free";
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    // TODO: Implement API call to save/remove favorite
  };

  const locationLabel = event.isVirtual
    ? "Virtual Event"
    : event.venue
    ? `${event.venue.city}, ${event.venue.state}`
    : "Location TBD";

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  if (viewMode === "list") {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -4 }}
        className="group"
      >
        <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 overflow-hidden transition-all duration-300 group-hover:border-yellow-400/30 group-hover:shadow-2xl group-hover:shadow-yellow-400/10">
          <div className="flex">
            {/* Image Section */}
            <div className="w-48 h-32 relative overflow-hidden">
              <div className="relative w-full h-full">
                <motion.img
                  src={
                    event.images?.[0] ||
                    `/placeholder.svg?height=128&width=192&query=event`
                  }
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onLoad={() => setImageLoaded(true)}
                />
                <AnimatePresence>
                  {!imageLoaded && (
                    <motion.div
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gray-700 animate-pulse"
                    />
                  )}
                </AnimatePresence>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-400/30"
                    >
                      {event.category}
                    </Badge>
                    <div className="text-lg font-bold text-yellow-400">
                      {getLowestPrice()}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                    {event.title}
                  </h3>

                  <p className="text-gray-300 line-clamp-2 mb-4 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFavoriteToggle}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 hover:bg-red-500/10 hover:border-red-400/30"
                  >
                    <Heart
                      className={`h-5 w-5 transition-all duration-300 ${
                        isFavorited
                          ? "fill-red-500 text-red-500 scale-110"
                          : "text-gray-400 group-hover:text-red-400"
                      }`}
                    />
                  </Button>
                </motion.div>
              </div>

              {/* Event Details */}
              <div className="flex items-center gap-6 text-sm text-gray-300 mb-4">
                <motion.div
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <span>{formatDate(event.startDate)}</span>
                </motion.div>

                <motion.div
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Clock className="h-4 w-4 text-purple-400" />
                  <span>{formatTime(event.startDate)}</span>
                </motion.div>

                <motion.div
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <MapPin className="h-4 w-4 text-green-400" />
                  <span>{locationLabel}</span>
                </motion.div>

                {event.averageRating > 0 && (
                  <motion.div
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>
                      {event.averageRating.toFixed(1)}{" "}
                      <span className="text-gray-500">
                        ({event.totalRatings})
                      </span>
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-400">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">
                    {event.attendees.length || 0} attending
                  </span>
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href={`/events/${event._id}`}>
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      View Details
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -8 }}
      className="group"
    >
      <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 overflow-hidden transition-all duration-300 group-hover:border-yellow-400/30 group-hover:shadow-2xl group-hover:shadow-yellow-400/10 h-full flex flex-col">
        {/* Image Section */}
        <div className="relative overflow-hidden">
          <div className="aspect-[4/3] relative">
            <motion.img
              src={
                event.images?.[0] ||
                `/placeholder.svg?height=200&width=300&query=event`
              }
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onLoad={() => setImageLoaded(true)}
            />
            <AnimatePresence>
              {!imageLoaded && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gray-700 animate-pulse"
                />
              )}
            </AnimatePresence>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-300" />
          </div>

          {/* Favorite Button */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-3 right-3"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavoriteToggle}
              className="bg-gray-900/80 backdrop-blur-sm border border-gray-600/30 hover:bg-red-500/10 hover:border-red-400/30"
            >
              <Heart
                className={`h-4 w-4 transition-all duration-300 ${
                  isFavorited
                    ? "fill-red-500 text-red-500 scale-110"
                    : "text-gray-300 group-hover:text-red-400"
                }`}
              />
            </Button>
          </motion.div>

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-gray-900/80 backdrop-blur-sm border border-gray-600/30 text-gray-200">
              {event.category}
            </Badge>
          </div>

          {/* Price Badge */}
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
              {getLowestPrice()}
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-lg text-white mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors duration-300">
            {event.title}
          </h3>

          <p className="text-gray-300 text-sm mb-4 line-clamp-2 flex-1 leading-relaxed">
            {event.description}
          </p>

          {/* Event Details */}
          <div className="space-y-3 text-sm">
            <motion.div
              className="flex items-center gap-2 text-gray-300"
              whileHover={{ scale: 1.02 }}
            >
              <Calendar className="h-4 w-4 text-blue-400 flex-shrink-0" />
              <span className="truncate">
                {formatDate(event.startDate)} • {formatTime(event.startDate)}
              </span>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 text-gray-300"
              whileHover={{ scale: 1.02 }}
            >
              <MapPin className="h-4 w-4 text-green-400 flex-shrink-0" />
              <span className="truncate">{locationLabel}</span>
            </motion.div>

            {event.averageRating > 0 && (
              <motion.div
                className="flex items-center gap-2 text-gray-300"
                whileHover={{ scale: 1.02 }}
              >
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                <span>
                  {event.averageRating.toFixed(1)}{" "}
                  <span className="text-gray-500">
                    ({event.totalRatings} reviews)
                  </span>
                </span>
              </motion.div>
            )}
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Users className="h-4 w-4" />
            <span>{event.attendees.length || 0}</span>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href={`/events/${event._id}`}>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View Details
              </Button>
            </Link>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
