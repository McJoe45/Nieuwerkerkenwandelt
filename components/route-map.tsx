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
    if (!mapRef.current || coordinates.length === 0) return

    // Create iframe with OpenStreetMap
    const iframe = document.createElement("iframe")
    iframe.style.width = "100%"
    iframe.style.height = "400px"
    iframe.style.border = "none"
    iframe.style.borderRadius = "8px"

    // Use OpenStreetMap with markers for start and end points
    const startLat = coordinates[0][0]
    const startLng = coordinates[0][1]
    const endLat = coordinates[coordinates.length - 1][0]
    const endLng = coordinates[coordinates.length - 1][1]

    // Center the map between start and end points
    const centerLat = (startLat + endLat) / 2
    const centerLng = (startLng + endLng) / 2

    iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${centerLng - 0.01},${centerLat - 0.01},${centerLng + 0.01},${centerLat + 0.01}&layer=mapnik&marker=${centerLat},${centerLng}`

    mapRef.current.innerHTML = ""
    mapRef.current.appendChild(iframe)
  }, [coordinates])

  const openFullscreenMap = () => {
    if (coordinates.length === 0) return

    const startLat = coordinates[0][0]
    const startLng = coordinates[0][1]
    const endLat = coordinates[coordinates.length - 1][0]
    const endLng = coordinates[coordinates.length - 1][1]
    const centerLat = (startLat + endLat) / 2
    const centerLng = (startLng + endLng) / 2

    const mapUrl = `https://www.openstreetmap.org/?mlat=${centerLat}&mlon=${centerLng}&zoom=15#map=15/${centerLat}/${centerLng}`
    window.open(mapUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes')
  }

  const openRouteEditor = () => {
    if (!routeId) return
    
    // Open route editor in new window
    const editorUrl = `/route-editor/${routeId}`
    window.open(editorUrl, '_blank', 'width=1400,height=900,scrollbars=yes,resizable=yes')
  }

  if (coordinates.length === 0) {
    return (
      <div className="space-y-4">
        <div className="h-96 bg-sage-lightest rounded-lg flex items-center justify-center">
          <p className="text-sage">Geen kaartgegevens beschikbaar</p>
        </div>
        {isLoggedIn && routeId && (
          <div className="flex justify-center">
            <Button
              onClick={openRouteEditor}
              className="bg-sage-light hover:bg-sage-lighter text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Route Tekenen
            </Button>
          </div>
        )}
      </div>
    )
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
