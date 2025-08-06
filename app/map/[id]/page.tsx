"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getRouteById, type Route } from "@/lib/auth"

declare global {
  interface Window {
    L: any;
  }
}

export default function FullscreenMapPage() {
  const params = useParams()
  const [route, setRoute] = useState<Route | null>(null)
  const [loading, setLoading] = useState(true)
  const [scriptsLoaded, setScriptsLoaded] = useState(false)

  useEffect(() => {
    const loadRoute = async () => {
      if (!params.id) return
      
      try {
        const routeData = await getRouteById(params.id as string)
        setRoute(routeData)
      } catch (error) {
        console.error('Error loading route:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRoute()
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

  // Initialize map
  useEffect(() => {
    if (!scriptsLoaded || !route || !route.coordinates) return

    const L = window.L
    const mapContainer = document.getElementById('fullscreen-map')
    if (!mapContainer) return

    // Clear any existing map
    mapContainer.innerHTML = ''

    const map = L.map('fullscreen-map').setView([50.9167, 4.0333], 15)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    const coords = route.coordinates

    if (coords && coords.length > 0) {
      if (coords.length === 1) {
        // Single point
        map.setView([coords[0][0], coords[0][1]], 16)
        L.marker([coords[0][0], coords[0][1]], {
          icon: L.divIcon({
            className: 'custom-marker',
            html: '<div style="background-color: green; color: white; border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">START</div>',
            iconSize: [25, 25],
            iconAnchor: [12, 12]
          })
        }).addTo(map)
      } else {
        // Multiple points - draw the route
        const polyline = L.polyline(coords, {
          color: 'red',
          weight: 4,
          opacity: 0.8
        }).addTo(map)

        // Add start marker
        L.marker([coords[0][0], coords[0][1]], {
          icon: L.divIcon({
            className: 'custom-marker',
            html: '<div style="background-color: green; color: white; border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 8px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">START</div>',
            iconSize: [25, 25],
            iconAnchor: [12, 12]
          })
        }).addTo(map)

        // Add end marker
        L.marker([coords[coords.length - 1][0], coords[coords.length - 1][1]], {
          icon: L.divIcon({
            className: 'custom-marker',
            html: '<div style="background-color: red; color: white; border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 8px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">EINDE</div>',
            iconSize: [25, 25],
            iconAnchor: [12, 12]
          })
        }).addTo(map)

        // Fit map to route bounds
        map.fitBounds(polyline.getBounds(), { 
          padding: [20, 20],
          maxZoom: 16
        })
      }
    }
  }, [scriptsLoaded, route])

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-cream">
        <p className="text-sage-dark text-xl">Route wordt geladen...</p>
      </div>
    )
  }

  if (!route) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-cream">
        <p className="text-red-600 text-xl">Route niet gevonden</p>
      </div>
    )
  }

  return (
    <div className="w-full h-screen">
      <div className="absolute top-4 left-4 z-[1000] bg-white p-3 rounded-lg shadow-lg">
        <h1 className="text-lg font-bold text-sage-dark">{route.name}</h1>
        <p className="text-sm text-sage">{route.distance} km • {route.duration}</p>
      </div>
      <div id="fullscreen-map" className="w-full h-full"></div>
    </div>
  )
}
