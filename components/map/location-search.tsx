"use client"

import { useState, useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-geosearch/dist/geosearch.css"
import { OpenStreetMapProvider } from "leaflet-geosearch"

// Фикс для иконок Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

// Экспортируем тип Props
export interface LocationSearchProps {
  onLocationSelect: (lat: number, lng: number, address: string, district: string) => void
  initialLocation?: [number, number]
}

// Функция для извлечения ТОЛЬКО района из данных Nominatim
function extractDistrict(addressData: any): string {
  // Поля, где может быть район
  const districtFields = [
    'suburb',           // "Бостандыкский район"
    'city_district',    // "Бостандыкский район"
    'county',           // "Бостандыкский район"
    'borough',          
    'neighbourhood',    // "микрорайон Орбита"
    'municipality'
  ]
  
  const ignoreWords = ['Алматы', 'Астана', 'Шымкент', 'Казахстан', 'Kazakhstan']
  
  console.log('📍 Данные адреса:', addressData)
  
  for (const field of districtFields) {
    if (addressData[field]) {
      const value = addressData[field]
      const isCity = ignoreWords.some(word => 
        value.toLowerCase().includes(word.toLowerCase())
      )
      
      if (!isCity || value.includes('район') || value.includes('микрорайон')) {
        console.log(`✅ Найден район: ${value}`)
        return value
      }
    }
  }
  
  if (addressData.city) {
    console.log(`🏙️ Город (центр): ${addressData.city}`)
    return `${addressData.city} (центр)`
  }
  
  return "Неизвестный район"
}

export function LocationSearch({ onLocationSelect, initialLocation = [43.2389, 76.8897] }: LocationSearchProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const [searchValue, setSearchValue] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const provider = new OpenStreetMapProvider({
    params: {
      'countrycodes': 'kz',
      'limit': 5,
      'accept-language': 'ru'
    }
  })

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView(initialLocation, 12)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current)

      mapRef.current.on("click", async (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=ru`
          )
          const data = await response.json()
          
          const address = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`
          const district = extractDistrict(data.address || {})
          
          console.log('📍 Адрес:', address)
          console.log('🏙️ Район:', district)
          
          onLocationSelect(lat, lng, address, district)
          updateMarker(lat, lng, address)
        } catch (error) {
          console.error('❌ Ошибка:', error)
          onLocationSelect(lat, lng, `${lat.toFixed(5)}, ${lng.toFixed(5)}`, "Неизвестный район")
          updateMarker(lat, lng, "")
        }
      })
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  const updateMarker = (lat: number, lng: number, address: string) => {
    if (markerRef.current) {
      markerRef.current.remove()
    }
    markerRef.current = L.marker([lat, lng])
      .addTo(mapRef.current!)
      .bindPopup(address)
      .openPopup()
  }

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)

    if (value.length > 2) {
      const results = await provider.search({ query: value })
      setSuggestions(results)
    } else {
      setSuggestions([])
    }
  }

  const handleSelectSuggestion = async (suggestion: any) => {
    const lat = parseFloat(suggestion.y)
    const lng = parseFloat(suggestion.x)
    
    setSearchValue(suggestion.label)
    setSuggestions([])
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=ru`
      )
      const data = await response.json()
      
      const district = extractDistrict(data.address || {})
      
      mapRef.current?.setView([lat, lng], 16)
      onLocationSelect(lat, lng, suggestion.label, district)
      updateMarker(lat, lng, suggestion.label)
    } catch (error) {
      console.error('❌ Ошибка:', error)
      mapRef.current?.setView([lat, lng], 16)
      onLocationSelect(lat, lng, suggestion.label, "Неизвестный район")
      updateMarker(lat, lng, suggestion.label)
    }
  }

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-4 left-4 z-[1000] w-80">
        <input
          type="text"
          value={searchValue}
          onChange={handleSearch}
          placeholder="Введите адрес в Казахстане..."
          className="w-full p-2 border rounded-lg shadow-lg bg-white text-sm"
        />
        {suggestions.length > 0 && (
          <ul className="absolute bg-white w-full border rounded-lg mt-1 shadow-lg max-h-60 overflow-auto z-[1001]">
            {suggestions.map((suggestion, idx) => (
              <li
                key={idx}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {suggestion.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div id="map" className="h-full w-full" />
    </div>
  )
}