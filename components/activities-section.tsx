"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const activities = [
  {
    id: 1,
    name: "Badminton Court",
    description: "Professional badminton court with quality shuttlecocks",
    image: "/badminton-court-indoor.jpg",
    rates: [
      { item: "Court Rental", price: 300, unit: "per hour" },
      { item: "Racket", price: 100, unit: "per hour" },
    ],
    slug: "badminton",
  },
  {
    id: 2,
    name: "Pickleball Court",
    description: "Modern pickleball courts perfect for all skill levels",
    image: "/pickleball-court-outdoor.jpg",
    rates: [
      { item: "Court Rental", price: 350, unit: "per hour" },
      { item: "Paddle", price: 100, unit: "per hour" },
    ],
    slug: "pickleball",
  },
  {
    id: 3,
    name: "Tennis Court",
    description: "Premium tennis court with professional maintenance",
    image: "/tennis-court-professional.jpg",
    rates: [
      { item: "Court Rental", price: 600, unit: "per hour" },
      { item: "Racket", price: 200, unit: "per hour" },
      { item: "Ball Boy", price: 50, unit: "per hour" },
    ],
    slug: "tennis",
  },
  {
    id: 4,
    name: "Yoga Class",
    description: "Relaxing yoga sessions for all levels and ages",
    image: "/yoga-class.png",
    rates: [{ item: "Class Session", price: 500, unit: "1 hour class" }],
    slug: "yoga",
  },
  {
    id: 5,
    name: "Pilates Class",
    description: "Strengthen and tone with professional pilates instruction",
    image: "/pilates-class-studio.jpg",
    rates: [{ item: "Class Session", price: 1100, unit: "1 hour class" }],
    slug: "pilates",
  },
]

export default function ActivitiesSection() {
  return (
    <section id="activities" className="px-4 py-16 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto">
        <div className="mb-16 text-center animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Our <span className="text-primary">Activities</span>
          </h2>
          <p className="text-lg text-muted-foreground">Choose from our variety of sports and wellness activities</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity, index) => (
            <div key={activity.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <Card className="flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-border/50">
                <div className="relative overflow-hidden h-48">
                  <img
                    src={activity.image || "/placeholder.svg"}
                    alt={activity.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">{activity.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">{activity.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-2 mb-6">
                    <p className="text-sm font-semibold text-foreground">Rates:</p>
                    <ul className="space-y-1 text-sm">
                      {activity.rates.map((rate, index) => (
                        <li key={index} className="flex justify-between text-muted-foreground">
                          <span>{rate.item}</span>
                          <span className="font-semibold text-primary">
                            ₱{rate.price} {rate.unit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold transition-all duration-300 hover:shadow-lg"
                    size="lg"
                  >
                    <Link href={`/booking/${activity.slug}`}>Book Now</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
