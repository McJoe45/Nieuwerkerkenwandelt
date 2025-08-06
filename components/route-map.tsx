"use client"

import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet"
import { LatLngExpression } from "leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import Link from "next/link"
import { ExternalLink, Edit } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { isAuthenticated, getRouteById } from "@/lib/auth"

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

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
  const [mapKey, setMapKey] = useState(0) // Force re-render

  useEffect(() => {
    setIsClient(true)
    setIsLoggedIn(isAuthenticated())
  }, [])

  // Update coordinates when props change
  useEffect(() => {
    setCoordinates(initialCoordinates)
  }, [initialCoordinates])

  // Listen for route updates from editor window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'ROUTE_UPDATED' && event.data.routeId === routeId) {
        console.log('Received route update message:', event.data)
        setCoordinates(event.data.coordinates)
        setMapKey(prev => prev + 1) // Force map re-render
      }
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'routes' && routeId) {
        console.log('Storage changed, refreshing route data')
        // Get fresh route data from storage
        const updatedRoute = getRouteById(routeId)
        if (updatedRoute && updatedRoute.coordinates) {
          setCoordinates(updatedRoute.coordinates)
          setMapKey(prev => prev + 1) // Force map re-render
        }
      }
    }

    const handleFocus = () => {
      // When window regains focus, check for route updates
      if (routeId) {
        const updatedRoute = getRouteById(routeId)
        if (updatedRoute && updatedRoute.coordinates) {
          const currentCoords = JSON.stringify(coordinates)
          const newCoords = JSON.stringify(updatedRoute.coordinates)
          if (currentCoords !== newCoords) {
            console.log('Route updated while window was not focused')
            setCoordinates(updatedRoute.coordinates)
            setMapKey(prev => prev + 1) // Force map re-render
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
  }, [routeId, coordinates])

  if (!isClient) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <p className="text-gray-500">Kaart wordt geladen...</p>
      </div>
    )
  }

  if (!coordinates || coordinates.length === 0) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <p className="text-gray-500">Geen route gegevens beschikbaar</p>
      </div>
    )
  }

  // Convert coordinates to LatLngExpression format
  const pathCoordinates: LatLngExpression[] = coordinates.map(([lat, lng]) => [lat, lng])

  // Calculate center point
  const centerLat = coordinates.reduce((sum, [lat]) => sum + lat, 0) / coordinates.length
  const centerLng = coordinates.reduce((sum, [, lng]) => sum + lng, 0) / coordinates.length
  const center: LatLngExpression = [centerLat, centerLng]

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
      <MapContainer
        center={center}
        zoom={13}
        className={className}
        style={{ height: "400px", width: "100%" }}
        key={`map-${routeId}-${mapKey}`} // Force re-render when coordinates change
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Route line */}
        <Polyline
          positions={pathCoordinates}
          color="red"
          weight={4}
          opacity={0.8}
        />
        
        {/* Start marker */}
        {coordinates.length > 0 && (
          <Marker position={[coordinates[0][0], coordinates[0][1]]}>
            <Popup>
              <div className="text-center">
                <strong>Start</strong>
                {routeName && <div>{routeName}</div>}
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* End marker (if different from start) */}
        {coordinates.length > 1 && (
          <Marker position={[coordinates[coordinates.length - 1][0], coordinates[coordinates.length - 1][1]]}>
            <Popup>
              <div className="text-center">
                <strong>Einde</strong>
                {routeName && <div>{routeName}</div>}
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      
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
