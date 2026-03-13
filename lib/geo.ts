import type { Priority } from "./types"

const EARTH_RADIUS_KM = 6371

export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return EARTH_RADIUS_KM * c
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

export function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case "critical":
      return "#ef4444"
    case "medium":
      return "#f59e0b"
    case "low":
      return "#22c55e"
    default:
      return "#6b7280"
  }
}

export function getPriorityBgClass(priority: Priority): string {
  switch (priority) {
    case "critical":
      return "bg-red-500"
    case "medium":
      return "bg-amber-500"
    case "low":
      return "bg-green-500"
    default:
      return "bg-gray-500"
  }
}

export function getPriorityTextClass(priority: Priority): string {
  switch (priority) {
    case "critical":
      return "text-red-500"
    case "medium":
      return "text-amber-500"
    case "low":
      return "text-green-500"
    default:
      return "text-gray-500"
  }
}

export function getPriorityLabel(priority: Priority): string {
  switch (priority) {
    case "critical":
      return "Critical"
    case "medium":
      return "Medium"
    case "low":
      return "Low"
    default:
      return "Unknown"
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case "new":
      return "New"
    case "confirmed":
      return "Confirmed"
    case "in_progress":
      return "In Progress"
    case "resolved":
      return "Resolved"
    case "rejected":
      return "Rejected"
    default:
      return status
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "new":
      return "bg-blue-500"
    case "confirmed":
      return "bg-indigo-500"
    case "in_progress":
      return "bg-amber-500"
    case "resolved":
      return "bg-green-500"
    case "rejected":
      return "bg-red-400"
    default:
      return "bg-gray-500"
  }
}

export function getMarkerSize(complaintsCount: number): number {
  if (complaintsCount >= 20) return 48
  if (complaintsCount >= 10) return 40
  if (complaintsCount >= 5) return 32
  return 24
}
