"use client"

import { statusChanges } from "@/lib/mock-data"
import { getUserById } from "@/lib/store"
import { getStatusLabel, getStatusColor } from "@/lib/geo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StatusTimeline({ problemId }: { problemId: string }) {
  const changes = statusChanges.filter((sc) => sc.problemId === problemId)

  if (changes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">История статусов</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Изменений статуса пока нет</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">История статусов</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {changes.map((change, i) => {
            const user = getUserById(change.changedBy)
            return (
              <div key={change.id} className="relative flex gap-3">
                {i < changes.length - 1 && (
                  <div className="absolute left-[11px] top-6 h-full w-px bg-border" />
                )}
                <div className={`mt-1 h-[22px] w-[22px] shrink-0 rounded-full ${getStatusColor(change.toStatus)} flex items-center justify-center`}>
                  <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {getStatusLabel(change.toStatus)}
                    </span>
                  </div>
                  {change.comment && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{change.comment}</p>
                  )}
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    от {user?.name || "Система"} &middot;{" "}
                    {new Date(change.createdAt).toLocaleDateString("ru-RU")}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}