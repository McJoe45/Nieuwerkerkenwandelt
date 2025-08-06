"use client"

import { useState, useEffect, useRef } from "react"
import { ExternalLink, Edit } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { isAuthenticated, getRouteById } from "@/lib/supabase"

declare global {
  interface Window {
    L: any;
  }
}

interface RouteMapProps {
  coordinates: [number, number][]
  routeName?: string
  routeId?: string
  editable?: boolean
  onCoordinatesChange?: (coords: [number, number][]) => void
  className?: string
}

export default function RouteMap({
  coordinates: initialCoordinates,
  routeName,
  routeId,
  editable = false,
  onCoordinatesChange,
  className = "h-96 w-full rounded-lg",
}: RouteMapProps) {
  const [isClient, setIsClient] = useState(false)
  const [coordinates, setCoordinates] = useState(initialCoordinates)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [scriptsLoaded, setScriptsLoaded] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    setIsClient(true)
    setIsLoggedIn(isAuthenticated())
  }, [])

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

  // Initialize map when scripts are loaded
  useEffect(() => {
    if (!scriptsLoaded || !mapRef.current || mapInstanceRef.current) return

    const L = window.L
    const map = L.map(mapRef.current).setView([50.9167, 4.0333], 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    mapInstanceRef.current = map

    // Display initial coordinates
    if (coordinates && coordinates.length > 0) {
      displayRoute(coordinates)
    }

  }, [scriptsLoaded])

  // Update coordinates when props change
  useEffect(() => {
    setCoordinates(initialCoordinates)
    if (mapInstanceRef.current && scriptsLoaded) {
      displayRoute(initialCoordinates)
    }
  }, [initialCoordinates, scriptsLoaded])

  // Listen for route updates from editor window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'ROUTE_UPDATED' && event.data.routeId === routeId) {
        console.log('Received route update message:', event.data)
        const newCoordinates = event.data.coordinates
        setCoordinates(newCoordinates)
        if (mapInstanceRef.current && scriptsLoaded) {
          displayRoute(newCoordinates)
        }
      }
    }

    const handleStorageChange = async (event: StorageEvent) => {
      if (event.key === 'routes' && routeId) {
        console.log('Storage changed, refreshing route data')
        // Get fresh route data from storage
        const updatedRoute = await getRouteById(routeId)
        if (updatedRoute && updatedRoute.coordinates) {
          const newCoordinates = updatedRoute.coordinates
          setCoordinates(newCoordinates)
          if (mapInstanceRef.current && scriptsLoaded) {
            displayRoute(newCoordinates)
          }
        }
      }
    }

    const handleFocus = async () => {
      // When window regains focus, check for route updates
      if (routeId) {
        const updatedRoute = await getRouteById(routeId)
        if (updatedRoute && updatedRoute.coordinates) {
          const currentCoords = JSON.stringify(coordinates)
          const newCoords = JSON.stringify(updatedRoute.coordinates)
          if (currentCoords !== newCoords) {
            console.log('Route updated while window was not focused')
            const newCoordinates = updatedRoute.coordinates
            setCoordinates(newCoordinates)
            if (mapInstanceRef.current && scriptsLoaded) {
              displayRoute(newCoordinates)
            }
          }
        }
      }
    }

    window.addEventListener('message', handleMessage)
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('message', handleMessage)
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [routeId, coordinates, scriptsLoaded])

  const displayRoute = (coords: [number, number][]) => {
    if (!mapInstanceRef.current || !window.L || !coords || coords.length === 0) return

    const L = window.L

    // Clear existing layers
    mapInstanceRef.current.eachLayer((layer: any) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        mapInstanceRef.current.removeLayer(layer)
      }
    })

    if (coords.length === 1) {
      // Single point
      mapInstanceRef.current.setView([coords[0][0], coords[0][1]], 16)
      L.marker([coords[0][0], coords[0][1]], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: '<div style="background-color: green; color: white; border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">START</div>',
          iconSize: [25, 25],
          iconAnchor: [12, 12]
        })
      }).addTo(mapInstanceRef.current)
      return
    }

    // Multiple points - draw the route
    const polyline = L.polyline(coords, {
      color: 'red',
      weight: 4,
      opacity: 0.8
    }).addTo(mapInstanceRef.current)

    // Add start marker
    L.marker([coords[0][0], coords[0][1]], {
      icon: L.divIcon({
        className: 'custom-marker',
        html: '<div style="background-color: green; color: white; border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 8px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">START</div>',
        iconSize: [25, 25],
        iconAnchor: [12, 12]
      })
    }).addTo(mapInstanceRef.current)

    // Add end marker
    L.marker([coords[coords.length - 1][0], coords[coords.length - 1][1]], {
      icon: L.divIcon({
        className: 'custom-marker',
        html: '<div style="background-color: red; color: white; border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 8px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">EINDE</div>',
        iconSize: [25, 25],
        iconAnchor: [12, 12]
      })
    }).addTo(mapInstanceRef.current)

    // Fit map to route bounds with padding
    mapInstanceRef.current.fitBounds(polyline.getBounds(), { 
      padding: [20, 20],
      maxZoom: 16
    })

    console.log('Route displayed:', coords.length, 'points')
  }

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

  if (!scriptsLoaded) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <p className="text-gray-500">Kaart scripts worden geladen...</p>
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
