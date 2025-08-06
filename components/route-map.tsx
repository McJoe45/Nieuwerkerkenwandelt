"use client"

import { useEffect, useRef, useState } from "react"
import { ExternalLink, Edit } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { isAuthenticated, getRouteById } from "@/lib/auth"

interface RouteMapProps {
  coordinates: [number, number][]
  routeName: string
  routeId?: string
}

declare global {
  interface Window {
    L: any;
  }
}

export default function RouteMap({ coordinates: initialCoordinates, routeName, routeId }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [coordinates, setCoordinates] = useState(initialCoordinates)
  const [scriptsLoaded, setScriptsLoaded] = useState(false)

  useEffect(() => {
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

  // Initialize map
  useEffect(() => {
    if (!scriptsLoaded || !mapRef.current || mapInstanceRef.current) return

    const L = window.L
    const map = L.map(mapRef.current).setView([50.9167, 4.0333], 15)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    mapInstanceRef.current = map
    displayRoute(coordinates)
  }, [scriptsLoaded])

  // Listen for route updates from the editor window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'ROUTE_UPDATED' && event.data.routeId === routeId) {
        console.log('RouteMap received update:', event.data)
        setCoordinates(event.data.coordinates)
        
        // Also update the route in localStorage to ensure persistence
        if (event.data.route) {
          const routes = JSON.parse(localStorage.getItem('routes') || '[]')
          const routeIndex = routes.findIndex((r: any) => r.id === routeId)
          if (routeIndex !== -1) {
            routes[routeIndex] = event.data.route
            localStorage.setItem('routes', JSON.stringify(routes))
          }
        }
      }
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'routes' && routeId) {
        console.log('Storage changed, reloading route')
        const route = getRouteById(routeId)
        if (route && route.coordinates && route.coordinates.length > 0) {
          setCoordinates(route.coordinates)
        }
      }
    }

    window.addEventListener('message', handleMessage)
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('message', handleMessage)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [routeId])

  // Check for route updates when component becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && routeId) {
        const route = getRouteById(routeId)
        if (route && route.coordinates && route.coordinates.length > 0) {
          console.log('Visibility change - updating route:', route.coordinates.length)
          setCoordinates(route.coordinates)
        }
      }
    }

    const handleFocus = () => {
      if (routeId) {
        // Reload route data when window gets focus
        const route = getRouteById(routeId)
        if (route && route.coordinates && route.coordinates.length > 0) {
          console.log('Window focus - updating route:', route.coordinates.length)
          setCoordinates(route.coordinates)
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [routeId])

  // Update route display when coordinates change
  useEffect(() => {
    if (mapInstanceRef.current && scriptsLoaded) {
      displayRoute(coordinates)
    }
  }, [coordinates, scriptsLoaded])

  const displayRoute = (coords: [number, number][]) => {
    if (!mapInstanceRef.current || !window.L) return

    const L = window.L

    // Clear existing layers
    mapInstanceRef.current.eachLayer((layer: any) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        mapInstanceRef.current.removeLayer(layer)
      }
    })

    if (coords.length === 0) {
      // No route, show default Nieuwerkerken location
      mapInstanceRef.current.setView([50.9167, 4.0333], 15)
      L.marker([50.9167, 4.0333], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: '<div style="background-color: blue; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">📍</div>',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        })
      }).addTo(mapInstanceRef.current)
      return
    }

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

  if (!scriptsLoaded) {
    return (
      <div className="space-y-4">
        <div className="h-96 bg-sage-lightest rounded-lg flex items-center justify-center">
          <p className="text-sage-dark">Kaart wordt geladen...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div ref={mapRef} className="h-96 bg-sage-lightest rounded-lg border border-sage-light" />
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
