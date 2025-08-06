"use client"

import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet"
import { LatLngExpression } from "leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import Link from "next/link"
import { ExternalLink } from 'lucide-react'

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
  coordinates,
  routeName,
  routeId,
  editable = false,
  onCoordinatesChange,
  className = "h-96 w-full rounded-lg",
}: RouteMapProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

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

  return (
    <div className="relative">
      <MapContainer
        center={center}
        zoom={13}
        className={className}
        style={{ height: "400px", width: "100%" }}
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
      
      {/* Link to fullscreen map - only show if not in admin mode */}
      {routeId && !editable && (
        <div className="mt-4">
          <Link 
            href={`/map/${routeId}`}
            target="_blank"
            className="text-sage hover:text-sage-light text-sm flex items-center gap-1 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Klik hier om de kaart in een eigen venster te openen
          </Link>
        </div>
      )}
    </div>
  )
}
