"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet"
import { LatLngExpression } from "leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { getRouteById } from "@/lib/auth"

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

interface Route {
  id: string
  name: string
  coordinates: [number, number][]
}

export default function FullscreenMapPage() {
  const params = useParams()
  const [route, setRoute] = useState<Route | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const routeData = getRouteById(params.id as string)
    setRoute(routeData)
  }, [params.id])

  if (!isClient) {
    return (
      <div className="h-screen w-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Kaart wordt geladen...</p>
      </div>
    )
  }

  if (!route || !route.coordinates || route.coordinates.length === 0) {
    return (
      <div className="h-screen w-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Route niet gevonden</p>
      </div>
    )
  }

  // Convert coordinates to LatLngExpression format
  const pathCoordinates: LatLngExpression[] = route.coordinates.map(([lat, lng]) => [lat, lng])

  // Calculate center point
  const centerLat = route.coordinates.reduce((sum, [lat]) => sum + lat, 0) / route.coordinates.length
  const centerLng = route.coordinates.reduce((sum, [, lng]) => sum + lng, 0) / route.coordinates.length
  const center: LatLngExpression = [centerLat, centerLng]

  return (
    <div className="h-screen w-screen">
      <MapContainer
        center={center}
        zoom={13}
        className="h-full w-full"
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
        <Marker position={[route.coordinates[0][0], route.coordinates[0][1]]}>
          <Popup>
            <div className="text-center">
              <strong>Start</strong>
              <div>{route.name}</div>
            </div>
          </Popup>
        </Marker>
        
        {/* End marker (if different from start) */}
        {route.coordinates.length > 1 && (
          <Marker position={[route.coordinates[route.coordinates.length - 1][0], route.coordinates[route.coordinates.length - 1][1]]}>
            <Popup>
              <div className="text-center">
                <strong>Einde</strong>
                <div>{route.name}</div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}
