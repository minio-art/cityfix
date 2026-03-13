"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/lib/store"
import { categories, districts } from "@/lib/mock-data"
import { MapContainer } from "@/components/map/map-container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, MapPin } from "lucide-react"
import { toast } from "sonner"

export default function CreateProblemPage() {
  const router = useRouter()
  const { state, dispatch } = useApp()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [district, setDistrict] = useState("")
  const [location, setLocation] = useState<[number, number] | null>(null)

  function handleMapClick(lat: number, lng: number) {
    setLocation([lat, lng])
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!location) {
      toast.error("Please select a location on the map")
      return
    }

    const newProblem = {
      id: `prob-${Date.now()}`,
      title,
      description,
      categoryId,
      latitude: location[0],
      longitude: location[1],
      address: `${district} area`,
      district: district || "Unknown",
      priority: "medium" as const,
      status: "new" as const,
      authorId: state.currentUser?.id || "user-1",
      photos: [],
      votesCount: 1,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    dispatch({ type: "ADD_PROBLEM", payload: newProblem })
    toast.success("Problem reported successfully!")
    router.push("/map")
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Report a Problem</h1>
        <p className="mt-1 text-muted-foreground">
          Help improve your city by reporting issues you notice
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Problem Details</CardTitle>
              <CardDescription>Describe the issue you want to report</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Large pothole on Main Street"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={setCategoryId} value={categoryId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="district">District</Label>
                <Select onValueChange={setDistrict} value={district}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a district" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide details about the problem..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Photo (optional)</Label>
                <div className="flex h-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary/30 hover:bg-muted/50">
                  <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    <Upload className="h-5 w-5" />
                    <span className="text-xs">Click to upload</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Location</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Click on the map to set the location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72 overflow-hidden rounded-lg border border-border">
                <MapContainer
                  clusters={[]}
                  clickToPlace
                  onMapClick={handleMapClick}
                  placedMarker={location}
                  zoom={14}
                />
              </div>
              {location && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Location: {location[0].toFixed(5)}, {location[1].toFixed(5)}
                </p>
              )}
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full">
            Submit Report
          </Button>
        </div>
      </form>
    </div>
  )
}
