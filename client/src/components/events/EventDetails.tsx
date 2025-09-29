"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MapPin, Clock, Users, Tag, Star } from "lucide-react"

interface Event {
  _id: string
  title: string
  description: string
  category: string
  startDate: string
  endDate: string
  venue: {
    name: string
    address: string
    city: string
    state: string
    country: string
  }
  isVirtual: boolean
  virtualLink?: string
  images: string[]
  organizer: {
    _id: string
    firstName: string
    lastName: string
    email: string
    avatar?: string
  }
  tags: string[]
  averageRating: number
  totalRatings: number
  capacity: number
  attendees: string[]
}

interface EventDetailsProps {
  event: Event
}

export function EventDetails({ event }: EventDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getDuration = () => {
    const start = new Date(event.startDate)
    const end = new Date(event.endDate)
    const diffHours = Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60)

    if (diffHours < 24) {
      return `${Math.round(diffHours)} hours`
    } else {
      const days = Math.ceil(diffHours / 24)
      return `${days} day${days > 1 ? "s" : ""}`
    }
  }

  return (
    <div className="space-y-6">
      {/* Hero Image */}
      <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
        <img
          src={event.images?.[0] || `/placeholder.svg?height=320&width=800&query=event`}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <Badge className="mb-2">{event.category}</Badge>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{event.title}</h1>
          {event.averageRating > 0 && (
            <div className="flex items-center gap-2 text-white">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>
                {event.averageRating.toFixed(1)} ({event.totalRatings} reviews)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Event Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Date & Time</div>
                <div className="text-sm text-muted-foreground">{formatDate(event.startDate)}</div>
                <div className="text-sm text-muted-foreground">
                  {formatTime(event.startDate)} - {formatTime(event.endDate)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Location</div>
                {event.isVirtual ? (
                  <div className="text-sm text-muted-foreground">Virtual Event</div>
                ) : (
                  <>
                    <div className="text-sm text-muted-foreground">{event.venue.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {event.venue.city}, {event.venue.state}
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Duration</div>
                <div className="text-sm text-muted-foreground">{getDuration()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Attendees</div>
                <div className="text-sm text-muted-foreground">
                  {event.attendees.length} / {event.capacity} registered
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>About This Event</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground leading-relaxed">{event.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      {event.tags && event.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Organizer */}
      <Card>
        <CardHeader>
          <CardTitle>Organized By</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={event.organizer.avatar || "/placeholder.svg"} alt={event.organizer.firstName} />
              <AvatarFallback>
                {event.organizer.firstName[0]}
                {event.organizer.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                {event.organizer.firstName} {event.organizer.lastName}
              </div>
              <div className="text-sm text-muted-foreground">{event.organizer.email}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
