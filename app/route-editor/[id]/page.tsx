"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Save, Trash2, MapPin, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getRouteById, updateRoute } from "@/lib/auth"

interface Route {
  id: string
  name: string
  gehuchten: string[]
  distance: number
  muddy: boolean
  description: string
  coordinates: [number, number][]
  difficulty: string
  duration: string
  highlights: string[]
}

declare global {
  interface Window {
    L: any;
  }
}

export default function RouteEditorPage() {
  const params = useParams()
  const [route, setRoute] = useState<Route | null>(null)
  const [coordinates, setCoordinates] = useState<[number, number][]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [totalDistance, setTotalDistance] = useState(0)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const routingControlRef = useRef<any>(null)
  const [scriptsLoaded, setScriptsLoaded] = useState(false)

  useEffect(() => {
    const routeData = getRouteById(params.id as string)
    if (routeData) {
      setRoute(routeData)
      setCoordinates(routeData.coordinates)
    }
  }, [params.id])

  // Load Leaflet and Routing Machine scripts
  useEffect(() => {
    const loadScripts = async () => {
      if (typeof window !== 'undefined' && !window.L) {
        // Load Leaflet CSS
        const leafletCSS = document.createElement('link')
        leafletCSS.rel = 'stylesheet'
        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(leafletCSS)

        // Load Leaflet JS
        const leafletJS = document.createElement('script')
        leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        leafletJS.onload = () => {
          // Load Routing Machine CSS
          const routingCSS = document.createElement('link')
          routingCSS.rel = 'stylesheet'
          routingCSS.href = 'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css'
          document.head.appendChild(routingCSS)

          // Load Routing Machine JS
          const routingJS = document.createElement('script')
          routingJS.src = 'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js'
          routingJS.onload = () => {
            setScriptsLoaded(true)
          }
          document.body.appendChild(routingJS)
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

    // Initialize map centered on Nieuwerkerken
    const map = L.map(mapRef.current).setView([50.9167, 4.0333], 15)

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    mapInstanceRef.current = map

    // Add existing route if available
    if (coordinates.length > 0) {
      updateRouteOnMap(coordinates)
    }

  }, [scriptsLoaded])

  const updateRouteOnMap = (waypoints: [number, number][]) => {
    if (!mapInstanceRef.current || !window.L) return

    const L = window.L

    // Remove existing routing control
    if (routingControlRef.current) {
      mapInstanceRef.current.removeControl(routingControlRef.current)
    }

    if (waypoints.length >= 2) {
      // Create routing control with waypoints
      const routingControl = L.Routing.control({
        waypoints: waypoints.map(coord => L.latLng(coord[0], coord[1])),
        routeWhileDragging: false,
        addWaypoints: false,
        createMarker: function(i: number, waypoint: any, n: number) {
          const isStart = i === 0
          const isEnd = i === n - 1
          
          let markerColor = 'blue'
          let markerText = `${i + 1}`
          
          if (isStart) {
            markerColor = 'green'
            markerText = 'START'
          } else if (isEnd) {
            markerColor = 'red' 
            markerText = 'EINDE'
          }

          return L.marker(waypoint.latLng, {
            draggable: false,
            icon: L.divIcon({
              className: 'custom-marker',
              html: `<div style="background-color: ${markerColor}; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${markerText}</div>`,
              iconSize: [30, 30],
              iconAnchor: [15, 15]
            })
          })
        },
        lineOptions: {
          styles: [{ color: '#ff0000', weight: 4, opacity: 0.8 }]
        },
        show: false, // Hide the instruction panel
        collapsible: false
      }).on('routesfound', function(e: any) {
        const routes = e.routes
        const summary = routes[0].summary
        setTotalDistance(Math.round(summary.totalDistance / 100) / 10) // Convert to km
      }).addTo(mapInstanceRef.current)

      routingControlRef.current = routingControl
    } else if (waypoints.length === 1) {
      // Single point - just show start marker
      L.marker([waypoints[0][0], waypoints[0][1]], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: '<div style="background-color: green; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">START</div>',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        })
      }).addTo(mapInstanceRef.current)
    }
  }

  // Handle map clicks when drawing
  useEffect(() => {
    if (!mapInstanceRef.current || !isDrawing) return

    const handleMapClick = (e: any) => {
      const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng]
      const newCoordinates = [...coordinates, newPoint]
      setCoordinates(newCoordinates)
      updateRouteOnMap(newCoordinates)
    }

    mapInstanceRef.current.on('dblclick', handleMapClick)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off('dblclick', handleMapClick)
      }
    }
  }, [isDrawing, coordinates])

  const startDrawing = () => {
    setIsDrawing(true)
    if (mapInstanceRef.current) {
      mapInstanceRef.current.getContainer().style.cursor = 'crosshair'
    }
  }

  const finishRoute = () => {
    setIsDrawing(false)
    if (mapInstanceRef.current) {
      mapInstanceRef.current.getContainer().style.cursor = ''
    }
  }

  const removeLastPoint = () => {
    if (coordinates.length > 0) {
      const newCoordinates = coordinates.slice(0, -1)
      setCoordinates(newCoordinates)
      updateRouteOnMap(newCoordinates)
    }
  }

  const clearRoute = () => {
    if (confirm('Weet je zeker dat je de hele route wilt wissen?')) {
      setCoordinates([])
      setTotalDistance(0)
      if (routingControlRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeControl(routingControlRef.current)
        routingControlRef.current = null
      }
      // Clear all markers
      if (mapInstanceRef.current) {
        mapInstanceRef.current.eachLayer((layer: any) => {
          if (layer instanceof window.L.Marker) {
            mapInstanceRef.current.removeLayer(layer)
          }
        })
      }
    }
  }

  const saveRoute = () => {
    if (!route) return
    
    const updatedRoute = {
      ...route,
      coordinates,
      distance: totalDistance
    }
    
    updateRoute(updatedRoute)
    alert('Route opgeslagen!')
  }

  if (!route) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-sage-dark text-xl">Route niet gevonden...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-6">
        {/* Back button */}
        <div className="mb-6">
          <Link href={`/route/${route.id}`}>
            <Button
              variant="outline"
              className="border-sage-light text-sage-dark hover:bg-sage-lightest bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug naar route
            </Button>
          </Link>
        </div>

        <Card className="border-beige bg-white mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-sage-dark flex items-center gap-2 title-font">
              <MapPin className="w-6 h-6" />
              Route Editor: {route.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                {!isDrawing ? (
                  <Button
                    onClick={startDrawing}
                    className="bg-sage-light hover:bg-sage-lighter text-white"
                  >
                    Start Tekenen
                  </Button>
                ) : (
                  <Button
                    onClick={finishRoute}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Route Klaar
                  </Button>
                )}
                
                <Button
                  onClick={removeLastPoint}
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-50"
                  disabled={coordinates.length === 0}
                >
                  Laatste Punt Wissen
                </Button>
                
                <Button
                  onClick={clearRoute}
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                  disabled={coordinates.length === 0}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Alles Wissen
                </Button>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-sage-dark text-sm">
                  <span className="font-medium">Afstand: {totalDistance} km</span>
                  <span className="ml-4">Punten: {coordinates.length}</span>
                </div>
                <Button
                  onClick={saveRoute}
                  className="bg-sage-light hover:bg-sage-lighter text-white"
                  disabled={coordinates.length === 0}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Opslaan
                </Button>
              </div>
            </div>
            
            {isDrawing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 mb-4">
                <p className="font-medium mb-2">🎯 Teken Modus Actief</p>
                <p><strong>Dubbelklik</strong> op de kaart om punten toe te voegen. De route wordt automatisch via wegen en paden getekend.</p>
                <p>Klik "Route Klaar" wanneer je klaar bent met tekenen.</p>
              </div>
            )}

            {!scriptsLoaded && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 mb-4">
                <p>Kaart wordt geladen...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Interactive Map Area */}
        <Card className="border-beige bg-white">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Map Container */}
              <div 
                ref={mapRef}
                className="h-[600px] bg-sage-lightest rounded-lg border border-sage-light"
                style={{ minHeight: '600px' }}
              />
              
              {/* Route info */}
              {coordinates.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-sage-light">
                  <h4 className="font-semibold text-sage-dark mb-2">Route Punten ({coordinates.length}):</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm max-h-40 overflow-y-auto">
                    {coordinates.map((coord, index) => (
                      <div key={index} className="text-sage bg-sage-lightest rounded px-2 py-1">
                        {index === 0 ? '🟢 START' : index === coordinates.length - 1 ? '🔴 EINDE' : `📍 Punt ${index + 1}`}: {coord[0].toFixed(4)}, {coord[1].toFixed(4)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {coordinates.length === 0 && (
                <div className="text-center py-8 bg-sage-lightest/50 rounded-lg">
                  <p className="text-sage-dark text-lg mb-4">
                    {isDrawing ? 'Dubbelklik op de kaart om je eerste punt toe te voegen' : 'Klik "Start Tekenen" om te beginnen'}
                  </p>
                  <p className="text-sage text-sm">
                    De route wordt automatisch via wegen en paden getekend tussen de punten.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
