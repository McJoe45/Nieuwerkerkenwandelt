"use client"

import { useEffect, useRef, useState } from "react"
import { ExternalLink, Edit } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { isAuthenticated } from "@/lib/auth"

interface RouteMapProps {
  coordinates: [number, number][]
  routeName: string
  routeId?: string
}

export default function RouteMap({ coordinates, routeName, routeId }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(isAuthenticated())
  }, [])

  useEffect(() => {
    if (!mapRef.current) return

    // Create iframe with OpenStreetMap
    const iframe = document.createElement("iframe")
    iframe.style.width = "100%"
    iframe.style.height = "400px"
    iframe.style.border = "none"
    iframe.style.borderRadius = "8px"

    let mapUrl: string

    if (coordinates.length > 0) {
      // Use actual coordinates from the route
      const startLat = coordinates[0][0]
      const startLng = coordinates[0][1]
      const endLat = coordinates[coordinates.length - 1][0]
      const endLng = coordinates[coordinates.length - 1][1]

      // Center the map between start and end points
      const centerLat = (startLat + endLat) / 2
      const centerLng = (startLng + endLng) / 2

      // Create bounding box around the route
      const bbox = `${centerLng - 0.01},${centerLat - 0.01},${centerLng + 0.01},${centerLat + 0.01}`
      mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${centerLat},${centerLng}`
    } else {
      // Default to Nieuwerkerken center
      const centerLat = 50.9167
      const centerLng = 4.0333
      const bbox = `${centerLng - 0.01},${centerLat - 0.01},${centerLng + 0.01},${centerLat + 0.01}`
      mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${centerLat},${centerLng}`
    }

    iframe.src = mapUrl

    mapRef.current.innerHTML = ""
    mapRef.current.appendChild(iframe)
  }, [coordinates])

  const openFullscreenMap = () => {
    let mapUrl: string

    if (coordinates.length > 0) {
      const startLat = coordinates[0][0]
      const startLng = coordinates[0][1]
      const endLat = coordinates[coordinates.length - 1][0]
      const endLng = coordinates[coordinates.length - 1][1]
      const centerLat = (startLat + endLat) / 2
      const centerLng = (startLng + endLng) / 2
      mapUrl = `https://www.openstreetmap.org/?mlat=${centerLat}&mlon=${centerLng}&zoom=15#map=15/${centerLat}/${centerLng}`
    } else {
      // Default to Nieuwerkerken
      mapUrl = `https://www.openstreetmap.org/?mlat=50.9167&mlon=4.0333&zoom=15#map=15/50.9167/4.0333`
    }

    window.open(mapUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes')
  }

  const openRouteEditor = () => {
    if (!routeId) return
    
    // Open route editor in new window
    const editorUrl = `/route-editor/${routeId}`
    window.open(editorUrl, '_blank', 'width=1400,height=900,scrollbars=yes,resizable=yes')
  }

  return (
    <div className="space-y-4">
      <div ref={mapRef} className="h-96 bg-sage-lightest rounded-lg" />
      <div className="flex items-center justify-between">
        <button
          onClick={openFullscreenMap}
          className="text-sage hover:text-sage-light transition-colors duration-200 text-sm flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Klik hier om de kaart in een eigen venster te openen
        </button>
        
        {isLoggedIn && routeId && (
          <Button
            onClick={openRouteEditor}
            size="sm"
            className="bg-sage-light hover:bg-sage-lighter text-white"
          >
            <Edit className="w-4 h-4 mr-2" />
            Route Bewerken
          </Button>
        )}
      </div>
    </div>
  )
}
