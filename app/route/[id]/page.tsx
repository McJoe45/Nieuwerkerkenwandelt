import { notFound } from "next/navigation"
import Header from "@/components/header"
import RouteMap from "@/components/route-map"
import { getRouteById } from "@/lib/auth"
import { MapPin, Clock, Route } from 'lucide-react'

interface RouteDetailPageProps {
  params: {
    id: string
  }
}

export default async function RouteDetailPage({ params }: RouteDetailPageProps) {
  const route = await getRouteById(params.id)

  if (!route) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-sage-lightest">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Route Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-3 mb-6">
              <div className="bg-sage-light rounded-full p-2 flex-shrink-0">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-sage-dark mb-3">
                  {route.name}
                </h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {route.gehuchten && route.gehuchten.length > 0 && route.gehuchten.map((gehucht, index) => (
                    <span
                      key={index}
                      className="inline-block bg-sage-lightest text-sage-dark text-sm px-3 py-1 rounded-full"
                    >
                      {gehucht}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sage mb-6">
              <div className="flex items-center space-x-2">
                <Route className="w-5 h-5" />
                <span className="font-medium">{route.distance}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span className="font-medium">{route.duration}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full border border-green-200">
                Gemakkelijk
              </span>
              <span className="inline-block bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full border border-orange-200">
                {route.difficulty}
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-sage-dark mb-3">Beschrijving</h2>
                <p className="text-sage-dark leading-relaxed">
                  {route.description}
                </p>
              </div>

              {route.highlights && route.highlights.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-sage-dark mb-3">Hoogtepunten</h2>
                  <ul className="space-y-2">
                    {route.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-sage-light mt-1">•</span>
                        <span className="text-sage-dark">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Route Map */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-sage-dark mb-4">Route Kaart</h2>
            <RouteMap 
              coordinates={route.coordinates || []} 
              routeName={route.name}
              routeId={route.id}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
