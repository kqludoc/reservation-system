"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, LogOut, Plus, Edit2, Archive } from "lucide-react"

interface Activity {
  id: string
  name: string
  basePrice: number
  openingTime: string
  closingTime: string
  addOns: Array<{ name: string; price: number }>
  isArchived: boolean
}

const mockActivities: Activity[] = [
  {
    id: "1",
    name: "Badminton Court",
    basePrice: 300,
    openingTime: "6:00 AM",
    closingTime: "9:00 PM",
    addOns: [{ name: "Racket Rental", price: 100 }],
    isArchived: false,
  },
  {
    id: "2",
    name: "Pickleball Court",
    basePrice: 350,
    openingTime: "6:00 AM",
    closingTime: "9:00 PM",
    addOns: [{ name: "Paddle Rental", price: 100 }],
    isArchived: false,
  },
  {
    id: "3",
    name: "Tennis Court",
    basePrice: 600,
    openingTime: "6:00 AM",
    closingTime: "9:00 PM",
    addOns: [
      { name: "Racket Rental", price: 200 },
      { name: "Ball Boy Service", price: 50 },
    ],
    isArchived: false,
  },
  {
    id: "4",
    name: "Yoga Class",
    basePrice: 500,
    openingTime: "6:00 AM",
    closingTime: "7:00 PM",
    addOns: [],
    isArchived: false,
  },
  {
    id: "5",
    name: "Pilates Class",
    basePrice: 1100,
    openingTime: "6:00 AM",
    closingTime: "7:00 PM",
    addOns: [],
    isArchived: false,
  },
]

