from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import uvicorn
import os
import requests
import uuid
from dotenv import load_dotenv

load_dotenv()
WEATHERSTACK_API_KEY = os.getenv("WEATHERSTACK_API_KEY")

app = FastAPI(title="Weather Data System", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

weather_storage: Dict[str, Dict[str, Any]] = {}

class WeatherRequest(BaseModel):
    date: str
    location: str
    notes: Optional[str] = ""

@app.post("/weather")
async def create_weather_request(request: WeatherRequest):
    if not WEATHERSTACK_API_KEY:
        raise HTTPException(status_code=500, detail="Missing WeatherStack API key")

    response = requests.get(
        "http://api.weatherstack.com/current",
        params={
            "access_key": WEATHERSTACK_API_KEY,
            "query": request.location
        }
    )

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch weather data")

    data = response.json()
    if "current" not in data:
        raise HTTPException(status_code=400, detail="Invalid location or missing weather data")

    weather_data = {
        "id": str(uuid.uuid4()),
        "date": request.date,
        "location": request.location,
        "notes": request.notes,
        "weather": data["current"]
    }

    return {
        **weather_data,
        "temperature": data["current"].get("temperature"),
        "description": data["current"].get("weather_descriptions", ["N/A"])[0]
    }

@app.get("/weather/{weather_id}")
async def get_weather_data(weather_id: str):
    if weather_id not in weather_storage:
        raise HTTPException(status_code=404, detail="Weather data not found")
    return weather_storage[weather_id]

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
