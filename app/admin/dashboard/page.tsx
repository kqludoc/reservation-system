"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Settings, LogOut, Clock, TrendingUp, Search, ChevronUp, ChevronDown, Calendar } from "lucide-react"

// Mock data for peak hours chart
const peakHoursData = [
  { hour: "6 AM", bookings: 2 },
  { hour: "7 AM", bookings: 5 },
  { hour: "8 AM", bookings: 8 },
  { hour: "9 AM", bookings: 12 },
  { hour: "10 AM", bookings: 15 },
  { hour: "11 AM", bookings: 18 },
  { hour: "12 PM", bookings: 20 },
  { hour: "1 PM", bookings: 16 },
  { hour: "2 PM", bookings: 14 },
  { hour: "3 PM", bookings: 19 },
  { hour: "4 PM", bookings: 22 },
  { hour: "5 PM", bookings: 25 },
  { hour: "6 PM", bookings: 28 },
  { hour: "7 PM", bookings: 24 },
  { hour: "8 PM", bookings: 18 },
  { hour: "9 PM", bookings: 10 },
]

// Mock data for utilization rate
const utilizationData = [
  { day: "Mon", rate: 65 },
  { day: "Tue", rate: 72 },
  { day: "Wed", rate: 68 },
  { day: "Thu", rate: 81 },
  { day: "Fri", rate: 88 },
  { day: "Sat", rate: 92 },
  { day: "Sun", rate: 78 },
]

// Mock booking requests
const mockBookingRequests = [
  {
    id: "BR7XK9M",
    guestName: "John Doe",
    activity: "Badminton Court",
    date: "2025-01-05",
    time: "9:00 AM - 11:00 AM",
    totalAmount: 600,
    status: "new",
  },
  {
    id: "FR2LQ5P",
    guestName: "Jane Smith",
    activity: "Tennis Court",
    date: "2025-01-06",
    time: "2:00 PM - 4:00 PM",
    totalAmount: 1200,
    status: "reviewed",
  },
  {
    id: "GR8WV3H",
    guestName: "Mike Johnson",
    activity: "Pickleball Court",
    date: "2025-01-07",
    time: "7:00 PM - 8:00 PM",
    totalAmount: 350,
    status: "paid",
  },
  {
    id: "HS4JK7N",
    guestName: "Sarah Williams",
    activity: "Yoga Class",
    date: "2025-01-05",
    time: "6:00 AM - 7:00 AM",
    totalAmount: 500,
    status: "declined",
  },
  {
    id: "TS9MR2X",
    guestName: "David Brown",
    activity: "Pilates Class",
    date: "2025-01-08",
    time: "5:00 PM - 6:00 PM",
    totalAmount: 1100,
    status: "reviewed",
  },
  {
    id: "KS3LP9W",
    guestName: "Emma Davis",
    activity: "Tennis Court",
    date: "2024-12-28",
    time: "3:00 PM - 5:00 PM",
    totalAmount: 1200,
    status: "complete",
  },
  {
    id: "NS7TR1Q",
    guestName: "Robert Wilson",
    activity: "Badminton Court",
    date: "2025-01-10",
    time: "10:00 AM - 11:00 AM",
    totalAmount: 300,
    status: "cancelled",
  },
]

interface BookingRequest {
  id: string
  guestName: string
  activity: string
  date: string
  time: string
  totalAmount: number
  status: string
}

