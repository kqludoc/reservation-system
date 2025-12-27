"use client"

import Link from "next/link"
import { Instagram, Facebook, Phone, Mail, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-border/50 bg-white">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {/* About */}
          <div className="animate-fade-in-up">
            <h3 className="text-lg font-semibold text-foreground mb-4">SportVenue</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your premier destination for sports and wellness activities. We offer top-quality facilities and
              professional instruction.
            </p>
          </div>

          {/* Contact Info */}
          <div className="animate-fade-in-up">
            <h3 className="text-lg font-semibold text-foreground mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <Phone size={18} className="text-primary" />
                <span>+63 917 234 5678</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <Mail size={18} className="text-primary" />
                <span>info@sportvenue.com</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <MapPin size={18} className="text-primary" />
                <span>123 Sports Avenue, Manila, PH</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="animate-fade-in-up">
            <h3 className="text-lg font-semibold text-foreground mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110 shadow-md"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110 shadow-md"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SportVenue. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
