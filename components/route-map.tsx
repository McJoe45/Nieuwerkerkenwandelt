"use client"

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Button } from "@/components/ui/button"
import { isAuthenticated } from "@/lib/supabase"
import { ExternalLink, Edit } from 'lucide-react'

// Fix for default Leaflet icon issue with Webpack
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface RouteMapProps {
  coordinates: [number, number][] // Array of [latitude, longitude] pairs
  mapId: string // Unique ID for the map container
}

export default function RouteMap({ coordinates, mapId }: RouteMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<L.Map | null>(null)
  const polylineRef = useRef<L.Polyline | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return

    // Initialize map if it doesn't exist
    if (!leafletMapRef.current) {
      leafletMapRef.current = L.map(mapContainerRef.current).setView([50.93, 4.03], 13) // Default view for Nieuwerkerken

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(leafletMapRef.current)
    }

    const map = leafletMapRef.current

    // Clear existing polyline and markers
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current)
    }
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer)
      }
    })

    if (coordinates && coordinates.length > 0) {
      const latlngs = coordinates.map(coord => [coord[0], coord[1]] as L.LatLngExpression)

      // Add new polyline
      polylineRef.current = L.polyline(latlngs, { color: '#4CAF50', weight: 5 }).addTo(map)

      // Fit map to polyline bounds
      map.fitBounds(polylineRef.current.getBounds())

      // Add start and end markers
      L.marker(latlngs[0]).addTo(map).bindPopup('Startpunt').openPopup()
      L.marker(latlngs[latlngs.length - 1]).addTo(map).bindPopup('Eindpunt')
    }

    // Invalidate map size to ensure it renders correctly, especially after container resize
    map.invalidateSize()

    // Cleanup function
    return () => {
      // No need to remove the map instance itself, as it's managed by the parent component's lifecycle
      // We only clear layers to prepare for potential re-renders with new data
      if (polylineRef.current) {
        map.removeLayer(polylineRef.current)
        polylineRef.current = null
      }
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer)
        }
      })
    }
  }, [coordinates, mapId]) // Re-run effect if coordinates or mapId change

  return (
    <div id={mapId} ref={mapContainerRef} className="w-full h-[500px] rounded-lg shadow-lg border-2 border-beige"></div>
  )
}
