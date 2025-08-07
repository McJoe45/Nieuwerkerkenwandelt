import { ArrowLeft } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/header"
import Image from "next/image"

const gehuchten = [
  {
    id: 1,
    name: "Centrum Nieuwerkerken",
    description: "Het historische hart van Nieuwerkerken met de kerk, het gemeentehuis en de karakteristieke dorpsplein."
  },
  {
    id: 2,
    name: "Kozen",
    description: "Een rustig gehucht ten noorden van het centrum, bekend om zijn landelijke karakter en mooie natuur."
  },
  {
    id: 3,
    name: "Binderveld",
    description: "Een van de grootste gehuchten van Nieuwerkerken, met een rijke geschiedenis en prachtige wandelpaden."
  },
  {
    id: 4,
    name: "Wijer",
    description: "Klein maar charmant gehucht met traditionele Vlaamse architectuur en groene omgeving."
  },
  {
    id: 5,
    name: "Duras",
    description: "Gelegen in het hart van de gemeente, bekend om zijn vredige sfeer en mooie landschappen."
  },
  {
    id: 6,
    name: "Neerlinter",
    description: "Het zuidelijke gehucht van Nieuwerkerken, omgeven door velden en natuurgebieden."
  },
  {
    id: 7,
    name: "Overhespen",
    description: "Een pittoresk gehucht in het westen, perfect voor rustige wandelingen door de natuur."
  },
  {
    id: 8,
    name: "Nederhespen",
    description: "Gelegen naast Overhespen, bekend om zijn landelijke charme en traditionele boerderijen."
  },
  {
    id: 9,
    name: "Roosbeek",
    description: "Het noordwestelijke gehucht, omgeven door groene weiden en kleine bosjes."
  },
  {
    id: 10,
    name: "Neerwinden",
    description: "Historisch belangrijk gehucht in het noordoosten, met interessante verhalen uit het verleden."
  },
  {
    id: 11,
    name: "Oplinter",
    description: "Een gehucht in het zuidwesten, bekend om zijn rustige straten en vriendelijke gemeenschap."
  },
  {
    id: 12,
    name: "Wommersom",
    description: "Gelegen in het oosten van de gemeente, omgeven door landbouwgronden en natuurgebieden."
  },
  {
    id: 13,
    name: "Attenhoven",
    description: "Een centraal gelegen gehucht met een mix van moderne voorzieningen en traditionele charme."
  },
  {
    id: 14,
    name: "Drieslinter",
    description: "Het oostelijke gehucht, bekend om zijn mooie uitzichten en wandelmogelijkheden."
  },
  {
    id: 15,
    name: "Linter",
    description: "Het zuidoostelijke gehucht, rijk aan geschiedenis en omgeven door prachtige natuur."
  }
]

export default function OverNieuwerkerkenPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="container mx-auto px-6 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="border-sage-light text-sage hover:bg-sage-light hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug naar overzicht
            </Button>
          </Link>
        </div>

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-sage-dark mb-6 tracking-wide leading-tight title-font">
            Over Nieuwerkerken
            <br />
            <span className="bg-gradient-to-r from-sage-light to-sage-lighter bg-clip-text text-transparent">
              en de gehuchten
            </span>
          </h1>
        </div>

        {/* Map Image */}
        <div className="mb-16 flex justify-center">
          <div className="relative w-full max-w-4xl">
            <Image
              src="/images/nieuwerkerken-gehuchten-map.jpg"
              alt="Kaart van Nieuwerkerken met alle gehuchten"
              width={800}
              height={600}
              className="rounded-xl shadow-lg border-2 border-beige"
            />
          </div>
        </div>

        {/* Gehuchten Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gehuchten.map((gehucht) => (
            <Card key={gehucht.id} className="border-2 border-beige bg-white shadow-sm hover:shadow-lg transition-all duration-300">
              <CardHeader className="relative">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-sage-light rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-lg">{gehucht.id}</span>
                  </div>
                  <div>
                    <CardTitle className="text-sage-dark text-lg title-font">
                      {gehucht.name}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sage text-sm leading-relaxed font-light">
                  {gehucht.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
