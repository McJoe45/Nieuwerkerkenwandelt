"use client"

import { useState, useEffect, useRef } from "react"
import { ExternalLink, Edit } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { isAuthenticated, getRouteById } from "@/lib/supabase"
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

declare global {
  interface Window {
    L: any;
  }
}

// Fix for default icon issues with Webpack
delete (L.Icon.Default.prototype as any)._get='_getIconUrl';
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface RouteMapProps {
  geojson: any;
  routeName?: string
  routeId?: string
  editable?: boolean
  onCoordinatesChange?: (coords: any) => void
  className?: string
}

export default function RouteMap({
  geojson,
  routeName,
  routeId,
  editable = false,
  onCoordinatesChange,
  className = "h-96 w-full rounded-lg",
}: RouteMapProps) {
  const [isClient, setIsClient] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const routeLayer = useRef<L.GeoJSON | null>(null)

  useEffect(() => {
    setIsClient(true)
    setIsLoggedIn(isAuthenticated())
  }, [])

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([50.93, 3.98], 13) // Centered around Nieuwerkerken

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.current)
    }

    if (mapInstance.current && geojson) {
      if (routeLayer.current) {
        mapInstance.current.removeLayer(routeLayer.current)
      }
      routeLayer.current = L.geoJSON(geojson, {
        style: {
          color: '#6B8E23', // Sage green
          weight: 5,
          opacity: 0.7
        }
      }).addTo(mapInstance.current)

      mapInstance.current.fitBounds(routeLayer.current.getBounds(), { padding: [50, 50] })
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [geojson])

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

  if (!isClient) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <p className="text-gray-500">Kaart wordt geladen...</p>
      </div>
    )
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
