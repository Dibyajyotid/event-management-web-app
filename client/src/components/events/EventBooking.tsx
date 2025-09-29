"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, CreditCard, Loader2, Check } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

interface Event {
  _id: string
  title: string
  startDate: string
  endDate: string
  venue: {
    name: string
    city: string
    state: string
  }
  isVirtual: boolean
  ticketTypes: Array<{
    name: string
    price: number
    quantity: number
    sold: number
    description: string
    benefits: string[]
  }>
  capacity: number
  attendees: string[]
}

interface EventBookingProps {
  event: Event
}

export function EventBooking({ event }: EventBookingProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedTicket, setSelectedTicket] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [attendeeInfo, setAttendeeInfo] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    company: "",
    jobTitle: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const selectedTicketType = event.ticketTypes.find((ticket) => ticket.name === selectedTicket)
  const totalAmount = selectedTicketType ? selectedTicketType.price * quantity : 0
  const availableTickets = selectedTicketType ? selectedTicketType.quantity - selectedTicketType.sold : 0

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

  const handleInputChange = (field: string, value: string) => {
    setAttendeeInfo({
      ...attendeeInfo,
      [field]: value,
    })
  }

  const handleBooking = async () => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (!selectedTicket) {
      setError("Please select a ticket type")
      return
    }

    setLoading(true)
    setError("")

    try {
      const bookingData = {
        eventId: event._id,
        ticketType: {
          name: selectedTicket,
          quantity,
        },
        attendeeInfo,
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(bookingData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Booking failed")
      }

      // Redirect to booking confirmation
      router.push(`/booking-confirmation/${data._id}`)
    } catch (err: any) {
      setError(err.message || "Booking failed")
    } finally {
      setLoading(false)
    }
  }

  const isEventFull = event.attendees.length >= event.capacity
  const isEventPast = new Date() > new Date(event.startDate)

  return (
    <div className="space-y-6">
      {/* Event Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <div>{formatDate(event.startDate)}</div>
              <div className="text-muted-foreground">
                {formatTime(event.startDate)} - {formatTime(event.endDate)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{event.isVirtual ? "Virtual Event" : `${event.venue.name}, ${event.venue.city}`}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              {event.attendees.length} / {event.capacity} attendees
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Ticket Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Tickets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEventPast ? (
            <Alert>
              <AlertDescription>This event has already started. Booking is no longer available.</AlertDescription>
            </Alert>
          ) : isEventFull ? (
            <Alert>
              <AlertDescription>This event is fully booked. No more tickets available.</AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="space-y-3">
                {event.ticketTypes.map((ticket) => {
                  const available = ticket.quantity - ticket.sold
                  const isSelected = selectedTicket === ticket.name

                  return (
                    <div
                      key={ticket.name}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      } ${available === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => available > 0 && setSelectedTicket(ticket.name)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{ticket.name}</h4>
                            {isSelected && <Check className="h-4 w-4 text-primary" />}
                          </div>
                          <p className="text-sm text-muted-foreground">{ticket.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{ticket.price === 0 ? "Free" : `$${ticket.price}`}</div>
                          <Badge variant={available > 0 ? "secondary" : "destructive"}>
                            {available > 0 ? `${available} left` : "Sold out"}
                          </Badge>
                        </div>
                      </div>
                      {ticket.benefits && ticket.benefits.length > 0 && (
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {ticket.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Check className="h-3 w-3 text-green-500" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )
                })}
              </div>

              {selectedTicket && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Select value={quantity.toString()} onValueChange={(value) => setQuantity(Number.parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: Math.min(availableTickets, 10) }, (_, i) => i + 1).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>{totalAmount === 0 ? "Free" : `$${totalAmount.toFixed(2)}`}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Attendee Information */}
      {selectedTicket && !isEventPast && !isEventFull && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Attendee Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={attendeeInfo.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={attendeeInfo.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={attendeeInfo.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={attendeeInfo.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={attendeeInfo.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={attendeeInfo.jobTitle}
                  onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Booking Button */}
      {selectedTicket && !isEventPast && !isEventFull && (
        <Card>
          <CardContent className="p-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button onClick={handleBooking} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  {totalAmount === 0 ? "Book Free Ticket" : `Pay $${totalAmount.toFixed(2)}`}
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-2">
              By booking, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
