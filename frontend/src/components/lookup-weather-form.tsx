"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface WeatherFormData {
    id: string;
}

export function LookupWeatherForm() {
  const [formData, setFormData] = useState<WeatherFormData>({
    id: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    weather_data?: Record<string, any>;
  } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = e.target;
    setFormData(prev => ({...prev, id: value}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await fetch(`http://localhost:8000/weather/${formData.id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResult({
          success: true,
          message: "Weather request submitted successfully!",
          weather_data: data,
        });
        // Reset form after successful submission
        setFormData({
          id: ""
        });
      } else {
        const errorData = await response.json();
        setResult({
          success: false,
          message: errorData.detail || "Failed to submit weather lookup request",
        });
      }
    } catch {
      setResult({
        success: false,
        message: "Network error: Could not connect to the server",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const WeatherCard = ({ title, value, icon, color }: { 
    title: string; 
    value: string; 
    icon: string; 
    color: string;
  }) => (
    <div className="p-3 bg-gray-800/30 rounded-lg">
      <p className={`text-sm font-semibold ${color}`}>{icon} {title}</p>
      <p>{value}</p>
    </div>
  );

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Lookup Weather Data Request</CardTitle>
        <CardDescription>
          Submit an ID to retrieve stored weather data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="id" className="px-1">
              ID
            </Label>
            <Input
              id="id"
              name="id"
              type="text"
              placeholder="e.g., 0, 12, 15"
              value={formData.id}
              onChange={handleInputChange}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Weather Lookup"}
          </Button>

          {result && (
            <div
              className={`p-3 rounded-md ${
                result.success
                  ? "bg-green-900/20 text-green-500 border border-green-500"
                  : "bg-red-900/20 text-red-500 border border-red-500"
              }`}
            >
              <p className="text-sm font-medium">{result.message}</p>
              {result.success && result.weather_data && (
                <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-white">{result.weather_data.location?.name}</h3>
                        <p className="text-gray-400">
                        {result.weather_data.location?.region}, {result.weather_data.location?.country}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-400">
                        {result.weather_data.location?.localtime}
                        </p>
                        <p className="text-sm text-gray-400">
                        {result.weather_data.current?.observation_time}
                        </p>
                    </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-lg">
                    <div className="flex items-center">
                        <img 
                        src={result.weather_data.current?.weather_icons?.[0]} 
                        alt={result.weather_data.current?.weather_descriptions?.[0]}
                        className="w-16 h-16"
                        />
                        <div className="ml-3">
                        <p className="text-xl font-semibold">
                            {result.weather_data.current?.weather_descriptions?.[0]}
                        </p>
                        <p className="text-gray-300 text-sm">
                            Feels like {result.weather_data.current?.feelslike}°C
                        </p>
                        </div>
                    </div>
                    <p className="text-5xl font-bold">
                        {result.weather_data.current?.temperature}°C
                    </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <WeatherCard 
                        title="Humidity" 
                        value={`${result.weather_data.current?.humidity}%`}
                        icon="💧"
                        color="text-blue-400"
                    />
                    <WeatherCard 
                        title="Wind" 
                        value={`${result.weather_data.current?.wind_speed} km/h ${result.weather_data.current?.wind_dir}`}
                        icon="🌬️"
                        color="text-gray-400"
                    />
                    <WeatherCard 
                        title="Pressure" 
                        value={`${result.weather_data.current?.pressure} hPa`}
                        icon="📊"
                        color="text-purple-400"
                    />
                    <WeatherCard 
                        title="Visibility" 
                        value={`${result.weather_data.current?.visibility} km`}
                        icon="👁️"
                        color="text-emerald-400"
                    />
                    </div>

                    {result.weather_data.current?.air_quality && (
                    <div className="p-3 bg-gray-800/50 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center">
                        <span className="mr-2">🌫️</span> Air Quality
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>CO: {result.weather_data.current.air_quality.co} µg/m³</div>
                        <div>NO₂: {result.weather_data.current.air_quality.no2} µg/m³</div>
                        <div>O₃: {result.weather_data.current.air_quality.o3} µg/m³</div>
                        <div>PM2.5: {result.weather_data.current.air_quality.pm2_5} µg/m³</div>
                        </div>
                    </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-yellow-900/20 rounded-lg">
                        <p className="text-sm font-semibold text-yellow-400">🌅 Sunrise</p>
                        <p>{result.weather_data.current?.astro?.sunrise}</p>
                    </div>
                    <div className="p-3 bg-blue-900/20 rounded-lg">
                        <p className="text-sm font-semibold text-blue-400">🌇 Sunset</p>
                        <p>{result.weather_data.current?.astro?.sunset}</p>
                    </div>
                    </div>
                </div>
                )}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
