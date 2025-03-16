"use client"

import type React from "react"

import { useState } from "react"
import { Flame, AlertTriangle, Info, Plus, X, Thermometer, Droplets, Wind, CloudRain, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RiskMeter } from "./risk-meter"

// This is a mock prediction function
// In a real application, this would connect to an API or ML model
async function predictWildfireRisk(zipCode: string): Promise<PredictionResult | null> {
  const response = await fetch(`/api/test?num=${zipCode}`)
  const res = await response.json()

  return res.data
}

type PredictionResult = {
  riskDescription: string
  riskNumber: number
  zipCode: string

  temperature: string
  humidity: string
  precipitation: string
  wind: string

  locationInfo: {
    city: string
    state: string
  }
}

export function WildfirePrediction() {
  const [zipCode, setZipCode] = useState("")
  const [predictions, setPredictions] = useState<PredictionResult[]>([])
  const [loadingZipCode, setLoadingZipCode] = useState<string | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!zipCode.match(/^\d{5}$/)) {
      setError("Please enter a valid 5-digit zip code")
      return
    }

    // Check if this zip code is already in the predictions
    if (predictions.some((p) => p.zipCode === zipCode)) {
      setError("This zip code has already been added")
      return
    }

    setError("")
    setLoadingZipCode(zipCode)

    try {
      const risk: PredictionResult | null = await predictWildfireRisk(zipCode)

      if (risk === null) {
        setError("Failed to get prediction. Please try again.")
        return
      }

      console.log(risk)

      setPredictions((prev) => [...prev, risk])
      setZipCode("") // Clear the input for the next entry
    } catch (err) {
      setError("Failed to get prediction. Please try again.")
      console.error(err)
    } finally {
      setLoadingZipCode(null)
    }
  }

  const removePrediction = (zipCodeToRemove: string) => {
    setPredictions((prev) => prev.filter((p) => p.zipCode !== zipCodeToRemove))
  }

  const isLoading = loadingZipCode !== null

  // Function to extract and highlight key data points from the description
  const formatDescription = (prediction: PredictionResult) => {
    // Extract key data points (this is a simplified extraction - in a real app you'd use more robust parsing)
    const tempMatch = prediction.temperature
    const humidityMatch = prediction.humidity
    const windMatch = prediction.wind
    const precipitation = prediction.precipitation

    return (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed">{prediction.riskDescription}</p>

        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {
            <div className="flex items-center gap-2 rounded-md bg-blue-100/50 p-2">
              <Thermometer className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-xs font-medium text-blue-900">Temperature</p>
                <p className="text-sm font-bold text-blue-700">{tempMatch ? tempMatch + "°" : "High"}</p>
              </div>
            </div>
          }

          {
            <div className="flex items-center gap-2 rounded-md bg-blue-100/50 p-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-xs font-medium text-blue-900">Humidity</p>
                <p className="text-sm font-bold text-blue-700">{humidityMatch ? humidityMatch + "%" : "Low"}</p>
              </div>
            </div>
          }

          {
            <div className="flex items-center gap-2 rounded-md bg-blue-100/50 p-2">
              <CloudRain className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-xs font-medium text-blue-900">Precipitation</p>
                <p className="text-sm font-bold text-blue-700">{precipitation ? precipitation + "mm" : "None"}</p>
              </div>
            </div>
          }

          {
            <div className="flex items-center gap-2 rounded-md bg-blue-100/50 p-2">
              <Wind className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-xs font-medium text-blue-900">Wind</p>
                <p className="text-sm font-bold text-blue-700">{windMatch ? windMatch : "Moderate"}</p>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Check Your Areas</CardTitle>
          <CardDescription>Enter zip codes to get wildfire risk assessments for multiple locations</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <div className="flex max-w-xs gap-2">
                <Input
                  id="zipCode"
                  placeholder="Enter 5-digit zip code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  maxLength={5}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading} className="bg-orange-600 hover:bg-orange-700 flex-shrink-0">
                  {isLoading ? "Adding..." : <Plus className="h-4 w-4" />}
                </Button>
              </div>
              {error && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  {error}
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {predictions.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-orange-900">Wildfire Risk Assessments ({predictions.length})</h2>

          {predictions.map((prediction) => (
            <Card key={prediction.zipCode} className="border-orange-200 bg-orange-50 relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 h-8 w-8 p-0 text-orange-700 hover:bg-orange-200 hover:text-orange-900"
                onClick={() => removePrediction(prediction.zipCode)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>

              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-600" />
                  Zip Code: {prediction.zipCode}
                </CardTitle>
                <div className="flex items-center gap-1 mt-1 text-sm text-orange-700">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {prediction.locationInfo.city}, {prediction.locationInfo.state}
                  </span>
                </div>
                <CardDescription className="mt-2">
                  Based on historical data, climate patterns, and geographical factors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-orange-600">{prediction.riskNumber}% Risk</p>
                  <p className="text-sm text-orange-700">Chance of wildfire in the next month</p>
                </div>

                <RiskMeter value={prediction.riskNumber} />

                <div className="space-y-3">
                  <div className="rounded-lg bg-orange-100 p-4 text-orange-800">
                    <div className="flex items-start gap-2">
                      <Info className="mt-0.5 h-5 w-5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">What this means:</p>
                        <p className="text-sm">
                          {prediction.riskNumber < 20
                            ? "Low risk. Standard precautions recommended."
                            : prediction.riskNumber < 50
                              ? "Moderate risk. Be prepared and stay informed about fire conditions."
                              : prediction.riskNumber < 75
                                ? "High risk. Create a defensible space around your property and have an evacuation plan."
                                : "Very high risk. Take immediate precautions and be ready to evacuate if necessary."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-blue-50 p-4 text-blue-800 border border-blue-100">
                    <div className="flex items-start gap-2">
                      <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                      <div className="w-full">
                        <p className="font-medium mb-2">Weather Analysis:</p>
                        {formatDescription(prediction)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-orange-600">
                <p>
                  This prediction is based on a simulation and should not be used as the sole basis for safety
                  decisions.
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {predictions.length === 0 && (
        <div className="rounded-lg border border-dashed border-orange-300 bg-orange-50 p-8 text-center">
          <Flame className="mx-auto h-12 w-12 text-orange-300" />
          <h3 className="mt-2 text-lg font-medium text-orange-900">No predictions yet</h3>
          <p className="mt-1 text-sm text-orange-700">Add zip codes above to see wildfire risk assessments</p>
        </div>
      )}
    </div>
  )
}

