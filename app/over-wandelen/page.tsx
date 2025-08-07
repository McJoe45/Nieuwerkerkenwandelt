import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Header from '@/components/header'
import { ArrowLeft } from 'lucide-react'

export default function OverWandelenPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-sage-dark mb-6 tracking-wide leading-tight title-font">
            Over wandelen in Nieuwerkerken
          </h1>
          <p className="text-lg sm:text-xl text-sage max-w-2xl mx-auto leading-relaxed font-light">
            Ontdek de charme van wandelen door de groene landschappen en pittoreske gehuchten van Nieuwerkerken.
          </p>
        </div>

        <div className="mb-12 flex justify-center">
          <Image
            src="/placeholder.svg?height=400&width=600"
            alt="Wandelen in Nieuwerkerken"
            width={600}
            height={400}
            className="rounded-lg shadow-lg border-2 border-beige"
            priority
          />
        </div>

        <div className="max-w-3xl mx-auto text-sage text-lg leading-relaxed text-center">
          <p className="mb-4">
            Nieuwerkerken biedt een verscheidenheid aan wandelroutes die geschikt zijn voor elk niveau. Van korte, gemakkelijke wandelingen door het dorp tot langere, uitdagende tochten door de velden en bossen. Onze routes zijn zorgvuldig samengesteld door lokale wandelaars, zodat je de mooiste plekjes en verborgen paden kunt ontdekken.
          </p>
          <p className="mb-4">
            Geniet van de rust en de natuur, adem de frisse lucht in en laat je verrassen door de landschappelijke schoonheid. Of je nu op zoek bent naar een ontspannende wandeling met het gezin of een sportieve uitdaging, Nieuwerkerken heeft voor ieder wat wils. Vergeet niet je wandelschoenen aan te trekken en je camera mee te nemen!
          </p>
          <p>
            We werken continu aan het toevoegen van nieuwe routes en het verbeteren van de bestaande. Kom regelmatig terug om de nieuwste ontdekkingen te zien en deel je eigen ervaringen met de gemeenschap. Veel wandelplezier!
          </p>
        </div>

        <div className="text-center mt-12">
          <Link href="/" passHref>
            <Button className="bg-sage hover:bg-sage-dark text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-300 text-base">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Terug naar overzicht
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
