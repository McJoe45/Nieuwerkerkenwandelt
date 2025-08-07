"use client"

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Button } from "@/components/ui/button"
import { isAuthenticated } from "@/lib/supabase"
import { ExternalLink, Edit } from 'lucide-react'

// Fix for default Leaflet icon issue with Webpack
delete (L.Icon.Default.prototype as any)._get='iconUrl';
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface RouteMapProps {
  coordinates: { lat: number; lng: number }[]
  id: string // Unique ID to force re-render
  routeName?: string
  routeId?: string
  editable?: boolean
  onCoordinatesChange?: (coords: any) => void
  className?: string
}

export default function RouteMap({ coordinates, id, routeName, routeId, editable = false, onCoordinatesChange, className = "h-96 w-full rounded-lg" }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<L.Map | null>(null)
  const polylineRef = useRef<L.Polyline | null>(null)
  const markersRef = useRef<L.Marker[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(isAuthenticated())
  }, [])

  useEffect(() => {
    if (!mapRef.current) return

    if (!leafletMapRef.current) {
      // Initialize map only once
      leafletMapRef.current = L.map(mapRef.current, {
        center: [50.93, 3.98], // Default center for Nieuwerkerken
        zoom: 13,
        scrollWheelZoom: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(leafletMapRef.current)
    }

    const map = leafletMapRef.current
    const polylinePath = coordinates.map(coord => [coord.lat, coord.lng]) as L.LatLngExpression[]

    // Clear existing polyline and markers
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current)
    }
    markersRef.current.forEach(marker => map.removeLayer(marker))
    markersRef.current = []

    if (polylinePath.length > 0) {
      // Add new polyline
      polylineRef.current = L.polyline(polylinePath, { color: '#6B8E23', weight: 5 }).addTo(map)

      // Add markers
      polylinePath.forEach((pos, index) => {
        const marker = L.marker(pos).addTo(map)
        markersRef.current.push(marker)
      })

      // Fit bounds to the polyline
      const bounds = L.latLngBounds(polylinePath)
      map.fitBounds(bounds, { padding: [50, 50] })
    } else {
      // If no coordinates, reset view to default center
      map.setView([50.93, 3.98], 13)
    }

    // Cleanup function
    return () => {
      // No need to remove map, as it's managed by leafletMapRef.current
      // Only clear layers if component unmounts or ID changes significantly
      if (polylineRef.current) {
        map.removeLayer(polylineRef.current)
        polylineRef.current = null
      }
      markersRef.current.forEach(marker => map.removeLayer(marker))
      markersRef.current = []
    }
  }, [coordinates, id]) // Re-run effect if coordinates or id change

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
    <div className="relative">
      <div 
        ref={mapRef} 
        className={className}
        style={{ height: "400px", width: "100%" }}
      />
      
      {/* Controls based on mode */}
      {routeId && (
        <div className="mt-4 flex items-center justify-between">
          {/* Regular mode: show fullscreen link */}
          {!isLoggedIn && (
            <button
              onClick={openFullscreenMap}
              className="text-sage hover:text-sage-light text-sm flex items-center gap-1 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Klik hier om de kaart in een eigen venster te openen
            </button>
          )}
          
          {/* Admin mode: show edit button */}
          {isLoggedIn && (
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
      )}
    </div>
  )
}
