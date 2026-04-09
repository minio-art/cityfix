"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { getPriorityColor, getMarkerSize } from "@/lib/geo"
import { categories } from "@/lib/mock-data"
import { getAuthToken } from "@/lib/api"
import { toast } from "react-hot-toast"
import { useAuth } from "@/hooks/useAuth"

interface Cluster {
  id: string
  categoryId: string
  latitude: number
  longitude: number
  priority: string
  status: string
  complaintsCount: number
  votesCount?: number
  district: string
  title: string
}

interface ClusterMapProps {
  clusters: Cluster[]
  center?: [number, number]
  zoom?: number
  onClusterClick?: (cluster: Cluster) => void
  className?: string
  onVoteSuccess?: (clusterId: string, newVoteCount: number) => void
  currentUserId?: number
}

export function ClusterMap({
  clusters,
  center = [43.2389, 76.8897],
  zoom = 12,
  onClusterClick,
  className = "",
  onVoteSuccess,
  currentUserId,
}: ClusterMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])
  const [isReady, setIsReady] = useState(false)
  const [voting, setVoting] = useState<string | null>(null)
  const [votedClusters, setVotedClusters] = useState<Set<string>>(new Set())
  const { user } = useAuth()

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

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [center, zoom])

  const handleVote = async (clusterId: string, cluster: Cluster) => {
    const token = getAuthToken()
    if (!token) {
      toast.error("Please log in to vote")
      return
    }

    if (voting === clusterId) return

    setVoting(clusterId)
    try {
      const issueId = parseInt(clusterId, 10)
      
      if (isNaN(issueId)) {
        toast.error("Invalid issue ID")
        return
      }

      const response = await fetch(`http://localhost:8001/api/issues/${issueId}/vote`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: currentUserId }),
      })

      if (!response.ok) {
        let errorMessage = "Failed to vote"
        try {
          const errorData = await response.json()
          errorMessage = errorData.detail || errorMessage
        } catch (e) {
          errorMessage = response.statusText || errorMessage
        }
        
        if (response.status === 400 && errorMessage.includes("уже голосовали")) {
          toast.error("❌ Вы уже голосовали за эту проблему")
          setVotedClusters(prev => new Set(prev).add(clusterId))
        } else {
          toast.error(errorMessage)
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()
      toast.success("✅ Vote recorded!")
      
      setVotedClusters(prev => new Set(prev).add(clusterId))
      
      if (onVoteSuccess) {
        onVoteSuccess(clusterId, result.votesCount || (cluster.votesCount || 0) + 1)
      }
      
      cluster.votesCount = result.votesCount
      
    } catch (error) {
      console.error("Vote error:", error)
    } finally {
      setVoting(null)
    }
  }

  const getProblemUrl = (clusterId: string) => {
    return `/cluster/${clusterId}`
  }

  useEffect(() => {
    if (!mapInstanceRef.current || !isReady) return

    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    clusters.forEach((cluster) => {
      if (!cluster.latitude || !cluster.longitude) return
      
      const color = getPriorityColor(cluster.priority as "critical" | "medium" | "low")
      const size = getMarkerSize(cluster.complaintsCount)
      const cat = categories.find((c) => c.id === cluster.categoryId)
      const votes = cluster.votesCount || 0
      const hasVoted = votedClusters.has(cluster.id)

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
          position: relative;
        ">
          ${cluster.complaintsCount}
          ${votes > 0 ? `
            <div style="
              position: absolute;
              bottom: -5px;
              right: -5px;
              background: #2196f3;
              border-radius: 50%;
              width: 18px;
              height: 18px;
              font-size: 9px;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 1px solid white;
            ">${votes}</div>
          ` : ''}
          ${hasVoted ? `
            <div style="
              position: absolute;
              top: -5px;
              right: -5px;
              background: #4caf50;
              border-radius: 50%;
              width: 16px;
              height: 16px;
              font-size: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 1px solid white;
            ">✓</div>
          ` : ''}
        </div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      })

      const problemUrl = getProblemUrl(cluster.id)
      const isAdmin = user?.role === "admin"
      
      const popupContent = `
        <div style="min-width: 220px; font-family: sans-serif; padding: 4px;">
          <strong style="font-size: 14px; display: block; margin-bottom: 4px;">
            ${cluster.title}
          </strong>
          <span style="font-size: 11px; color: #666; display: block; margin-bottom: 8px;">
            ${cat?.name || cluster.categoryId} &middot; ${cluster.district}
          </span>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
            <span style="font-size: 12px; color: ${color}; font-weight: 600;">
              📊 ${cluster.complaintsCount} complaints
            </span>
            <span style="font-size: 12px; color: #2196f3; font-weight: 600;">
              👍 ${votes} votes
            </span>
          </div>
          <div style="margin-top: 12px; display: flex; gap: 8px;">
            <button 
              id="vote-btn-${cluster.id}"
              class="vote-button"
              data-cluster-id="${cluster.id}"
              style="
                flex: 1;
                background: ${hasVoted ? '#4caf50' : (voting === cluster.id ? '#ccc' : '#2196f3')};
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12px;
                cursor: ${hasVoted || voting === cluster.id ? 'default' : 'pointer'};
                font-weight: 500;
              "
              ${hasVoted ? 'disabled' : ''}
            >
              ${hasVoted ? '✓ Voted' : (voting === cluster.id ? '⏳ Voting...' : '👍 Vote')}
            </button>
            <a 
              href="${problemUrl}"
              style="
                flex: 1;
                background: ${isAdmin ? '#ff9800' : '#4caf50'};
                color: white;
                text-decoration: none;
                text-align: center;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12px;
                cursor: pointer;
                font-weight: 500;
                display: inline-block;
              "
              onmouseover="this.style.background='${isAdmin ? '#e68900' : '#45a049'}'"
              onmouseout="this.style.background='${isAdmin ? '#ff9800' : '#4caf50'}'"
            >
              ${isAdmin ? '✏️ Edit' : '📋 Details'}
            </a>
          </div>
        </div>
      `

      const marker = L.marker([cluster.latitude, cluster.longitude], { icon })
        .addTo(mapInstanceRef.current!)
        .bindPopup(popupContent, { className: "cluster-popup" })

      marker.on("popupopen", () => {
        const voteBtn = document.getElementById(`vote-btn-${cluster.id}`)
        if (voteBtn && !hasVoted && voting !== cluster.id) {
          const newVoteBtn = voteBtn.cloneNode(true)
          voteBtn.parentNode?.replaceChild(newVoteBtn, voteBtn)
          newVoteBtn.addEventListener("click", (e) => {
            e.stopPropagation()
            handleVote(cluster.id, cluster)
          })
        }
      })

      marker.on("click", () => {
        if (onClusterClick) {
          onClusterClick(cluster)
        }
      })

      markersRef.current.push(marker)
    })
  }, [clusters, isReady, onClusterClick, voting, votedClusters, user])

  return (
    <div
      ref={mapRef}
      className={`h-full w-full ${className}`}
      style={{ minHeight: 400 }}
    />
  )
}