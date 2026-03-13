"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { Cluster } from "@/lib/types"
import { getPriorityColor, getMarkerSize } from "@/lib/geo"
import { categories } from "@/lib/mock-data"

interface ClusterMapProps {
  clusters: Cluster[]
  center?: [number, number]
  zoom?: number
  onClusterClick?: (cluster: Cluster) => void
  className?: string
  clickToPlace?: boolean
  onMapClick?: (lat: number, lng: number) => void
  placedMarker?: [number, number] | null
}

export function ClusterMap({
  clusters,
  center = [37.775, -122.42],
  zoom = 13,
  onClusterClick,
  className = "",
  clickToPlace = false,
  onMapClick,
  placedMarker,
}: ClusterMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])
  const placedMarkerRef = useRef<L.Marker | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: true,
      attributionControl: true,
    })

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    mapInstanceRef.current = map
    setIsReady(true)

    if (clickToPlace) {
      map.on("click", (e: L.LeafletMouseEvent) => {
        onMapClick?.(e.latlng.lat, e.latlng.lng)
      })
    }

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update cluster markers
  useEffect(() => {
    if (!mapInstanceRef.current || !isReady) return

    // Clear old markers
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    clusters.forEach((cluster) => {
      const color = getPriorityColor(cluster.priority)
      const size = getMarkerSize(cluster.complaintsCount)
      const cat = categories.find((c) => c.id === cluster.categoryId)

      const icon = L.divIcon({
        className: "custom-cluster-marker",
        html: `<div style="
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: ${color};
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: ${size > 32 ? 12 : 10}px;
          font-weight: 700;
          box-shadow: 0 2px 8px ${color}80;
          border: 2px solid white;
          cursor: pointer;
          transition: transform 0.2s;
        " title="${cluster.title}">${cluster.complaintsCount}</div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      })

      const marker = L.marker([cluster.latitude, cluster.longitude], { icon })
        .addTo(mapInstanceRef.current!)
        .bindPopup(
          `<div style="min-width: 180px; font-family: sans-serif;">
            <strong style="font-size: 13px;">${cluster.title}</strong><br/>
            <span style="font-size: 11px; color: #666;">
              ${cat?.name || cluster.categoryId} &middot; ${cluster.district}
            </span><br/>
            <span style="font-size: 11px; color: ${color}; font-weight: 600;">
              ${cluster.complaintsCount} complaints
            </span>
          </div>`
        )

      marker.on("click", () => {
        onClusterClick?.(cluster)
      })

      markersRef.current.push(marker)
    })
  }, [clusters, isReady, onClusterClick])

  // Placed marker for location picker
  useEffect(() => {
    if (!mapInstanceRef.current || !isReady) return

    if (placedMarkerRef.current) {
      placedMarkerRef.current.remove()
      placedMarkerRef.current = null
    }

    if (placedMarker) {
      const icon = L.divIcon({
        className: "placed-marker",
        html: `<div style="
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          background: oklch(0.45 0.18 255);
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 2px 12px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      })

      placedMarkerRef.current = L.marker(placedMarker, { icon }).addTo(
        mapInstanceRef.current
      )
    }
  }, [placedMarker, isReady])

  return (
    <div
      ref={mapRef}
      className={`h-full w-full ${className}`}
      style={{ minHeight: 400 }}
    />
  )
}
