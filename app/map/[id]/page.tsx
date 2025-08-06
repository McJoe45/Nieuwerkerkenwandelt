"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { getRouteById } from "@/lib/auth"

interface Route {
  id: string
  name: string
  gehuchten: string[]
  distance: number
  muddy: boolean
  description: string
  coordinates: [number, number][]
  difficulty: string
  duration: string
  highlights: string[]
}

declare global {
  interface Window {
    L: any;
  }
}

export default function FullscreenMapPage() {
  const params = useParams()
  const [route, setRoute] = useState<Route | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [scriptsLoaded, setScriptsLoaded] = useState(false)

  useEffect(() => {
    const routeData = getRouteById(params.id as string)
    setRoute(routeData)
  }, [params.id])

  // Load Leaflet scripts
  useEffect(() => {
    const loadScripts = async () => {
      if (typeof window !== 'undefined' && !window.L) {
        const leafletCSS = document.createElement('link')
        leafletCSS.rel = 'stylesheet'
        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(leafletCSS)

        const leafletJS = document.createElement('script')
        leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        leafletJS.onload = () => {
          setScriptsLoaded(true)
        }
        document.body.appendChild(leafletJS)
      } else if (window.L) {
        setScriptsLoaded(true)
      }
    }

    loadScripts()
  }, [])

  // Initialize map
  useEffect(() => {
    if (!scriptsLoaded || !mapRef.current || mapInstanceRef.current || !route) return

    const L = window.L
    const map = L.map(mapRef.current).setView([50.9167, 4.0333], 15)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    mapInstanceRef.current = map
    displayRoute(route.coordinates)
  }, [scriptsLoaded, route])

  const displayRoute = (coords: [number, number][]) => {
    if (!mapInstanceRef.current || !window.L) return

    const L = window.L

    if (coords.length === 0) {
      mapInstanceRef.current.setView([50.9167, 4.0333], 15)
      return
    }

    if (coords.length === 1) {
      mapInstanceRef.current.setView([coords[0][0], coords[0][1]], 16)
      L.marker([coords[0][0], coords[0][1]], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: '<div style="background-color: green; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">START</div>',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        })
      }).addTo(mapInstanceRef.current)
      return
    }

    // Multiple points - draw the route
    const polyline = L.polyline(coords, {
      color: 'red',
      weight: 5,
      opacity: 0.8
    }).addTo(mapInstanceRef.current)

    // Add start marker
    L.marker([coords[0][0], coords[0][1]], {
      icon: L.divIcon({
        className: 'custom-marker',
        html: '<div style="background-color: green; color: white; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; border: 3px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.4);">START</div>',
        iconSize: [35, 35],
        iconAnchor: [17, 17]
      })
    }).addTo(mapInstanceRef.current)

    // Add end marker
    L.marker([coords[coords.length - 1][0], coords[coords.length - 1][1]], {
      icon: L.divIcon({
        className: 'custom-marker',
        html: '<div style="background-color: red; color: white; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; border: 3px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.4);">EINDE</div>',
        iconSize: [35, 35],
        iconAnchor: [17, 17]
      })
    }).addTo(mapInstanceRef.current)

    // Fit map to route bounds with padding
    mapInstanceRef.current.fitBounds(polyline.getBounds(), { 
      padding: [30, 30],
      maxZoom: 17
    })
  }

  const closeWindow = () => {
    window.close()
  }

  if (!route) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-sage-dark text-xl">Route niet gevonden...</p>
      </div>
    )
  }

  if (!scriptsLoaded) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-sage-dark text-xl">Kaart wordt geladen...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-sage text-white p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold title-font">{route.name} - Volledige Kaart</h1>
        <Button
          onClick={closeWindow}
          variant="outline"
          size="sm"
          className="border-cream/30 text-cream hover:bg-sage/20 bg-transparent"
        >
          <X className="w-4 h-4 mr-2" />
          Sluiten
        </Button>
      </div>

      {/* Map */}
      <div 
        ref={mapRef}
        className="w-full bg-sage-lightest"
        style={{ height: 'calc(100vh - 80px)' }}
      />
    </div>
  )
}
