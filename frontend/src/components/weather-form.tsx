"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "./ui/textarea";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface WeatherFormData {
  date: string;
  location: string;
  notes: string;
}

interface WeatherFormProps {
  onResult: (data: any) => void;
  isLoading: boolean;
}

export function WeatherForm({ onResult, isLoading }: WeatherFormProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [formData, setFormData] = useState<WeatherFormData>({
    date: format(new Date(), "yyyy-MM-dd"),
    location: "",
    notes: "",
  });

  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    setFormData(prev => ({
      ...prev,
      date: format(date, "yyyy-MM-dd")
    }));
    setCalendarOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    try {
      const response = await fetch("http://localhost:8000/weather", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: format(selectedDate, "yyyy-MM-dd"),
          location: formData.location,
          notes: formData.notes
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: "Weather data retrieved successfully!"
        });

        onResult({
          date: format(selectedDate, "yyyy-MM-dd"),
          location: formData.location,
          notes: formData.notes,
          weather: {
            temperature: data.temperature ?? "N/A",
            weather_descriptions: [data.description ?? "N/A"],
            humidity: data.weather?.humidity ?? "N/A",
            wind_speed: data.weather?.wind_speed ?? "N/A",
            pressure: data.weather?.pressure ?? "N/A",
            cloudcover: data.weather?.cloudcover ?? "N/A"
          }
        });
      } else {
        setResult({
          success: false,
          message: data.detail || "Failed to fetch weather data"
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Network error: Could not connect to the server"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date Picker */}
     { /*
      <div className="space-y-2">
        <Label htmlFor="date" className="text-gray-300">Date</Label>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal h-12 bg-gray-700 border-gray-600 hover:bg-gray-600",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(selectedDate, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              initialFocus
              className="bg-gray-800 text-white"
            />
          </PopoverContent>
        </Popover>
      </div>
*/}
      {/* Location Input */}
      <div className="space-y-2">
        <Label htmlFor="location" className="text-gray-300">Location</Label>
        <Input
          id="location"
          name="location"
          type="text"
          placeholder="e.g., New York, London, Tokyo"
          value={formData.location}
          onChange={handleInputChange}
          required
          className="h-12 bg-gray-700 border-gray-600"
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-gray-300">Notes (Optional)</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="Paste any notes you may have here!"
          value={formData.notes}
          onChange={handleInputChange}
          className="min-h-[100px] bg-gray-700 border-gray-600"
        />
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full h-12" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Fetching Weather...
          </>
        ) : (
          "Get Weather Data"
        )}
      </Button>

      {/* Result */}
      {result && (
        <div className={cn(
          "p-4 rounded-md border",
          result.success 
            ? "bg-green-900/30 border-green-800 text-green-200"
            : "bg-red-900/30 border-red-800 text-red-200"
        )}>
          <p className="font-medium">{result.message}</p>
        </div>
      )}
    </form>
  );
}
