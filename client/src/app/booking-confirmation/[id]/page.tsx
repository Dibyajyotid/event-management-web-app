"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Calendar, MapPin, User, Mail, Phone, Download, Share2 } from "lucide-react"

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
  attendeeInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    company: string
    jobTitle: string
  }
  event: {
    title: string
    startDate: string
    endDate: string
    venue: {
      name: string
      city: string
      state: string
    }
    isVirtual: boolean
    virtualLink?: string
    images: string[]
  }
  createdAt: string
}

export default function BookingConfirmationPage() {
  const params = useParams()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchBooking(params.id as string)
    }
  }, [params.id])

  const fetchBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        const bookingData = await response.json()
        setBooking(bookingData)
      }
    } catch (error) {
      console.error("Error fetching booking:", error)
    } finally {
      setLoading(false)
    }
  }

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

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/2" />
              <div className="h-64 bg-muted rounded" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
          <p className="text-muted-foreground mb-8">The booking you're looking for doesn't exist.</p>
          <Link href="/dashboard/bookings">
            <Button>View My Bookings</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground">
              Your booking has been successfully confirmed. You'll receive a confirmation email shortly.
            </p>
          </div>

          {/* Booking Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Booking Reference</span>
                <Badge variant="secondary" className="font-mono">
                  {booking.bookingReference}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>{booking.status}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Payment Status</span>
                <Badge variant={booking.paymentStatus === "completed" ? "default" : "secondary"}>
                  {booking.paymentStatus}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <img
                  src={booking.event.images?.[0] || `/placeholder.svg?height=80&width=120&query=event`}
                  alt={booking.event.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{booking.event.title}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ticket Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ticket Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Ticket Type</span>
                <span className="font-medium">{booking.ticketType.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Quantity</span>
                <span className="font-medium">{booking.ticketType.quantity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Price per ticket</span>
                <span className="font-medium">
                  {booking.ticketType.price === 0 ? "Free" : `$${booking.ticketType.price}`}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Amount</span>
                <span>{booking.totalAmount === 0 ? "Free" : `$${booking.totalAmount.toFixed(2)}`}</span>
              </div>
            </CardContent>
          </Card>

          {/* Attendee Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Attendee Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>
                  {booking.attendeeInfo.firstName} {booking.attendeeInfo.lastName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{booking.attendeeInfo.email}</span>
              </div>
              {booking.attendeeInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.attendeeInfo.phone}</span>
                </div>
              )}
              {booking.attendeeInfo.company && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Company:</span>
                  <span>{booking.attendeeInfo.company}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download Ticket
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              <Share2 className="mr-2 h-4 w-4" />
              Share Event
            </Button>
          </div>

          <div className="text-center mt-8">
            <Link href="/dashboard/bookings">
              <Button variant="outline">View All My Bookings</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
