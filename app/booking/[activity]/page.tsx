"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"

const activityDetails = {
  badminton: {
    name: "Badminton Court",
    basePrice: 300,
    addOns: [{ name: "Racket Rental", price: 100 }],
  },
  pickleball: {
    name: "Pickleball Court",
    basePrice: 350,
    addOns: [{ name: "Paddle Rental", price: 100 }],
  },
  tennis: {
    name: "Tennis Court",
    basePrice: 600,
    addOns: [
      { name: "Racket Rental", price: 200 },
      { name: "Ball Boy Service", price: 50 },
    ],
  },
  yoga: {
    name: "Yoga Class",
    basePrice: 500,
    addOns: [],
  },
  pilates: {
    name: "Pilates Class",
    basePrice: 1100,
    addOns: [],
  },
}

const timeSlots = [
  "6:00 AM",
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
]

function MiniCalendar({ selectedDate, onDateSelect }: { selectedDate: string; onDateSelect: (date: string) => void }) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth()))

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
  const days = []

  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const formatDateString = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return date.toISOString().split("T")[0]
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <button onClick={handlePrevMonth} className="p-1 hover:bg-secondary rounded">
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm font-semibold">
          {currentMonth.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
        </span>
        <button onClick={handleNextMonth} className="p-1 hover:bg-secondary rounded">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => (
          <button
            key={idx}
            onClick={() => day && onDateSelect(formatDateString(day))}
            disabled={!day}
            className={`h-6 text-xs rounded ${
              day
                ? selectedDate === formatDateString(day)
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "hover:bg-secondary"
                : "invisible"
            }`}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function BookingPage({ params }: { params: { activity: string } }) {
  const activity = activityDetails[params.activity as keyof typeof activityDetails]
  const [submitted, setSubmitted] = useState(false)
  const [bookingRequestNumber, setBookingRequestNumber] = useState("") // add state for booking number
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    activityType: params.activity,
    bookingType: "single",
    date: "",
    times: [] as string[],
    addOnsQuantities: {} as { [key: string]: number },
  })

  if (!activity) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Activity not found</h1>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleAddOnQuantityChange = (addOnName: string, quantity: number) => {
    setFormData((prev) => ({
      ...prev,
      addOnsQuantities: {
        ...prev.addOnsQuantities,
        [addOnName]: quantity,
      },
    }))
  }

  const handleTimeToggle = (time: string) => {
    setFormData((prev) => ({
      ...prev,
      times: prev.times.includes(time) ? prev.times.filter((t) => t !== time) : [...prev.times, time],
    }))
  }

  const calculateTotal = () => {
    let total = activityDetails[formData.activityType as keyof typeof activityDetails].basePrice

    total = total * formData.times.length

    Object.entries(formData.addOnsQuantities).forEach(([addOnName, quantity]) => {
      if (quantity > 0) {
        const addOnItem = activityDetails[formData.activityType as keyof typeof activityDetails].addOns.find(
          (a) => a.name === addOnName,
        )
        if (addOnItem) total += addOnItem.price * quantity
      }
    })
    return total
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const randomNumber = Math.random().toString(36).substring(2, 9).toUpperCase()
    setBookingRequestNumber(randomNumber)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-white p-4 flex items-center justify-center">
        <Card className="max-w-2xl w-full bg-white">
          <CardHeader>
            <CardTitle className="text-2xl">Booking Confirmation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <p className="text-teal-800 font-semibold">✓ Your booking request has been received!</p>
              <p className="text-teal-700 text-sm mt-2">
                Booking Request Number:{" "}
                <span className="font-mono font-bold text-teal-900">{bookingRequestNumber}</span>
              </p>
            </div>

            {/* Summary Details */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-sm mb-3">Booking Summary</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Guest Name</p>
                  <p className="font-medium">
                    {formData.firstName} {formData.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Contact Number</p>
                  <p className="font-medium">{formData.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Email</p>
                  <p className="font-medium">{formData.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Activity</p>
                  <p className="font-medium">
                    {activityDetails[formData.activityType as keyof typeof activityDetails].name}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Date</p>
                  <p className="font-medium">
                    {new Date(formData.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Times</p>
                  <p className="font-medium text-xs">{formData.times.join(", ")}</p>
                </div>

                {/* Add-ons Summary */}
                {Object.entries(formData.addOnsQuantities).some(([_, qty]) => qty > 0) && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground text-xs mb-1">Add-ons</p>
                    {Object.entries(formData.addOnsQuantities).map(
                      ([addOnName, quantity]) =>
                        quantity > 0 && (
                          <p key={addOnName} className="font-medium text-xs">
                            {addOnName} x {quantity}
                          </p>
                        ),
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Total Amount */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total Amount to Pay:</span>
                <span className="text-2xl font-bold text-primary">₱{calculateTotal()}</span>
              </div>
            </div>

            {/* Email Notification */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Email Confirmation:</span> A detailed summary including your booking
                request number <span className="font-mono font-bold">{bookingRequestNumber}</span> has been sent to{" "}
                <span className="font-medium">{formData.email}</span>. Check your inbox for further details.
              </p>
            </div>

            {/* Payment Information */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-sm mb-3">Payment Instructions</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">Payment Method: Cash Only</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Please arrange payment for your reservation through one of the following methods:
                  </p>
                </div>

                <div className="bg-secondary/50 rounded-lg p-3 space-y-2">
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      <span>📧</span> Email
                    </p>
                    <p className="text-xs text-muted-foreground ml-6">
                      Send a message to <span className="font-medium">reservations@sportvenue.com</span> with your
                      booking request number <span className="font-mono font-bold">{bookingRequestNumber}</span> and
                      payment preference.
                    </p>
                  </div>

                  <div>
                    <p className="font-medium flex items-center gap-2">
                      <span>💬</span> Facebook Messenger
                    </p>
                    <p className="text-xs text-muted-foreground ml-6">
                      Message us on our Facebook page <span className="font-medium">@SportVenueReservations</span> with
                      your booking request number <span className="font-mono font-bold">{bookingRequestNumber}</span> to
                      finalize your payment details.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" asChild className="flex-1 bg-transparent">
                <Link href="/">Back to Home</Link>
              </Button>
              <Button onClick={() => setSubmitted(false)} className="flex-1">
                Make Another Booking
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white p-3">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft size={18} />
              Back
            </Link>
          </Button>
          <h1 className="text-xl font-bold text-foreground">Reserve {activity.name}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Row 1: Customer Information */}
          <Card className="bg-white">
            <CardContent className="pt-4">
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-input rounded bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-input rounded bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Contact Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-input rounded bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+63 9XX XXXXXXX"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-input rounded bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Row 2: Activity Type, Booking Type, Add-ons */}
          <Card className="bg-white">
            <CardContent className="pt-4">
              <div className="grid grid-cols-3 gap-2">
                {/* Activity Type */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Activity Type</label>
                  <select
                    value={formData.activityType}
                    onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-input rounded bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="badminton">Badminton</option>
                    <option value="pickleball">Pickleball</option>
                    <option value="tennis">Tennis</option>
                    <option value="yoga">Yoga</option>
                    <option value="pilates">Pilates</option>
                  </select>
                </div>

                {/* Booking Type */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Booking Type</label>
                  <select
                    value={formData.bookingType}
                    onChange={(e) => setFormData({ ...formData, bookingType: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-input rounded bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="single">Single Day</option>
                    <option value="multiple">Multiple Days</option>
                  </select>
                </div>

                {/* Add-ons Section */}
                {activity.addOns.length > 0 && (
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-foreground mb-1">Add-ons</label>
                    <div className="space-y-1 bg-secondary/30 p-2 rounded border border-input">
                      {activity.addOns.map((addOn) => (
                        <div key={addOn.name} className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            id={addOn.name}
                            checked={(formData.addOnsQuantities[addOn.name] || 0) > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleAddOnQuantityChange(addOn.name, 1)
                              } else {
                                handleAddOnQuantityChange(addOn.name, 0)
                              }
                            }}
                            className="w-3 h-3 rounded border-input cursor-pointer"
                          />
                          <label htmlFor={addOn.name} className="text-xs text-foreground cursor-pointer flex-1">
                            {addOn.name} (₱{addOn.price})
                          </label>
                          {(formData.addOnsQuantities[addOn.name] || 0) > 0 && (
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={formData.addOnsQuantities[addOn.name] || 1}
                              onChange={(e) =>
                                handleAddOnQuantityChange(addOn.name, Number.parseInt(e.target.value) || 1)
                              }
                              className="w-10 px-1 py-0 text-xs border border-input rounded bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Row 3: 3-Column Layout - Calendar, Times, Summary */}
          <div className="grid grid-cols-3 gap-3 flex-1 min-h-0">
            {/* Column 1: Calendar */}
            <Card className="bg-white overflow-hidden flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs">Select Date</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 items-center justify-center">
                <MiniCalendar
                  selectedDate={formData.date}
                  onDateSelect={(date) => setFormData({ ...formData, date })}
                />
              </CardContent>
            </Card>

            {/* Column 2: Time Selection - Multiple Hours */}
            <Card className="bg-white overflow-hidden flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs">Select Hours</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-1">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeToggle(time)}
                      className={`py-1 px-1 text-xs rounded font-medium transition ${
                        formData.times.includes(time)
                          ? "bg-primary text-primary-foreground"
                          : "border-2 border-primary text-foreground hover:bg-primary/5"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Column 3: Summary (Read-Only) */}
            <Card className="bg-white overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto h-full space-y-2 text-xs">
                {/* Date Summary */}
                {formData.date && (
                  <div className="bg-secondary/50 p-2 rounded">
                    <p className="text-muted-foreground text-xs">Date:</p>
                    <p className="font-semibold">
                      {new Date(formData.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}

                {/* Times Summary */}
                {formData.times.length > 0 && (
                  <div className="bg-secondary/50 p-2 rounded">
                    <p className="text-muted-foreground text-xs">Hours Selected ({formData.times.length}):</p>
                    <p className="font-semibold text-xs">{formData.times.join(", ")}</p>
                  </div>
                )}

                {/* Activity Summary */}
                <div className="bg-secondary/50 p-2 rounded">
                  <p className="text-muted-foreground text-xs">Activity:</p>
                  <p className="font-semibold">
                    {activityDetails[formData.activityType as keyof typeof activityDetails].name}
                  </p>
                </div>

                {/* Add-ons Summary */}
                {Object.entries(formData.addOnsQuantities).some(([_, qty]) => qty > 0) && (
                  <div className="bg-secondary/50 p-2 rounded">
                    <p className="text-muted-foreground text-xs mb-1">Add-ons:</p>
                    {Object.entries(formData.addOnsQuantities).map(
                      ([addOnName, quantity]) =>
                        quantity > 0 && (
                          <p key={addOnName} className="font-semibold text-xs">
                            {addOnName} x{quantity}
                          </p>
                        ),
                    )}
                  </div>
                )}

                {/* Total Price */}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="text-lg font-bold text-primary">₱{calculateTotal()}</span>
                  </div>
                </div>

                <Button type="submit" size="sm" className="w-full mt-2">
                  Request Booking
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </main>
  )
}
