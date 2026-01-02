"use client"

import { useState, useEffect } from "react"
import type { AppData, Habit, Skill } from "@/lib/types"

const INITIAL_HABITS: Habit[] = [
  { id: "1", name: "Bible Reading", createdAt: new Date().toISOString() },
  { id: "2", name: "Exercise", createdAt: new Date().toISOString() },
  { id: "3", name: "Skill Learning", createdAt: new Date().toISOString() },
  { id: "4", name: "Reading", createdAt: new Date().toISOString() },
  { id: "5", name: "Job / Gig Action", createdAt: new Date().toISOString() },
  { id: "6", name: "Sleep on Time", createdAt: new Date().toISOString() },
]

const INITIAL_SKILLS: Skill[] = [
  { id: "backend", name: "Backend Development", status: "Not Started", notes: "" },
  { id: "threejs", name: "Three.js / Animation", status: "Not Started", notes: "" },
]

const STORAGE_KEY = "focus_app_data"

export function useLocalStorage() {
  const [data, setData] = useState<AppData | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setData(JSON.parse(saved))
    } else {
      const initial: AppData = {
        habits: INITIAL_HABITS,
        logs: [],
        skills: INITIAL_SKILLS,
        weeklyReviews: [],
        transactions: [],
      }
      setData(initial)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
    }
  }, [])

  const updateData = (newData: AppData) => {
    setData(newData)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
  }

  // Helper methods
  const toggleHabit = (date: string, habitId: string) => {
    if (!data) return
    const logs = [...data.logs]
    const logIndex = logs.findIndex((l) => l.date === date)

    if (logIndex > -1) {
      const log = logs[logIndex]
      const habitIndex = log.completedHabitIds.indexOf(habitId)
      if (habitIndex > -1) {
        log.completedHabitIds.splice(habitIndex, 1)
      } else {
        log.completedHabitIds.push(habitId)
      }
    } else {
      logs.push({ date, completedHabitIds: [habitId] })
    }

    updateData({ ...data, logs })
  }

  const addHabit = (name: string) => {
    if (!data) return
    const newHabit: Habit = { id: Math.random().toString(36).substr(2, 9), name, createdAt: new Date().toISOString() }
    updateData({ ...data, habits: [...data.habits, newHabit] })
  }

  const deleteHabit = (id: string) => {
    if (!data) return
    updateData({
      ...data,
      habits: data.habits.filter((h) => h.id !== id),
      logs: data.logs.map((l) => ({ ...l, completedHabitIds: l.completedHabitIds.filter((hid) => hid !== id) })),
    })
  }

  return { data, toggleHabit, addHabit, deleteHabit, updateData }
}
