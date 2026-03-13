"use client"

import { useApp } from "@/lib/store"
import { categories } from "@/lib/mock-data"
import { getUserById } from "@/lib/store"
import { getPriorityColor, getPriorityLabel, getStatusLabel, getStatusColor } from "@/lib/geo"
import { MapContainer } from "@/components/map/map-container"
import { VoteButton } from "./vote-button"
import { CommentSection } from "./comment-section"
import { StatusTimeline } from "./status-timeline"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, MapPin, Users } from "lucide-react"
import Link from "next/link"

export function ProblemDetail({ problemId }: { problemId: string }) {
  const { state } = useApp()
  const problem = state.problems.find((p) => p.id === problemId)

  if (!problem) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">Problem not found</h2>
          <p className="mt-2 text-muted-foreground">
            The problem you are looking for does not exist.
          </p>
          <Link href="/map" className="mt-4 inline-block text-sm text-primary hover:underline">
            Back to Map
          </Link>
        </div>
      </div>
    )
  }

  const cat = categories.find((c) => c.id === problem.categoryId)
  const author = getUserById(problem.authorId)
  const cluster = state.clusters.find((c) => c.problemIds.includes(problem.id))

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-4">
        <Link href="/map" className="text-sm text-primary hover:underline">
          Back to Map
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Main info */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  style={{
                    backgroundColor: getPriorityColor(problem.priority),
                    color: "white",
                  }}
                >
                  {getPriorityLabel(problem.priority)}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <span className={`h-2 w-2 rounded-full ${getStatusColor(problem.status)}`} />
                  {getStatusLabel(problem.status)}
                </Badge>
                {cat && <Badge variant="secondary">{cat.name}</Badge>}
              </div>
              <CardTitle className="mt-2 text-xl">{problem.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-muted-foreground">
                {problem.description}
              </p>
              <Separator className="my-4" />
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {problem.address}, {problem.district}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {new Date(problem.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  Reported by {author?.name || "Unknown"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Map */}
          <Card>
            <CardContent className="p-0">
              <div className="h-64 overflow-hidden rounded-lg">
                <MapContainer
                  clusters={cluster ? [cluster] : []}
                  center={[problem.latitude, problem.longitude]}
                  zoom={15}
                />
              </div>
            </CardContent>
          </Card>

          {/* Comments */}
          <CommentSection problemId={problem.id} />
        </div>

        <div className="flex flex-col gap-6">
          {/* Vote */}
          <Card>
            <CardContent className="flex flex-col items-center gap-3 pt-6">
              <span className="text-3xl font-bold text-foreground">{problem.votesCount}</span>
              <span className="text-sm text-muted-foreground">people support this</span>
              <VoteButton problemId={problem.id} />
            </CardContent>
          </Card>

          {/* Cluster info */}
          {cluster && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Cluster Info</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total complaints</span>
                  <span className="font-medium text-foreground">{cluster.complaintsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reports in cluster</span>
                  <span className="font-medium text-foreground">{cluster.problemIds.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">District</span>
                  <span className="font-medium text-foreground">{cluster.district}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status timeline */}
          <StatusTimeline problemId={problem.id} />
        </div>
      </div>
    </div>
  )
}
