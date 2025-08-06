"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { ExternalLink, Edit } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { isAuthenticated, getRouteById } from "@/lib/auth"

// Fix for default markers in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

interface RouteMapProps {
  coordinates: [number, number][]
  height?: string
  routeName: string
  routeId?: string
}

export default function RouteMap({ coordinates: initialCoordinates, height = "400px", routeName, routeId }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [coordinates, setCoordinates] = useState(initialCoordinates)

  useEffect(() => {
    setIsLoggedIn(isAuthenticated())
  }, [])

  useEffect(() => {
    if (!mapRef.current || !coordinates || coordinates.length === 0) return

    // Clean up existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
    }

    // Create new map
    const map = L.map(mapRef.current).setView(coordinates[0], 13)

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    // Add markers for start and end
    if (coordinates.length > 0) {
      L.marker(coordinates[0]).addTo(map).bindPopup("Start")
      
      if (coordinates.length > 1) {
        L.marker(coordinates[coordinates.length - 1]).addTo(map).bindPopup("Einde")
      }
    }

    // Add route line
    if (coordinates.length > 1) {
      L.polyline(coordinates, { 
        color: "red", 
        weight: 4, 
        opacity: 0.7 
      }).addTo(map)

      // Fit map to show all coordinates
      const group = new L.FeatureGroup(coordinates.map(coord => L.marker(coord)))
      map.fitBounds(group.getBounds().pad(0.1))
    }

    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [coordinates])

  const openFullscreenMap = () => {
    if (!routeId) return
    
    const mapUrl = `/map/${routeId}`
    window.open(mapUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes')
  }

  const openRouteEditor = () => {
    if (!routeId) return
    
    const editorUrl = `/route-editor/${routeId}`
    window.open(editorUrl, '_blank', 'width=1400,height=900,scrollbars=yes,resizable=yes')
  }

  return (
    <div className="space-y-4">
      <div 
        ref={mapRef} 
        style={{ height, width: "100%" }}
        className="rounded-lg border border-sage-light/20"
      />
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
