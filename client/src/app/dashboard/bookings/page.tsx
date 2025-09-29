"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Search, Download, X, Eye } from "lucide-react"
import Link from "next/link"

interface Booking {
  _id: string
  bookingReference: string
  status: string
  paymentStatus: string
  totalAmount: number
  ticketType: {
    name: string
    price: number
    quantity: number
  }
  event: {
    _id: string
    title: string
    startDate: string
    venue: {
      name: string
      city: string
      state: string
    }
    isVirtual: boolean
    images: string[]
    category: string
  }
  createdAt: string
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchBookings()
  }, [statusFilter])

  const fetchBookings = async () => {
    try {
      const queryParams = new URLSearchParams({
        ...(statusFilter !== "all" && { status: statusFilter }),
      })

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/my-bookings?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings)
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}/cancel`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        fetchBookings() // Refresh the list
      }
    } catch (error) {
      console.error("Error cancelling booking:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "cancelled":
        return "destructive"
      case "attended":
        return "secondary"
      default:
        return "outline"
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = booking.event.title.toLowerCase().includes(searchTerm.toLowerCase())
    const now = new Date()
    const eventDate = new Date(booking.event.startDate)

    switch (activeTab) {
      case "upcoming":
        return matchesSearch && eventDate > now && booking.status === "confirmed"
      case "past":
        return matchesSearch && eventDate <= now
      case "cancelled":
        return matchesSearch && booking.status === "cancelled"
      default:
        return matchesSearch
    }
  })

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <img
            src={booking.event.images?.[0] || `/placeholder.svg?height=80&width=120&query=event`}
            alt={booking.event.title}
            className="w-20 h-20 object-cover rounded"
          />
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold mb-1">{booking.event.title}</h3>
                <Badge variant="secondary" className="mb-2">
                  {booking.event.category}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Badge variant={getStatusColor(booking.status)}>{booking.status}</Badge>
                <Badge variant="outline">{booking.paymentStatus}</Badge>
              </div>
            </div>

            <div className="space-y-1 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDate(booking.event.startDate)} at {formatTime(booking.event.startDate)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>
                  {booking.event.isVirtual
                    ? "Virtual Event"
                    : `${booking.event.venue.name}, ${booking.event.venue.city}`}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-muted-foreground">
                  {booking.ticketType.quantity}x {booking.ticketType.name}
                </div>
                <div className="font-semibold">
                  {booking.totalAmount === 0 ? "Free" : `$${booking.totalAmount.toFixed(2)}`}
                </div>
                <div className="text-xs text-muted-foreground">Ref: {booking.bookingReference}</div>
              </div>
              <div className="flex gap-2">
                <Link href={`/booking-confirmation/${booking._id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </Link>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Ticket
                </Button>
                {booking.status === "confirmed" && new Date() < new Date(booking.event.startDate) && (
                  <Button variant="outline" size="sm" onClick={() => handleCancelBooking(booking._id)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">My Bookings</h1>
            <p className="text-muted-foreground">Manage your event bookings and tickets</p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="attended">Attended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Bookings</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="animate-pulse flex gap-4">
                          <div className="w-20 h-20 bg-muted rounded" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted rounded w-1/2" />
                            <div className="h-3 bg-muted rounded w-1/4" />
                            <div className="h-3 bg-muted rounded w-1/3" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredBookings.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
                    <p className="text-muted-foreground mb-4">
                      {activeTab === "all" ? "You haven't booked any events yet." : `No ${activeTab} bookings found.`}
                    </p>
                    <Link href="/events">
                      <Button>Browse Events</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <BookingCard key={booking._id} booking={booking} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
