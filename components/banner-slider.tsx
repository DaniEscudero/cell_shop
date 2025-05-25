"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"

const banners = [
  {
    id: 1,
    title: "Nuevos iPhone 15",
    description: "Descubre la nueva línea de iPhone con características innovadoras.",
    buttonText: "Comprar ahora",
    buttonLink: "/products/iphone-15",
    image: "/placeholder.svg?height=500&width=1200",
    color: "bg-blue-50 dark:bg-blue-950",
  },
  {
    id: 2,
    title: "Samsung Galaxy S24",
    description: "Experimenta el poder de la inteligencia artificial en tu mano.",
    buttonText: "Ver ofertas",
    buttonLink: "/products/samsung-s24",
    image: "/placeholder.svg?height=500&width=1200",
    color: "bg-purple-50 dark:bg-purple-950",
  },
  {
    id: 3,
    title: "Ofertas especiales",
    description: "Hasta 30% de descuento en teléfonos seleccionados.",
    buttonText: "Ver ofertas",
    buttonLink: "/deals",
    image: "/placeholder.svg?height=500&width=1200",
    color: "bg-amber-50 dark:bg-amber-950",
  },
]

export function BannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
  }

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden">
      <div className="relative h-[300px] md:h-[450px] w-full">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
              currentSlide === index ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className={`flex h-full w-full items-center ${banner.color}`}>
              <div className="container px-6 md:px-10 mx-auto flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 space-y-4 text-center md:text-left mb-6 md:mb-0 px-4">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{banner.title}</h2>
                  <p className="text-lg text-muted-foreground">{banner.description}</p>
                  <Button asChild>
                    <Link href={banner.buttonLink}>{banner.buttonText}</Link>
                  </Button>
                </div>
                <div className="md:w-1/2 relative h-[200px] md:h-[300px] w-full px-4">
                  <Image
                    src={banner.image || "/placeholder.svg"}
                    alt={banner.title}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Anterior</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Siguiente</span>
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${currentSlide === index ? "bg-primary" : "bg-primary/30"}`}
            onClick={() => setCurrentSlide(index)}
          >
            <span className="sr-only">Slide {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
