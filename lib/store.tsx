"use client"

import React, { createContext, useContext, useReducer, type ReactNode } from "react"
import type { User, Problem, Cluster, Comment, Vote, MapFilters, Notification } from "./types"
import {
  users,
  problems as initialProblems,
  clusters as initialClusters,
  comments as initialComments,
  votes as initialVotes,
  notifications as initialNotifications,
  categories,
} from "./mock-data"

interface AppState {
  currentUser: User | null
  problems: Problem[]
  clusters: Cluster[]
  comments: Comment[]
  votes: Vote[]
  notifications: Notification[]
  filters: MapFilters
}

type Action =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "ADD_PROBLEM"; payload: Problem }
  | { type: "UPDATE_PROBLEM"; payload: Problem }
  | { type: "ADD_COMMENT"; payload: Comment }
  | { type: "TOGGLE_VOTE"; payload: { problemId: string; userId: string } }
  | { type: "SET_FILTERS"; payload: Partial<MapFilters> }
  | { type: "MARK_NOTIFICATION_READ"; payload: string }
  | { type: "UPDATE_CLUSTER"; payload: Cluster }

const initialFilters: MapFilters = {
  categories: [],
  districts: [],
  statuses: [],
  priorities: [],
  searchQuery: "",
}

const initialState: AppState = {
  currentUser: null,
  problems: initialProblems,
  clusters: initialClusters,
  comments: initialComments,
  votes: initialVotes,
  notifications: initialNotifications,
  filters: initialFilters,
}

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "LOGIN":
      return { ...state, currentUser: action.payload }
    case "LOGOUT":
      return { ...state, currentUser: null }
    case "ADD_PROBLEM":
      return { ...state, problems: [action.payload, ...state.problems] }
    case "UPDATE_PROBLEM":
      return {
        ...state,
        problems: state.problems.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      }
    case "ADD_COMMENT":
      return { ...state, comments: [...state.comments, action.payload] }
    case "TOGGLE_VOTE": {
      const existing = state.votes.find(
        (v) =>
          v.problemId === action.payload.problemId &&
          v.userId === action.payload.userId
      )
      if (existing) {
        return {
          ...state,
          votes: state.votes.filter((v) => v.id !== existing.id),
          problems: state.problems.map((p) =>
            p.id === action.payload.problemId
              ? { ...p, votesCount: Math.max(0, p.votesCount - 1) }
              : p
          ),
        }
      }
      return {
        ...state,
        votes: [
          ...state.votes,
          {
            id: `vote-${Date.now()}`,
            problemId: action.payload.problemId,
            userId: action.payload.userId,
            createdAt: new Date().toISOString(),
          },
        ],
        problems: state.problems.map((p) =>
          p.id === action.payload.problemId
            ? { ...p, votesCount: p.votesCount + 1 }
            : p
        ),
      }
    }
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } }
    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      }
    case "UPDATE_CLUSTER":
      return {
        ...state,
        clusters: state.clusters.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      }
    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<Action>
} | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}

export function useCurrentUser() {
  const { state } = useApp()
  return state.currentUser
}

export function useProblems() {
  const { state } = useApp()
  return state.problems
}

export function useClusters() {
  const { state } = useApp()
  return state.clusters
}

export function useFilteredClusters() {
  const { state } = useApp()
  const { clusters, filters } = state

  return clusters.filter((cluster) => {
    if (filters.categories.length > 0 && !filters.categories.includes(cluster.categoryId)) {
      return false
    }
    if (filters.districts.length > 0 && !filters.districts.includes(cluster.district)) {
      return false
    }
    if (filters.statuses.length > 0 && !filters.statuses.includes(cluster.status)) {
      return false
    }
    if (filters.priorities.length > 0 && !filters.priorities.includes(cluster.priority)) {
      return false
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase()
      return cluster.title.toLowerCase().includes(q) || cluster.district.toLowerCase().includes(q)
    }
    return true
  })
}

export function getCategoryById(id: string) {
  return categories.find((c) => c.id === id)
}

export function getUserById(id: string) {
  return users.find((u) => u.id === id)
}
