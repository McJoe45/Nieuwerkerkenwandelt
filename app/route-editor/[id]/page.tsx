"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Save, Undo, Trash2, MapPin, ArrowLeft } from 'lucide-react'
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

export default function RouteEditorPage() {
  const params = useParams()
  const [route, setRoute] = useState<Route | null>(null)
  const [coordinates, setCoordinates] = useState<[number, number][]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [totalDistance, setTotalDistance] = useState(0)
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const routeData = getRouteById(params.id as string)
    if (routeData) {
      setRoute(routeData)
      setCoordinates(routeData.coordinates)
    }
  }, [params.id])

  const calculateDistance = (coords: [number, number][]) => {
    if (coords.length < 2) return 0
    
    let distance = 0
    for (let i = 1; i < coords.length; i++) {
      const lat1 = coords[i - 1][0]
      const lon1 = coords[i - 1][1]
      const lat2 = coords[i][0]
      const lon2 = coords[i][1]
      
      // Haversine formula for distance calculation
      const R = 6371 // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180
      const dLon = (lon2 - lon1) * Math.PI / 180
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      distance += R * c
    }
    return Math.round(distance * 10) / 10 // Round to 1 decimal
  }

  useEffect(() => {
    setTotalDistance(calculateDistance(coordinates))
  }, [coordinates])

  // Load interactive map
  useEffect(() => {
    if (!mapRef.current) return

    // Create iframe with OpenStreetMap
    const iframe = document.createElement("iframe")
    iframe.style.width = "100%"
    iframe.style.height = "600px"
    iframe.style.border = "none"
    iframe.style.borderRadius = "8px"

    // Center on Nieuwerkerken
    const centerLat = 50.9167
    const centerLng = 4.0333
    
    // Create a focused view on Nieuwerkerken area
    const bbox = `${centerLng - 0.02},${centerLat - 0.02},${centerLng + 0.02},${centerLat + 0.02}`
    iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${centerLat},${centerLng}`

    // Clear container and add iframe
    mapRef.current.innerHTML = ""
    mapRef.current.appendChild(iframe)

    // Add click simulation for drawing mode
    if (isDrawing) {
      iframe.style.cursor = 'crosshair'
      iframe.style.border = '2px solid #82AB7D'
    } else {
      iframe.style.cursor = 'default'
      iframe.style.border = 'none'
    }

  }, [isDrawing])

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

  const clearRoute = () => {
    if (confirm('Weet je zeker dat je de route wilt wissen?')) {
      setCoordinates([])
    }
  }

  const undoLastPoint = () => {
    if (coordinates.length > 0) {
      setCoordinates(coordinates.slice(0, -1))
    }
  }

  // Simulate adding a point when in drawing mode
  const addRandomPoint = () => {
    if (!isDrawing) return
    
    const baseLatitude = 50.9167
    const baseLongitude = 4.0333
    const randomLat = baseLatitude + (Math.random() - 0.5) * 0.01
    const randomLng = baseLongitude + (Math.random() - 0.5) * 0.01
    
    setCoordinates(prev => [...prev, [randomLat, randomLng]])
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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setIsDrawing(!isDrawing)}
                  className={`${isDrawing ? 'bg-red-500 hover:bg-red-600' : 'bg-sage-light hover:bg-sage-lighter'} text-white`}
                >
                  {isDrawing ? 'Stop Tekenen' : 'Start Tekenen'}
                </Button>
                {isDrawing && (
                  <Button
                    onClick={addRandomPoint}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Punt Toevoegen (Demo)
                  </Button>
                )}
                <Button
                  onClick={undoLastPoint}
                  variant="outline"
                  className="border-sage-light text-sage-dark hover:bg-sage-lightest"
                  disabled={coordinates.length === 0}
                >
                  <Undo className="w-4 h-4 mr-2" />
                  Ongedaan maken
                </Button>
                <Button
                  onClick={clearRoute}
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                  disabled={coordinates.length === 0}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Wissen
                </Button>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-sage-dark">
                  <span className="font-medium">Afstand: {totalDistance} km</span>
                  <span className="ml-4 text-sm">Punten: {coordinates.length}</span>
                </div>
                <Button
                  onClick={saveRoute}
                  className="bg-sage-light hover:bg-sage-lighter text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Opslaan
                </Button>
              </div>
            </div>
            
            <div className="bg-sage-lightest rounded-lg p-4 text-sm text-sage mb-4">
              <p className="mb-2"><strong>Instructies:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Klik op "Start Tekenen" om te beginnen</li>
                <li>Gebruik "Punt Toevoegen (Demo)" om punten toe te voegen</li>
                <li>De route wordt automatisch verbonden tussen de punten</li>
                <li>Gebruik "Ongedaan maken" om het laatste punt te verwijderen</li>
                <li>Klik "Opslaan" om de route definitief op te slaan</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Map Area */}
        <Card className="border-beige bg-white">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Map Container */}
              <div 
                ref={mapRef}
                className="h-[600px] bg-sage-lightest rounded-lg relative border border-sage-light overflow-hidden"
              />
              
              {/* Route visualization overlay */}
              {coordinates.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-sage-light">
                  <h4 className="font-semibold text-sage-dark mb-2">Route Punten ({coordinates.length}):</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm max-h-40 overflow-y-auto">
                    {coordinates.map((coord, index) => (
                      <div key={index} className="text-sage">
                        Punt {index + 1}: {coord[0].toFixed(4)}, {coord[1].toFixed(4)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {coordinates.length === 0 && (
                <div className="text-center py-8 bg-sage-lightest/50 rounded-lg">
                  <p className="text-sage-dark text-lg mb-4">
                    {isDrawing ? 'Gebruik "Punt Toevoegen (Demo)" om punten toe te voegen' : 'Klik "Start Tekenen" om te beginnen'}
                  </p>
                  <p className="text-sage text-sm">
                    De kaart toont het gebied rond Nieuwerkerken waar je routes kunt tekenen.
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
