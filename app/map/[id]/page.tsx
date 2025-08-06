import { notFound } from "next/navigation"
import { getRouteById } from "@/lib/auth"
import RouteMap from "@/components/route-map"

interface FullscreenMapPageProps {
  params: {
    id: string
  }
}

export default async function FullscreenMapPage({ params }: FullscreenMapPageProps) {
  const route = await getRouteById(params.id)

  if (!route) {
    notFound()
  }

  return (
    <div className="h-screen w-screen">
      <div className="h-full w-full">
        <RouteMap 
          coordinates={route.coordinates || []} 
          routeName={route.name}
          routeId={route.id}
        />
      </div>
    </div>
  )
}
