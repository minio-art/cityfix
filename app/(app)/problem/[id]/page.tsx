"use client"

import { use } from "react"
import { ProblemDetail } from "@/components/problem/problem-detail"

export default function ProblemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  return <ProblemDetail problemId={id} />
}
