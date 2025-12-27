"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react"

// Mock booking data with paid status only
const mockPaidBookings = [
  {
    id: "GR8WV3H",
    guestName: "Mike Johnson",
    activity: "Pickleball Court",
    date: "2025-01-07",
    startTime: 19,
    endTime: 20,
    status: "paid",
  },
  {
    id: "KS3LP9W",
    guestName: "Emma Davis",
    activity: "Tennis Court",
    date: "2025-01-08",
    startTime: 15,
    endTime: 17,
    status: "paid",
  },
  {
    id: "MS5JK2L",
    guestName: "Alex Turner",
    activity: "Badminton Court",
    date: "2025-01-09",
    startTime: 10,
    endTime: 12,
    status: "paid",
  },
  {
    id: "LS9NQ4W",
    guestName: "Lisa Chen",
    activity: "Yoga Class",
    date: "2025-01-10",
    startTime: 6,
    endTime: 7,
    status: "paid",
  },
  {
    id: "PS7MR6X",
    guestName: "Peter Harris",
    activity: "Tennis Court",
    date: "2025-01-11",
    startTime: 14,
    endTime: 16,
    status: "paid",
  },
  {
    id: "RS2KL8H",
    guestName: "Rachel Green",
    activity: "Pilates Class",
    date: "2025-01-12",
    startTime: 17,
    endTime: 18,
    status: "paid",
  },
]

type ViewMode = "weekly" | "monthly"

const ACTIVITY_TYPES = [
  "All Activities",
  "Badminton Court",
  "Pickleball Court",
  "Tennis Court",
  "Yoga Class",
  "Pilates Class",
]

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6) // 6 AM to 9 PM

export default function AdminSchedule() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("weekly")
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 5)) // Start from Jan 5, 2025
  const [selectedActivity, setSelectedActivity] = useState("All Activities")

  useEffect(() => {
    const session = localStorage.getItem("adminSession")
    if (!session) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminSession")
    router.push("/admin/login")
  }

  const getWeekStart = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day
    return new Date(d.setDate(diff))
  }

  const getWeekDays = () => {
    const weekStart = getWeekStart(currentDate)
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + i)
      days.push(date)
    }
    return days
  }

  const getDaysInMonth = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  }

  const getBookingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return mockPaidBookings.filter((booking) => booking.date === dateStr)
  }

  const getBookingForDateAndHour = (date: Date, hour: number) => {
    const dateStr = date.toISOString().split("T")[0]
    const filteredBookings =
      selectedActivity === "All Activities"
        ? mockPaidBookings.filter((b) => b.date === dateStr)
        : mockPaidBookings.filter((b) => b.date === dateStr && b.activity === selectedActivity)

    return filteredBookings.find((booking) => booking.startTime <= hour && booking.endTime > hour)
  }

  const handlePrevious = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "weekly") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    setCurrentDate(newDate)
  }

  const handleNext = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "weekly") {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-green-700">SportVenue Admin</h1>
            <div className="flex gap-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/dashboard" className="flex items-center gap-2">
                  Dashboard
                </Link>
              </Button>
              <Link href="/admin/schedule" className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium text-sm">
                Schedule
              </Link>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/settings" className="flex items-center gap-2">
                  Settings
                </Link>
              </Button>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* View Mode Toggle and Navigation */}
        <Card className="bg-white mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "weekly" ? "default" : "outline"}
                  onClick={() => setViewMode("weekly")}
                  className={viewMode === "weekly" ? "bg-green-600" : ""}
                >
                  Weekly View
                </Button>
                <Button
                  variant={viewMode === "monthly" ? "default" : "outline"}
                  onClick={() => setViewMode("monthly")}
                  className={viewMode === "monthly" ? "bg-green-600" : ""}
                >
                  Monthly View
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <Button onClick={handlePrevious} variant="outline" size="sm">
                  <ChevronLeft size={16} />
                </Button>
                <span className="text-lg font-semibold min-w-48 text-center text-gray-900">
                  {viewMode === "weekly"
                    ? `Week of ${getWeekStart(currentDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}`
                    : currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
                <Button onClick={handleNext} variant="outline" size="sm">
                  <ChevronRight size={16} />
                </Button>
              </div>

              {viewMode === "weekly" && (
                <select
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  {ACTIVITY_TYPES.map((activity) => (
                    <option key={activity} value={activity}>
                      {activity}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Weekly View */}
        {viewMode === "weekly" && (
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2">
              {getWeekDays().map((date) => (
                <Card key={date.toISOString()} className="bg-white">
                  <CardHeader className="pb-3 border-b border-gray-200">
                    <CardTitle className="text-sm text-gray-700">
                      {date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-0.5">
                      {HOURS.map((hour) => {
                        const booking = getBookingForDateAndHour(date, hour)
                        return (
                          <div
                            key={`${date.toISOString()}-${hour}`}
                            className={`px-2 py-2 text-xs border-b border-gray-100 ${
                              booking ? "bg-green-50 border-l-4 border-l-green-600" : "bg-white hover:bg-gray-50"
                            }`}
                          >
                            <div className="font-semibold text-gray-600">{hour}:00</div>
                            {booking ? (
                              <div className="text-green-700 font-medium mt-0.5">{booking.guestName}</div>
                            ) : (
                              <div className="text-gray-400">Vacant</div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Monthly View */}
        {viewMode === "monthly" && (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center py-2 font-semibold text-sm text-gray-700 bg-gray-50">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 auto-rows-24">
                {Array.from({ length: getFirstDayOfMonth() }).map((_, i) => (
                  <div key={`empty-${i}`} className="bg-gray-50"></div>
                ))}

                {Array.from({ length: getDaysInMonth() }).map((_, i) => {
                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1)
                  const bookings = getBookingsForDate(date)

                  return (
                    <div
                      key={i}
                      className="bg-white border border-gray-200 p-1 min-h-24 overflow-hidden hover:bg-gray-50 transition-colors"
                    >
                      <p className="font-semibold text-xs text-gray-700 mb-1">{i + 1}</p>
                      <div className="space-y-0.5">
                        {bookings.map((booking) => (
                          <div
                            key={booking.id}
                            className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded truncate hover:bg-green-200 cursor-pointer"
                            title={`${booking.guestName} - ${booking.activity}`}
                          >
                            {booking.activity}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
