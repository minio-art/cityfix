"use client"

import { useApp } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { ThumbsUp } from "lucide-react"

export function VoteButton({ problemId }: { problemId: string }) {
  const { state, dispatch } = useApp()
  const userId = state.currentUser?.id || ""
  const hasVoted = state.votes.some(
    (v) => v.problemId === problemId && v.userId === userId
  )

  return (
    <Button
      variant={hasVoted ? "default" : "outline"}
      className="w-full gap-2"
      onClick={() =>
        dispatch({ type: "TOGGLE_VOTE", payload: { problemId, userId } })
      }
    >
      <ThumbsUp className="h-4 w-4" />
      {hasVoted ? "Supported" : "Support This"}
    </Button>
  )
}
