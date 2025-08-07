"use client"
import { createClient } from './supabase'

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

// Demo user credentials
const DEMO_USER = {
  username: "admin",
  password: "wandelen123",
}

// Demo routes data
const DEMO_ROUTES: Route[] = [
  {
    id: "1",
    name: "Dendervallei Wandeling",
    gehuchten: ["Centrum", "Bosstraat", "Molenveld"],
    distance: 5.2,
    muddy: true,
    description:
      "Een prachtige wandeling langs de Dender met zicht op historische molens en natuurgebieden. De route voert je door het hart van Nieuwerkerken en biedt adembenemende uitzichten op de vallei.",
    coordinates: [
      [50.9167, 4.0333],
      [50.92, 4.04],
      [50.915, 4.045],
      [50.9167, 4.0333],
    ],
    difficulty: "Gemakkelijk",
    duration: "1u 15min",
    highlights: ["Historische watermolen", "Dendervallei uitzicht", "Oude kerk van Nieuwerkerken"],
  },
  {
    id: "2",
    name: "Bospaden Route",
    gehuchten: ["Nieuwbos", "Kapelleberg"],
    distance: 3.8,
    muddy: false,
    description:
      "Een rustige boswandeling perfect voor families. Deze route neemt je mee door dichte bossen en open velden met veel mogelijkheden om wilde dieren te spotten.",
    coordinates: [
      [50.91, 4.03],
      [50.913, 4.035],
      [50.908, 4.038],
      [50.91, 4.03],
    ],
    difficulty: "Gemakkelijk",
    duration: "50min",
    highlights: ["Eeuwenoude eikenbomen", "Vogelkijkhut", "Picknickplaats"],
  },
  {
    id: "3",
    name: "Heuvelland Tocht",
    gehuchten: ["Hoogstraat", "Bergveld", "Panorama"],
    distance: 8.1,
    muddy: true,
    description:
      "Een uitdagende wandeling voor ervaren wandelaars. Deze route biedt spectaculaire panoramische uitzichten over de hele regio en voert langs verschillende historische bezienswaardigheden.",
    coordinates: [
      [50.92, 4.025],
      [50.925, 4.03],
      [50.928, 4.035],
      [50.92, 4.04],
      [50.92, 4.025],
    ],
    difficulty: "Moeilijk",
    duration: "2u 30min",
    highlights: ["Hoogste punt van Nieuwerkerken", "Kasteel ruïne", "Panoramisch uitzicht", "Historische kapel"],
  },
]

// This file is deprecated and no longer used.
// Authentication is now handled via lib/supabase.ts

export function getRoutes(): Route[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("routes")
    if (stored) {
      return JSON.parse(stored)
    } else {
      // Initialize with demo data
      localStorage.setItem("routes", JSON.stringify(DEMO_ROUTES))
      return DEMO_ROUTES
    }
  }
  return DEMO_ROUTES
}

export function getRouteById(id: string): Route | null {
  const routes = getRoutes()
  return routes.find((route) => route.id === id) || null
}

export function addRoute(route: Route): void {
  if (typeof window !== "undefined") {
    const routes = getRoutes()
    routes.push(route)
    localStorage.setItem("routes", JSON.stringify(routes))
  }
}

export function updateRoute(updatedRoute: Route): void {
  if (typeof window !== "undefined") {
    const routes = getRoutes()
    const index = routes.findIndex((route) => route.id === updatedRoute.id)
    if (index !== -1) {
      routes[index] = updatedRoute
      localStorage.setItem("routes", JSON.stringify(routes))
    }
  }
}

export function deleteRoute(id: string): void {
  if (typeof window !== "undefined") {
    const routes = getRoutes()
    const filteredRoutes = routes.filter((route) => route.id !== id)
    localStorage.setItem("routes", JSON.stringify(filteredRoutes))
  }
}
