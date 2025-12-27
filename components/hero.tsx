"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const images = [
  { id: 1, title: "Badminton Court", url: "/professional-badminton-court-with-bright-lighting.jpg" },
  { id: 2, title: "Pickleball Courts", url: "/outdoor-pickleball-courts-with-players.jpg" },
  { id: 3, title: "Tennis Court", url: "/professional-tennis-court.jpg" },
  { id: 4, title: "Yoga Studio", url: "/modern-yoga-studio-with-natural-light.jpg" },
  { id: 5, title: "Pilates Studio", url: "/contemporary-pilates-studio-equipment.jpg" },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    if (!autoplay) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [autoplay])

  const prev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length)
    setAutoplay(false)
  }

  const next = () => {
    setCurrent((prev) => (prev + 1) % images.length)
    setAutoplay(false)
  }

  return (
    <section className="relative w-full overflow-hidden bg-white py-8 md:py-12">
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] mx-4 sm:mx-6 md:mx-8 rounded-2xl overflow-hidden group">
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-primary/30 via-primary/10 to-accent/30 pointer-events-none z-20" />

        {images.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-1000 rounded-2xl ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image.url || "/placeholder.svg"}
              alt={image.title}
              className="h-full w-full object-cover rounded-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent rounded-2xl" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white text-balance animate-fade-in-up drop-shadow-xl">
                {image.title}
              </h2>
            </div>
          </div>
        ))}

        <button
          onClick={prev}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-primary/80 p-2 hover:bg-primary transition-all duration-300 hover:scale-125 hover:shadow-xl shadow-lg backdrop-blur-sm border border-white/20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-primary/80 p-2 hover:bg-primary transition-all duration-300 hover:scale-125 hover:shadow-xl shadow-lg backdrop-blur-sm border border-white/20"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10 bg-black/30 backdrop-blur-sm px-4 py-3 rounded-full border border-white/20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrent(index)
                setAutoplay(false)
              }}
              className={`transition-all duration-300 rounded-full ${
                index === current ? "w-8 h-3 bg-primary shadow-lg" : "w-3 h-3 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Welcome Text */}
      <div className="bg-white px-4 py-16 sm:py-20 md:py-24 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4 animate-fade-in-up">
          Welcome to <span className="text-primary">SportVenue</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animation-delay-100">
          Your premier destination for sports and wellness activities. Book your favorite courts and classes today.
        </p>
      </div>
    </section>
  )
}
