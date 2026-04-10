"use client"

import { useState } from "react"
import { useApp, getUserById } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send } from "lucide-react"

export function CommentSection({ problemId }: { problemId: string }) {
  const { state, dispatch } = useApp()
  const [text, setText] = useState("")
  const comments = state.comments.filter((c) => c.problemId === problemId)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return

    dispatch({
      type: "ADD_COMMENT",
      payload: {
        id: `com-${Date.now()}`,
        problemId,
        authorId: state.currentUser?.id || "user-1",
        text: text.trim(),
        createdAt: new Date().toISOString(),
      },
    })
    setText("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Комментарии ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {comments.map((comment) => {
          const author = getUserById(comment.authorId)
          return (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-primary/10 text-xs text-primary">
                  {author?.name?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {author?.name || "Неизвестно"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString("ru-RU")}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {comment.text}
                </p>
              </div>
            </div>
          )
        })}

        <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
          <Textarea
            placeholder="Добавить комментарий..."
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" className="shrink-0 self-end">
            <Send className="h-4 w-4" />
            <span className="sr-only">Отправить комментарий</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}