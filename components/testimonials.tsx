"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"

const testimonials = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Designer",
    contentKey: "testimonial_1",
    rating: 5,
    avatar: "/diverse-designer-avatars.png",
  },
  {
    id: 2,
    name: "Sarah Miller",
    role: "E-commerce Manager",
    contentKey: "testimonial_2",
    rating: 5,
    avatar: "/business-woman-avatar.jpg",
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "Content Creator",
    contentKey: "testimonial_3",
    rating: 5,
    avatar: "/content-creator-avatar.jpg",
  },
  {
    id: 4,
    name: "David Wilson",
    role: "Photographer",
    contentKey: "testimonial_4",
    rating: 5,
    avatar: "/photographer-avatar.png",
  },
]

export function Testimonials() {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 bg-muted/40 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-border/80 pb-6">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">{t("testimonials_title") || '来自用户的评价'}</h2>
            <p className="text-base sm:text-lg text-muted-foreground">{t("testimonials_description") || '倾听全球设计师、创作者与独立开发者的真实使用体验'}</p>
          </div>
          <div className="hidden md:block text-right">
            <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase">USER FEEDBACK</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="group flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/40"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-1 text-amber-400">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-base sm:text-lg text-foreground/90 leading-relaxed italic">
                  "{t(testimonial.contentKey)}"
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-6 mt-6 border-t border-border/40">
                <div className="h-10 w-10 rounded-full border border-border/60 overflow-hidden bg-muted shrink-0">
                  <img 
                    src={testimonial.avatar || "/placeholder.svg"} 
                    alt={testimonial.name} 
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">{testimonial.name}</h4>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
