"use client"

import { useApp } from "@/lib/store"
import { categories } from "@/lib/mock-data"
import { getPriorityColor, getPriorityLabel, getStatusLabel, getStatusColor } from "@/lib/geo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CalendarDays, FileText, ThumbsUp, Bell } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { state } = useApp()
  const user = state.currentUser

  const myProblems = state.problems.filter((p) => p.authorId === user?.id)
  const votedProblemIds = state.votes
    .filter((v) => v.userId === user?.id)
    .map((v) => v.problemId)
  const votedProblems = state.problems.filter((p) => votedProblemIds.includes(p.id))
  const myNotifications = state.notifications.filter((n) => n.userId === user?.id)

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* Profile card */}
      <Card className="mb-6">
        <CardContent className="flex items-center gap-6 pt-6">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary/10 text-2xl text-primary">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{user?.name || "User"}</h1>
            <p className="text-muted-foreground">{user?.email}</p>
            <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                Joined {user ? new Date(user.createdAt).toLocaleDateString() : ""}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                {myProblems.length} reports
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-3.5 w-3.5" />
                {votedProblems.length} voted
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="reports">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="reports" className="gap-1">
            <FileText className="h-3.5 w-3.5" />
            My Reports
          </TabsTrigger>
          <TabsTrigger value="voted" className="gap-1">
            <ThumbsUp className="h-3.5 w-3.5" />
            Voted
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1">
            <Bell className="h-3.5 w-3.5" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="mt-4">
          <div className="flex flex-col gap-3">
            {myProblems.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  You have not reported any problems yet.
                </CardContent>
              </Card>
            ) : (
              myProblems.map((p) => (
                <ProblemRow key={p.id} problem={p} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="voted" className="mt-4">
          <div className="flex flex-col gap-3">
            {votedProblems.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  You have not voted on any problems yet.
                </CardContent>
              </Card>
            ) : (
              votedProblems.map((p) => (
                <ProblemRow key={p.id} problem={p} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <div className="flex flex-col gap-3">
            {myNotifications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No notifications.
                </CardContent>
              </Card>
            ) : (
              myNotifications.map((n) => (
                <Card key={n.id} className={n.read ? "opacity-60" : ""}>
                  <CardContent className="flex items-center gap-3 py-3">
                    {!n.read && <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                    <div>
                      <p className="text-sm font-medium text-foreground">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.message}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProblemRow({ problem }: { problem: { id: string; title: string; categoryId: string; priority: string; status: string; votesCount: number; createdAt: string } }) {
  const cat = categories.find((c) => c.id === problem.categoryId)
  return (
    <Link href={`/problem/${problem.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">{problem.title}</p>
              <div className="mt-1 flex items-center gap-2">
                <Badge
                  variant="outline"
                  style={{ borderColor: getPriorityColor(problem.priority as "critical" | "medium" | "low"), color: getPriorityColor(problem.priority as "critical" | "medium" | "low") }}
                  className="text-xs"
                >
                  {getPriorityLabel(problem.priority as "critical" | "medium" | "low")}
                </Badge>
                <span className="text-xs text-muted-foreground">{cat?.name}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Badge variant="secondary" className="gap-1">
              <span className={`h-1.5 w-1.5 rounded-full ${getStatusColor(problem.status)}`} />
              {getStatusLabel(problem.status)}
            </Badge>
            <span>{problem.votesCount} votes</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
