import Header from "@/components/header"
import Hero from "@/components/hero"
import ActivitiesSection from "@/components/activities-section"
import Footer from "@/components/footer"

export const metadata = {
  title: "SportVenue - Book Your Activity",
  description: "Reserve your favorite sports and wellness activities at SportVenue",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ActivitiesSection />
      <Footer />
    </main>
  )
}
