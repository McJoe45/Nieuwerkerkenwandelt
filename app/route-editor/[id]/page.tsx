"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Save, Trash2, MapPin, Play, Square } from 'lucide-react'
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
  const [waypoints, setWaypoints] = useState<[number, number][]>([])
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([])
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
      if (routeData.coordinates && routeData.coordinates.length > 0) {
        setRouteCoordinates(routeData.coordinates)
        const coords = routeData.coordinates
        if (coords.length >= 2) {
          setWaypoints([coords[0], coords[coords.length - 1]])
        }
      }
    }
  }, [params.id])

  // Load Leaflet and Routing Machine scripts
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
          const routingCSS = document.createElement('link')
          routingCSS.rel = 'stylesheet'
          routingCSS.href = 'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css'
          document.head.appendChild(routingCSS)

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
    const map = L.map(mapRef.current).setView([50.9167, 4.0333], 15)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    mapInstanceRef.current = map

    if (routeCoordinates.length > 0) {
      displayExistingRoute(routeCoordinates)
    } else if (waypoints.length > 0) {
      updateRouteOnMap(waypoints)
    }

  }, [scriptsLoaded, routeCoordinates])

  const displayExistingRoute = (coords: [number, number][]) => {
    if (!mapInstanceRef.current || !window.L || coords.length === 0) return

    const L = window.L

    mapInstanceRef.current.eachLayer((layer: any) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        mapInstanceRef.current.removeLayer(layer)
      }
    })

    const polyline = L.polyline(coords, {
      color: 'red',
      weight: 4,
      opacity: 0.8
    }).addTo(mapInstanceRef.current)

    if (coords.length >= 2) {
      L.marker([coords[0][0], coords[0][1]], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: '<div style="background-color: green; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">START</div>',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        })
      }).addTo(mapInstanceRef.current)

      L.marker([coords[coords.length - 1][0], coords[coords.length - 1][1]], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: '<div style="background-color: red; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">EINDE</div>',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        })
      }).addTo(mapInstanceRef.current)

      mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [20, 20] })
    }

    let distance = 0
    for (let i = 1; i < coords.length; i++) {
      const lat1 = coords[i - 1][0]
      const lon1 = coords[i - 1][1]
      const lat2 = coords[i][0]
      const lon2 = coords[i][1]
      
      const R = 6371
      const dLat = (lat2 - lat1) * Math.PI / 180
      const dLon = (lon2 - lon1) * Math.PI / 180
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      distance += R * c
    }
    setTotalDistance(Math.round(distance * 10) / 10)
  }

  const updateRouteOnMap = (waypointList: [number, number][]) => {
    if (!mapInstanceRef.current || !window.L) return

  const L = window.L

  if (routingControlRef.current) {
    mapInstanceRef.current.removeControl(routingControlRef.current)
  }

  mapInstanceRef.current.eachLayer((layer: any) => {
    if (layer instanceof L.Marker || layer instanceof L.Polyline) {
      mapInstanceRef.current.removeLayer(layer)
    }
  })

  if (waypointList.length >= 2) {
    // For walking routes, use a more direct approach
    // Try multiple routing options and use the shortest one
    
    const routingControl = L.Routing.control({
      waypoints: waypointList.map(coord => L.latLng(coord[0], coord[1])),
      routeWhileDragging: false,
      addWaypoints: false,
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        profile: 'foot', // Use foot profile
        polylinePrecision: 5,
        useHints: false,
        suppressDemoServerWarning: true,
        timeout: 15 * 1000, // Shorter timeout
        // More direct routing options
        overview: 'full',
        geometries: 'geojson',
        steps: false,
        alternatives: true, // Get alternatives and pick shortest
        continue_straight: false, // Allow turns
        annotations: false
      }),
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
      show: false,
      collapsible: false,
      fitSelectedRoutes: true
    }).on('routesfound', function(e: any) {
      const routes = e.routes
      
      // Pick the shortest route from alternatives
      let shortestRoute = routes[0]
      for (let route of routes) {
        if (route.summary.totalDistance < shortestRoute.summary.totalDistance) {
          shortestRoute = route
        }
      }
      
      const summary = shortestRoute.summary
      const distanceKm = Math.round(summary.totalDistance / 100) / 10
      setTotalDistance(distanceKm)
      
      const detailedCoords = shortestRoute.coordinates.map((coord: any) => [coord.lat, coord.lng])
      setRouteCoordinates(detailedCoords)
      
      console.log('Route found:', {
        waypoints: waypointList.length,
        detailedCoords: detailedCoords.length,
        distance: distanceKm,
        alternatives: routes.length
      })
    }).on('routingerror', function(e: any) {
      console.error('OSRM routing failed, trying direct interpolation:', e)
      
      // Fallback: Create a more intelligent interpolated route
      const interpolatedRoute = createInterpolatedRoute(waypointList)
      
      const polyline = L.polyline(interpolatedRoute, {
        color: 'orange',
        weight: 4,
        opacity: 0.8,
        dashArray: '5, 5'
      }).addTo(mapInstanceRef.current)
      
      setRouteCoordinates(interpolatedRoute)
      
      // Calculate distance
      let distance = 0
      for (let i = 1; i < interpolatedRoute.length; i++) {
        const lat1 = interpolatedRoute[i - 1][0]
        const lon1 = interpolatedRoute[i - 1][1]
        const lat2 = interpolatedRoute[i][0]
        const lon2 = interpolatedRoute[i][1]
        
        const R = 6371
        const dLat = (lat2 - lat1) * Math.PI / 180
        const dLon = (lon2 - lon1) * Math.PI / 180
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
        distance += R * c
      }
      setTotalDistance(Math.round(distance * 10) / 10)
      
      console.log('Using interpolated route with', interpolatedRoute.length, 'points')
    }).addTo(mapInstanceRef.current)

    routingControlRef.current = routingControl
  } else if (waypointList.length === 1) {
    L.marker([waypointList[0][0], waypointList[0][1]], {
      icon: L.divIcon({
        className: 'custom-marker',
        html: '<div style="background-color: green; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">START</div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      })
    }).addTo(mapInstanceRef.current)
  }
}

// Helper function to create a more intelligent interpolated route
const createInterpolatedRoute = (waypoints: [number, number][]): [number, number][] => {
  if (waypoints.length < 2) return waypoints
  
  const interpolatedPoints: [number, number][] = []
  
  for (let i = 0; i < waypoints.length - 1; i++) {
    const start = waypoints[i]
    const end = waypoints[i + 1]
    
    interpolatedPoints.push(start)
    
    // Calculate distance between points
    const lat1 = start[0] * Math.PI / 180
    const lon1 = start[1] * Math.PI / 180
    const lat2 = end[0] * Math.PI / 180
    const lon2 = end[1] * Math.PI / 180
    
    const dLat = lat2 - lat1
    const dLon = lon2 - lon1
    
    const distance = Math.sqrt(dLat * dLat + dLon * dLon)
    
    // Add intermediate points for longer segments (more than ~100m)
    if (distance > 0.001) {
      const steps = Math.max(2, Math.floor(distance / 0.0005)) // More points for longer distances
      
      for (let step = 1; step < steps; step++) {
        const ratio = step / steps
        const interpLat = start[0] + (end[0] - start[0]) * ratio
        const interpLon = start[1] + (end[1] - start[1]) * ratio
        interpolatedPoints.push([interpLat, interpLon])
      }
    }
  }
  
  // Add the final point
  interpolatedPoints.push(waypoints[waypoints.length - 1])
  
  return interpolatedPoints
}

  // Handle map clicks when drawing
  useEffect(() => {
    if (!mapInstanceRef.current || !isDrawing) return

    const handleMapClick = (e: any) => {
      const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng]
      const newWaypoints = [...waypoints, newPoint]
      setWaypoints(newWaypoints)
      updateRouteOnMap(newWaypoints)
    }

    mapInstanceRef.current.on('dblclick', handleMapClick)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off('dblclick', handleMapClick)
      }
    }
  }, [isDrawing, waypoints])

  const startDrawing = () => {
    setIsDrawing(true)
    setWaypoints([])
    setRouteCoordinates([])
    setTotalDistance(0)
    if (mapInstanceRef.current) {
      mapInstanceRef.current.getContainer().style.cursor = 'crosshair'
      if (routingControlRef.current) {
        mapInstanceRef.current.removeControl(routingControlRef.current)
        routingControlRef.current = null
      }
      mapInstanceRef.current.eachLayer((layer: any) => {
        if (layer instanceof window.L.Marker || layer instanceof window.L.Polyline) {
          mapInstanceRef.current.removeLayer(layer)
        }
      })
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    if (mapInstanceRef.current) {
      mapInstanceRef.current.getContainer().style.cursor = ''
    }
  }

  const removeLastPoint = () => {
    if (waypoints.length > 0) {
      const newWaypoints = waypoints.slice(0, -1)
      setWaypoints(newWaypoints)
      updateRouteOnMap(newWaypoints)
    }
  }

  const clearRoute = () => {
    if (confirm('Weet je zeker dat je de hele route wilt wissen?')) {
      setWaypoints([])
      setRouteCoordinates([])
      setTotalDistance(0)
      if (routingControlRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeControl(routingControlRef.current)
        routingControlRef.current = null
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.eachLayer((layer: any) => {
          if (layer instanceof window.L.Marker || layer instanceof window.L.Polyline) {
            mapInstanceRef.current.removeLayer(layer)
          }
        })
      }
    }
  }

  const saveAndClose = () => {
    if (!route || routeCoordinates.length === 0) {
      alert('Er is geen route om op te slaan!')
      return
    }
    
    const updatedRoute = {
      ...route,
      coordinates: routeCoordinates,
      distance: totalDistance
    }
    
    console.log('Saving route:', {
      id: updatedRoute.id,
      coordinatesCount: updatedRoute.coordinates.length,
      distance: updatedRoute.distance
    })
    
    // Save to localStorage immediately
    updateRoute(updatedRoute)
    
    // Force a storage event to notify other windows
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'routes',
      newValue: localStorage.getItem('routes')
    }))
    
    // Notify parent window with more detailed data
    if (window.opener) {
      window.opener.postMessage({
        type: 'ROUTE_UPDATED',
        routeId: route.id,
        coordinates: routeCoordinates,
        distance: totalDistance,
        route: updatedRoute
      }, '*')
    }
    
    alert('Route opgeslagen!')
    window.close()
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
                    <Play className="w-4 h-4 mr-2" />
                    Nieuwe Route Tekenen
                  </Button>
                ) : (
                  <Button
                    onClick={stopDrawing}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Stop Tekenen
                  </Button>
                )}
                
                <Button
                  onClick={removeLastPoint}
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-50"
                  disabled={waypoints.length === 0}
                >
                  Laatste Punt Wissen
                </Button>
                
                <Button
                  onClick={clearRoute}
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                  disabled={waypoints.length === 0 && routeCoordinates.length === 0}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Alles Wissen
                </Button>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-sage-dark text-sm">
                  <span className="font-medium">Afstand: {totalDistance} km</span>
                  <span className="ml-4">Punten: {waypoints.length}</span>
                </div>
                <Button
                  onClick={saveAndClose}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={routeCoordinates.length === 0}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Opslaan & Sluiten
                </Button>
              </div>
            </div>
            
            {isDrawing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 mb-4">
                <p className="font-medium mb-2">🎯 Teken Modus Actief</p>
                <p><strong>Dubbelklik</strong> op de kaart om punten toe te voegen. Probeer punten dicht bij wegen te plaatsen.</p>
                <p>Als routing niet lukt, wordt een rechte lijn getoond (oranje stippellijn).</p>
              </div>
            )}

            {!scriptsLoaded && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 mb-4">
                <p>Kaart wordt geladen...</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-beige bg-white">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div 
                ref={mapRef}
                className="h-[600px] bg-sage-lightest rounded-lg border border-sage-light"
                style={{ minHeight: '600px' }}
              />
              
              {waypoints.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-sage-light">
                  <h4 className="font-semibold text-sage-dark mb-2">Waypoints ({waypoints.length}):</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm max-h-40 overflow-y-auto">
                    {waypoints.map((coord, index) => (
                      <div key={index} className="text-sage bg-sage-lightest rounded px-2 py-1">
                        {index === 0 ? '🟢 START' : index === waypoints.length - 1 ? '🔴 EINDE' : `📍 Punt ${index + 1}`}: {coord[0].toFixed(4)}, {coord[1].toFixed(4)}
                      </div>
                    ))}
                  </div>
                  {routeCoordinates.length > 0 && (
                    <p className="text-xs text-sage mt-2">Route bevat {routeCoordinates.length} gedetailleerde punten</p>
                  )}
                </div>
              )}

              {routeCoordinates.length > 0 && waypoints.length === 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
                  <p className="font-medium mb-2">✅ Bestaande Route Geladen</p>
                  <p>Route bevat {routeCoordinates.length} punten over {totalDistance} km</p>
                  <p>Klik "Nieuwe Route Tekenen" om een nieuwe route te maken.</p>
                </div>
              )}

              {waypoints.length === 0 && routeCoordinates.length === 0 && (
                <div className="text-center py-8 bg-sage-lightest/50 rounded-lg">
                  <p className="text-sage-dark text-lg mb-4">
                    {isDrawing ? 'Dubbelklik op de kaart om je eerste punt toe te voegen' : 'Klik "Nieuwe Route Tekenen" om te beginnen'}
                  </p>
                  <p className="text-sage text-sm">
                    Plaats punten dicht bij wegen voor de beste routing resultaten.
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
