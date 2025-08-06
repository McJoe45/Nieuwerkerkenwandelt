"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { getRouteById } from "@/lib/auth"

interface Route {
  id: string
  name: string
  coordinates: [number, number][]
}

declare global {
  interface Window {
    L: any;
  }
}

export default function FullscreenMapPage() {
  const params = useParams()
  const [route, setRoute] = useState<Route | null>(null)
  const [scriptsLoaded, setScriptsLoaded] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

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

  // Initialize map when scripts are loaded and route is available
  useEffect(() => {
    if (!scriptsLoaded || !mapRef.current || !route || mapInstanceRef.current) return

    const L = window.L
    
    // Calculate center point
    const centerLat = route.coordinates.reduce((sum, [lat]) => sum + lat, 0) / route.coordinates.length
    const centerLng = route.coordinates.reduce((sum, [, lng]) => sum + lng, 0) / route.coordinates.length
    
    const map = L.map(mapRef.current).setView([centerLat, centerLng], 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    mapInstanceRef.current = map

    // Add route line
    const polyline = L.polyline(route.coordinates, {
      color: 'red',
      weight: 4,
      opacity: 0.8
    }).addTo(map)

    // Add start marker
    L.marker([route.coordinates[0][0], route.coordinates[0][1]], {
      icon: L.divIcon({
        className: 'custom-marker',
        html: '<div style="background-color: green; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 8px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">START</div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      })
    }).addTo(map)

    // Add end marker (if different from start)
    if (route.coordinates.length > 1) {
      const endCoord = route.coordinates[route.coordinates.length - 1]
      L.marker([endCoord[0], endCoord[1]], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: '<div style="background-color: red; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 8px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">EINDE</div>',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        })
      }).addTo(map)
    }

    // Fit map to route bounds
    map.fitBounds(polyline.getBounds(), { 
      padding: [20, 20],
      maxZoom: 16
    })

    // Force map to resize after a short delay
    setTimeout(() => {
      map.invalidateSize()
    }, 100)

  }, [scriptsLoaded, route])

  if (!route) {
    return (
      <div className="h-screen w-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">Route niet gevonden</h1>
          <p className="text-gray-500">De opgevraagde route kon niet worden geladen.</p>
        </div>
      </div>
    )
  }

  if (!scriptsLoaded) {
    return (
      <div className="h-screen w-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage mx-auto mb-4"></div>
          <p className="text-gray-500">Kaart wordt geladen...</p>
        </div>
      </div>
    )
  }

  if (!route.coordinates || route.coordinates.length === 0) {
    return (
      <div className="h-screen w-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">Geen route gegevens</h1>
          <p className="text-gray-500">Deze route heeft geen coördinaten.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen relative">
      {/* Header with route name */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-sage-dark">{route.name}</h1>
          <button
            onClick={() => window.close()}
            className="text-gray-500 hover:text-gray-700 text-sm px-3 py-1 rounded border border-gray-300 hover:bg-gray-50"
          >
            Sluiten
          </button>
        </div>
      </div>

      {/* Map container */}
      <div 
        ref={mapRef} 
        className="h-full w-full"
        style={{ 
          height: '100vh', 
          width: '100vw',
          paddingTop: '60px' // Account for header
        }}
      />
    </div>
  )
}