export default function AdminSettingsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activities, setActivities] = useState<Activity[]>(mockActivities)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const [formData, setFormData] = useState<Partial<Activity>>({})

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

  const handleEditClick = (activity: Activity) => {
    setEditingId(activity.id)
    setFormData({ ...activity })
  }

  const handleSaveActivity = () => {
    if (editingId) {
      setActivities(activities.map((a) => (a.id === editingId ? { ...(formData as Activity) } : a)))
      setEditingId(null)
    } else if (showNewForm) {
      const newActivity: Activity = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        addOns: formData.addOns || [],
        isArchived: false,
      } as Activity
      setActivities([...activities, newActivity])
      setShowNewForm(false)
    }
    setFormData({})
  }

  const handleArchiveActivity = (id: string) => {
    setActivities(activities.map((a) => (a.id === id ? { ...a, isArchived: !a.isArchived } : a)))
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setShowNewForm(false)
    setFormData({})
  }

  const activeActivities = activities.filter((a) => !a.isArchived)
  const archivedActivities = activities.filter((a) => a.isArchived)

  if (!isAuthenticated) {
    return null
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-primary">SportVenue Admin</h1>
            <div className="flex gap-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/dashboard" className="flex items-center gap-2">
                  Dashboard
                </Link>
              </Button>
              <Link
                href="/admin/settings"
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm flex items-center gap-2"
              >
                <Settings size={16} />
                Settings
              </Link>
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
        {/* Header with Add Button */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Activity Management</h2>
          <Button onClick={() => setShowNewForm(true)} className="flex items-center gap-2">
            <Plus size={18} />
            Add New Activity
          </Button>
        </div>

        {/* New Activity Form */}
        {showNewForm && (
          <Card className="border-2 border-teal-200 bg-teal-50">
            <CardHeader>
              <CardTitle>Create New Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Activity Name</label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Badminton Court"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Base Price (PHP)</label>
                  <input
                    type="number"
                    value={formData.basePrice || ""}
                    onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Opening Time</label>
                  <input
                    type="text"
                    value={formData.openingTime || ""}
                    onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="6:00 AM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Closing Time</label>
                  <input
                    type="text"
                    value={formData.closingTime || ""}
                    onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="9:00 PM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Add-ons (Optional)</label>
                <div className="space-y-2">
                  {formData.addOns && formData.addOns.length > 0 ? (
                    formData.addOns.map((addon, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={addon.name}
                          onChange={(e) => {
                            const newAddOns = [...formData.addOns!]
                            newAddOns[idx].name = e.target.value
                            setFormData({ ...formData, addOns: newAddOns })
                          }}
                          className="flex-1 px-3 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Add-on name"
                        />
                        <input
                          type="number"
                          value={addon.price}
                          onChange={(e) => {
                            const newAddOns = [...formData.addOns!]
                            newAddOns[idx].price = Number(e.target.value)
                            setFormData({ ...formData, addOns: newAddOns })
                          }}
                          className="w-24 px-3 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Price"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newAddOns = formData.addOns!.filter((_, i) => i !== idx)
                            setFormData({ ...formData, addOns: newAddOns })
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No add-ons yet</p>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        addOns: [...(formData.addOns || []), { name: "", price: 0 }],
                      })
                    }
                  >
                    + Add Add-on
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button type="button" onClick={handleSaveActivity} className="flex-1">
                  Create Activity
                </Button>
                <Button type="button" onClick={handleCancelEdit} variant="outline" className="flex-1 bg-transparent">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Activities */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Active Activities ({activeActivities.length})</h3>
          {activeActivities.map((activity) => (
            <Card key={activity.id}>
              {editingId === activity.id ? (
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Activity Name</label>
                      <input
                        type="text"
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Base Price (PHP)</label>
                      <input
                        type="number"
                        value={formData.basePrice || ""}
                        onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Opening Time</label>
                      <input
                        type="text"
                        value={formData.openingTime || ""}
                        onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Closing Time</label>
                      <input
                        type="text"
                        value={formData.closingTime || ""}
                        onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Add-ons</label>
                    <div className="space-y-2">
                      {formData.addOns && formData.addOns.length > 0 ? (
                        formData.addOns.map((addon, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input
                              type="text"
                              value={addon.name}
                              onChange={(e) => {
                                const newAddOns = [...formData.addOns!]
                                newAddOns[idx].name = e.target.value
                                setFormData({ ...formData, addOns: newAddOns })
                              }}
                              className="flex-1 px-3 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <input
                              type="number"
                              value={addon.price}
                              onChange={(e) => {
                                const newAddOns = [...formData.addOns!]
                                newAddOns[idx].price = Number(e.target.value)
                                setFormData({ ...formData, addOns: newAddOns })
                              }}
                              className="w-24 px-3 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newAddOns = formData.addOns!.filter((_, i) => i !== idx)
                                setFormData({ ...formData, addOns: newAddOns })
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No add-ons</p>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            addOns: [...(formData.addOns || []), { name: "", price: 0 }],
                          })
                        }
                      >
                        + Add Add-on
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button onClick={handleSaveActivity} className="flex-1">
                      Save Changes
                    </Button>
                    <Button onClick={handleCancelEdit} variant="outline" className="flex-1 bg-transparent">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              ) : (
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{activity.name}</h3>
                      <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Base Price</p>
                          <p className="font-semibold">₱{activity.basePrice}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Operating Hours</p>
                          <p className="font-semibold">
                            {activity.openingTime} - {activity.closingTime}
                          </p>
                        </div>
                        {activity.addOns.length > 0 && (
                          <div className="col-span-2">
                            <p className="text-muted-foreground mb-1">Add-ons</p>
                            <div className="space-y-1">
                              {activity.addOns.map((addon) => (
                                <p key={addon.name} className="font-medium text-xs">
                                  {addon.name}: ₱{addon.price}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditClick(activity)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Edit2 size={16} />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleArchiveActivity(activity.id)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
                      >
                        <Archive size={16} />
                        Archive
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Archived Activities */}
        {archivedActivities.length > 0 && (
          <div className="space-y-4 mt-8 pt-8 border-t">
            <h3 className="text-lg font-semibold text-muted-foreground">
              Archived Activities ({archivedActivities.length})
            </h3>
            {archivedActivities.map((activity) => (
              <Card key={activity.id} className="opacity-60">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground line-through">{activity.name}</h3>
                      <p className="text-sm text-muted-foreground mt-2">Archived</p>
                    </div>
                    <Button
                      onClick={() => handleArchiveActivity(activity.id)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      Restore
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
