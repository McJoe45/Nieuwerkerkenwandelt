import { ArrowLeft } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/header"
import Image from "next/image"

const gehuchten = [
  {
    id: 1,
    name: "Rijdent",
    description: "Wie via de Rijdentstraat richting Edixvelde wandelt, steekt eerst de spoorlijn Oostende-Brussel over via een kleine brug. Daar, te midden van het groen, bevind je je in het hart van Rijdent. Tussen de boomkruinen door duikt in de verte nog net de stompe toren van de dorpskerk op.",
    image: "/images/gehuchten/rijdent-landmark.png"
  },
  {
    id: 2,
    name: "Siesegemkouter",
    description: "Een open vlakte, badend in rust. Al jaren lonkt de stad naar deze plek om te bouwen, maar wie van de Keizerstraat doorsteekt naar Aalst, begrijpt meteen wat hier echt thuishoort: stilte, groen en lucht. De Siesegemkouter is geen niemandsland, maar ieders landschap.",
    image: "/images/gehuchten/siesegemkouter-landmark.png"
  },
  {
    id: 3,
    name: "Laar",
    description: "'Laar' – een geliefd woord onder puzzelaars. Centraal ligt de opvallende modernistische Sint-Rochuskapel, compleet met vlaggenstok en klok. Een klein monument, wat vervallen, maar fier in zijn eenvoud.",
    image: "/images/gehuchten/laar-landmark.png"
  },
  {
    id: 4,
    name: "Kleinderbeek",
    description: "Een vergeten stukje tussen dorp en snelweg. De straat Kleinderbeek houdt de naam levend. In het noorden, goed weggestopt, ligt het kerkhof.",
    image: "/images/gehuchten/kleinderbeek-landmark.png"
  },
  {
    id: 5,
    name: "Dorp",
    description: "Niet het centrum, maar wel het hart. Zelfs de straat heet hier 'Nieuwerkerken Dorp'. Onder het waakzame oog van de Onze-Lieve-Vrouw-Hemelvaartkerk vindt elke woensdagvoormiddag nog een markt plaats.",
    image: "/images/gehuchten/dorp-landmark.png"
  },
  {
    id: 6,
    name: "Kraaiwinkel",
    description: "Groen, uitgestrekt, en gedeeld met Haaltert. Hier slingeren wandelwegen tussen bossen en velden. De Kraaiwinkel is het grootste natuurgebied van Nieuwerkerken – een plek waar stilte nog klinkt.",
    image: "/images/gehuchten/kraaiwinkel-landmark.png"
  },
  {
    id: 7,
    name: "Bremt",
    description: "Langgerekt en licht glooiend, van de brug naar Mere tot diep in de Huystraat. Hier tref je veel groen én het hoogste punt van Nieuwerkerken – ergens rond huisnummer 2 van de Bremtstraat.",
    image: "/images/gehuchten/bremt-landmark.png"
  },
  {
    id: 8,
    name: "Edixvelde",
    description: "Het meest zelfstandige gehucht, met een eigen kern, een kleuterschool en de markante Sint-Jozefskerk uit 1960. De losstaande klokkentoren maakt het plaatje compleet.",
    image: "/images/gehuchten/edixvelde-landmark.png"
  },
  {
    id: 9,
    name: "Maal",
    description: "Ruim en groen. Maal verbindt je met de Siesegemkouter en de Erpekouter. In het midden van het gehucht staat de Sint-Annakapel. En een bushalte.",
    image: "/images/gehuchten/maal-landmark.png"
  },
  {
    id: 10,
    name: "Regelsbrugge",
    description: "Hier ligt de grens met Aalst, bewaakt door het domein van kasteel Regelsbrugge. Ook de Odisee Hogeschool staat nog net op Nieuwerkerks grondgebied. Aan het einde van de dreef, bij het sluisje, stoppen de kasseien. De betonweg is Aalst – alles ervoor is van ons.",
    image: "/images/gehuchten/regelsbrugge-landmark.png"
  },
  {
    id: 11,
    name: "Berg",
    description: "Een naam die zichzelf bewijst. Via de Bergstraat klim je richting station van Ede. In het Spechtgat – de Spechtmeerstraat – loop je van Berg naar Bremt, waar hellingen en vergezichten elkaar afwisselen.",
    image: "/images/gehuchten/berg-landmark.png"
  },
  {
    id: 12,
    name: "Zurendries",
    description: "Wie de brug over de E40 oversteekt richting Aalst, komt op de Zurendries. Een weg met vaart, tot aan het Siesegemkruispunt. Hier staat geen kapel, maar wel het legendarische café Pros – beroemd geworden in de film De Helaasheid der Dingen.",
    image: "/images/gehuchten/zurendries-landmark.jpg" // Updated to use the provided image
  },
  {
    id: 13,
    name: "Restert",
    description: "Dicht bij het centrum en inmiddels stevig bebouwd. Maar wie doorloopt tot Restert 10, ontdekt een imposant hof met wortels in de 18e eeuw. Een stukje geschiedenis in een modern jasje.",
    image: "/images/gehuchten/restert-landmark.png"
  },
  {
    id: 14,
    name: "Hoezekouter",
    description: "Misschien wel het minst betreden gehucht. Vroeger een open vlakte, nu met een reusachtige windmolen als baken. Voor velen een reden om om te keren, maar wie zoekt via nog wel het mooie voetpad naar de Restert.",
    image: "/images/gehuchten/hoezekouter-landmark.png"
  },
  {
    id: 15,
    name: "Dries",
    description: "De uitvalsweg naar Terjoden slingert via Dries. In de laatste bocht ligt de Mandjesvijver – het enige publiek toegankelijke plas water van Nieuwerkerken. Pootje baden is af te raden, maar de plek nodigt uit tot stilstand.",
    image: "/images/gehuchten/dries-landmark.png"
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
            <Card key={gehucht.id} className="border-2 border-beige bg-white shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
              {gehucht.image && (
                <div className="relative w-full h-24">
                  <Image
                    src={gehucht.image || "/placeholder.svg"}
                    alt={`Landmark in ${gehucht.name}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-t-xl"
                  />
                </div>
              )}
              <CardHeader className="relative p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-sage-light rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                    <span className="text-white font-bold text-lg">{gehucht.id}</span>
                  </div>
                  <div>
                    <CardTitle className="text-sage-dark text-lg title-font">
                      {gehucht.name}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-0">
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
