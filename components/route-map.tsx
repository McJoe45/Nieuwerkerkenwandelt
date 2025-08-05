"use client"

import { useEffect, useRef } from "react"

interface RouteMapProps {
  coordinates: [number, number][]
  routeName: string
}

export default function RouteMap({ coordinates, routeName }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current || coordinates.length === 0) return

    // Create iframe with OpenStreetMap
    const iframe = document.createElement("iframe")
    iframe.style.width = "100%"
    iframe.style.height = "400px"
    iframe.style.border = "none"
    iframe.style.borderRadius = "8px"

    // Use OpenStreetMap with markers for start and end points
    const startLat = coordinates[0][0]
    const startLng = coordinates[0][1]
    const endLat = coordinates[coordinates.length - 1][0]
    const endLng = coordinates[coordinates.length - 1][1]

    // Center the map between start and end points
    const centerLat = (startLat + endLat) / 2
    const centerLng = (startLng + endLng) / 2

    iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${centerLng - 0.01},${centerLat - 0.01},${centerLng + 0.01},${centerLat + 0.01}&layer=mapnik&marker=${centerLat},${centerLng}`

    mapRef.current.innerHTML = ""
    mapRef.current.appendChild(iframe)
  }, [coordinates])

  if (coordinates.length === 0) {
    return (
      <div className="h-96 bg-sage-lightest rounded-lg flex items-center justify-center">
        <p className="text-sage">Geen kaartgegevens beschikbaar</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div ref={mapRef} className="h-96 bg-sage-lightest rounded-lg" />
      <div className="text-sm text-sage space-y-1">
        <p>
          <strong>Startpunt:</strong> {coordinates[0][0].toFixed(4)}, {coordinates[0][1].toFixed(4)}
        </p>
        <p>
          <strong>Eindpunt:</strong> {coordinates[coordinates.length - 1][0].toFixed(4)},{" "}
          {coordinates[coordinates.length - 1][1].toFixed(4)}
        </p>
        <p className="text-xs text-sage/80">Klik op de kaart om deze in een nieuw venster te openen</p>
      </div>
    </div>
  )
}
