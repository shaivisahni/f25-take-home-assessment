"use client";

import { useState } from "react";
import { WeatherForm } from "@/components/weather-form";
import { CalendarDays, MapPin, StickyNote, Cloud, Droplets, Wind, Gauge, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [weatherResult, setWeatherResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResult = (data: any) => {
    setIsLoading(true);
    setTimeout(() => {
      setWeatherResult(data);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Weather Forecast System
          </h1>
          <p className="text-gray-400 text-lg mt-3 max-w-2xl mx-auto">
            Get accurate weather data for any location worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <Card className="w-full p-6 shadow-lg bg-gray-800 border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-center text-blue-300">
              Weather Request
            </h2>
            <WeatherForm onResult={handleResult} isLoading={isLoading} />
          </Card>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-2 text-center text-blue-300">
              Weather Details
            </h2>
            
            <Card className="w-full p-6 shadow-lg bg-gray-800 border-gray-700 min-h-[400px] flex items-center justify-center">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center gap-3 text-blue-400">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p>Loading weather data...</p>
                </div>
              ) : weatherResult ? (
                <div className="space-y-6 w-full">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-100">
                        {weatherResult.location}
                      </h3>
                      <p className="text-gray-400 flex items-center gap-2">
                        <CalendarDays className="size-4" />
                        {weatherResult.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-bold text-blue-400">
                        {weatherResult.weather?.temperature ?? "N/A"}°C
                      </p>
                      <p className="text-gray-300 capitalize">
                        {weatherResult.weather?.weather_descriptions?.[0] ?? "N/A"}
                      </p>
                    </div>
                  </div>

                  {weatherResult.notes && (
                    <div className="bg-blue-900/30 text-blue-200 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <StickyNote className="size-5" />
                        <h4 className="font-medium">Notes</h4>
                      </div>
                      <p className="mt-1">{weatherResult.notes}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <WeatherDetailCard 
                      icon={<Droplets className="size-5 text-blue-400" />}
                      title="Humidity"
                      value={`${weatherResult.weather?.humidity ?? "N/A"}%`}
                    />
                    <WeatherDetailCard 
                      icon={<Wind className="size-5 text-blue-400" />}
                      title="Wind Speed"
                      value={`${weatherResult.weather?.wind_speed ?? "N/A"} km/h`}
                    />
                    <WeatherDetailCard 
                      icon={<Gauge className="size-5 text-blue-400" />}
                      title="Pressure"
                      value={`${weatherResult.weather?.pressure ?? "N/A"} mb`}
                    />
                    <WeatherDetailCard 
                      icon={<Cloud className="size-5 text-blue-400" />}
                      title="Cloud Cover"
                      value={`${weatherResult.weather?.cloudcover ?? "N/A"}%`}
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-400">
                  <Cloud className="size-12 text-gray-600" />
                  <h3 className="text-xl font-medium">No Weather Data</h3>
                  <p className="max-w-xs">
                    Submit a weather request to see detailed information.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function WeatherDetailCard({ icon, title, value }: { 
  icon: React.ReactNode, 
  title: string, 
  value: string
}) {
  return (
    <div className="bg-gray-700 border-gray-600 p-4 rounded-lg border">
      <div className="flex items-center gap-2 text-gray-300">
        {icon}
        <h4 className="font-medium text-sm">{title}</h4>
      </div>
      <p className="mt-2 text-xl font-semibold text-gray-100">
        {value}
      </p>
    </div>
  );
}