import { Suspense } from "react"
import Header from "@/components/header"
import { getAllRoutes } from "@/lib/auth"
import Link from "next/link"
import { MapPin, Clock, Route } from 'lucide-react'

async function RoutesList() {
  const routes = await getAllRoutes()

  if (routes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sage-dark text-lg">Geen routes gevonden.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {routes.map((route) => (
        <Link key={route.id} href={`/route/${route.id}`}>
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-sage-light/20">
            <div className="flex items-start space-x-3 mb-4">
              <div className="bg-sage-light rounded-full p-2 flex-shrink-0">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-sage-dark mb-1 truncate">
                  {route.name}
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {route.gehuchten && route.gehuchten.length > 0 && route.gehuchten.map((gehucht, index) => (
                    <span
                      key={index}
                      className="inline-block bg-sage-lightest text-sage-dark text-xs px-2 py-1 rounded-full"
                    >
                      {gehucht}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-sage mb-4">
              <div className="flex items-center space-x-1">
                <Route className="w-4 h-4" />
                <span>{route.distance}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{route.duration}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full border border-green-200">
                {route.difficulty}
              </span>
            </div>

            <p className="text-sage-dark text-sm line-clamp-3">
              {route.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-sage-lightest">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sage-lightest to-sage-light/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-sage-dark mb-4 leading-tight">
            De mooiste wandelingen<br />
            <span className="text-sage">in en om Nieuwerkerken</span>
          </h1>
          <p className="text-xl text-sage-dark/80 max-w-2xl mx-auto">
            Ontdek de routes die door echte lokale wandelaars werden samengesteld.
          </p>
        </div>
      </section>

      {/* Routes Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Suspense fallback={
            <div className="text-center py-12">
              <p className="text-sage-dark text-lg">Routes worden geladen...</p>
            </div>
          }>
            <RoutesList />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