type SortColumn = "id" | "guestName" | "activity" | "date" | "totalAmount" | null
type SortOrder = "asc" | "desc"

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>(mockBookingRequests)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState<SortColumn>("date")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [activityFilter, setActivityFilter] = useState<string>("all")
  const [showMetrics, setShowMetrics] = useState(true)

  const uniqueActivities = Array.from(new Set(mockBookingRequests.map((req) => req.activity))).sort()

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

  const updateBookingStatus = (id: string, newStatus: string) => {
    setBookingRequests(bookingRequests.map((req) => (req.id === id ? { ...req, status: newStatus } : req)))
  }

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortOrder("asc")
    }
  }

  const filteredAndSortedRequests = bookingRequests
    .filter((req) => {
      // Filter by status
      if (statusFilter !== "all" && req.status !== statusFilter) return false
      // Filter by activity
      if (activityFilter !== "all" && req.activity !== activityFilter) return false
      // Search by request ID, guest name, or activity
      const searchLower = searchTerm.toLowerCase()
      return (
        req.id.toLowerCase().includes(searchLower) ||
        req.guestName.toLowerCase().includes(searchLower) ||
        req.activity.toLowerCase().includes(searchLower)
      )
    })
    .sort((a, b) => {
      let compareValue = 0

      if (sortColumn === "id") {
        compareValue = a.id.localeCompare(b.id)
      } else if (sortColumn === "guestName") {
        compareValue = a.guestName.localeCompare(b.guestName)
      } else if (sortColumn === "activity") {
        compareValue = a.activity.localeCompare(b.activity)
      } else if (sortColumn === "date") {
        compareValue = new Date(a.date).getTime() - new Date(b.date).getTime()
      } else if (sortColumn === "totalAmount") {
        compareValue = a.totalAmount - b.totalAmount
      }

      return sortOrder === "asc" ? compareValue : -compareValue
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-yellow-100 text-yellow-800"
      case "reviewed":
        return "bg-blue-100 text-blue-800"
      case "paid":
        return "bg-green-100 text-green-800"
      case "declined":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      case "complete":
        return "bg-green-200 text-green-900"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const SortableHeader = ({ label, column }: { label: string; column: SortColumn }) => (
    <th
      onClick={() => handleSort(column)}
      className="text-left py-3 px-4 font-semibold text-sm text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center gap-2">
        {label}
        {sortColumn === column && (sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
      </div>
    </th>
  )

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
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium text-sm"
              >
                Dashboard
              </Link>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/schedule" className="flex items-center gap-2">
                  <Calendar size={16} />
                  Schedule
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/settings" className="flex items-center gap-2">
                  <Settings size={16} />
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
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showMetrics}
              onChange={(e) => setShowMetrics(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm font-medium text-gray-700">Show Dashboard & Metrics</span>
          </label>
        </div>

        {showMetrics && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Bookings</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">152</p>
                    </div>
                    <TrendingUp className="h-10 w-10" style={{ color: "#4CAF50" }} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Pending Review</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">8</p>
                    </div>
                    <Clock className="h-10 w-10" style={{ color: "#FFC107" }} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg Utilization</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">79%</p>
                    </div>
                    <TrendingUp className="h-10 w-10" style={{ color: "#8BC34A" }} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-4">
              {/* Peak Hours Chart */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Peak Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={peakHoursData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="bookings" fill="#4CAF50" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Utilization Rate Chart */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Weekly Utilization Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={utilizationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="rate"
                        stroke="#4CAF50"
                        strokeWidth={2}
                        name="Utilization Rate"
                        dot={{ fill: "#4CAF50" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Booking Requests Table */}
        <Card className="bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-lg text-gray-900">Booking Requests Pending Confirmation</CardTitle>
            </div>
            <div className="flex gap-3 items-center flex-wrap">
              {/* Search Input */}
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by ID, name, or activity..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
                />
              </div>

              {/* Filter by Activity */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Activity:</span>
                <select
                  value={activityFilter}
                  onChange={(e) => setActivityFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 text-sm"
                >
                  <option value="all">All Activities</option>
                  {uniqueActivities.map((activity) => (
                    <option key={activity} value={activity}>
                      {activity}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter by Status */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 text-sm"
                >
                  <option value="all">All</option>
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="paid">Paid</option>
                  <option value="declined">Declined</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="complete">Complete</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-300 bg-gray-50">
                    <SortableHeader label="Request ID" column="id" />
                    <SortableHeader label="Guest Name" column="guestName" />
                    <SortableHeader label="Activity" column="activity" />
                    <SortableHeader label="Date & Time" column="date" />
                    <SortableHeader label="Amount" column="totalAmount" />
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedRequests.length > 0 ? (
                    filteredAndSortedRequests.map((request) => (
                      <tr key={request.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-sm font-mono font-semibold text-green-600">{request.id}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{request.guestName}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{request.activity}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          <div>
                            {new Date(request.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                          <div className="text-xs text-gray-500">{request.time}</div>
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold text-gray-900">₱{request.totalAmount}</td>
                        <td className="py-3 px-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}
                          >
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <select
                            value={request.status}
                            onChange={(e) => updateBookingStatus(request.id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            <option value="new">New</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="paid">Paid</option>
                            <option value="declined">Declined</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="complete">Complete</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-6 px-4 text-center text-gray-500">
                        No bookings found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
