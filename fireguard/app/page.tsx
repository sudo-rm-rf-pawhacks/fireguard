import { WildfirePrediction } from "@/components/wildfire-prediction"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-orange-900 md:text-4xl">FireGuard</h1>
          <p className="text-orange-700">Enter your zip code to get a prediction of wildfire risk in your area</p>
        </header>
        <WildfirePrediction />
      </div>
    </main>
  )
}

