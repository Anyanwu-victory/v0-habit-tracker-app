"use client"

import type React from "react"

import { useState } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { format } from "date-fns"
import { Plus, Trash2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function HabitsPage() {
  const { data, toggleHabit, addHabit, deleteHabit } = useLocalStorage()
  const [newHabitName, setNewHabitName] = useState("")

  if (!data) return null

  const today = format(new Date(), "yyyy-MM-dd")
  const todayLog = data.logs.find((l) => l.date === today)

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (newHabitName.trim()) {
      addHabit(newHabitName.trim())
      setNewHabitName("")
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Daily Habits</h1>
        <p className="text-muted-foreground mt-1">Small rituals, big results.</p>
      </header>

      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          placeholder="New habit name..."
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          className="rounded-xl border-pink-100"
        />
        <Button type="submit" className="rounded-xl bg-pink-500 hover:bg-pink-600 text-white">
          <Plus className="h-4 w-4 mr-2" /> Add
        </Button>
      </form>

      <div className="grid gap-3">
        {data.habits.map((habit) => {
          const isDone = todayLog?.completedHabitIds.includes(habit.id)
          return (
            <div
              key={habit.id}
              className={cn(
                "group flex items-center justify-between p-4 rounded-2xl transition-all border shadow-sm",
                isDone ? "bg-pink-50 border-pink-200" : "bg-white border-pink-100",
              )}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleHabit(today, habit.id)}
                  className={cn(
                    "h-8 w-8 rounded-xl border-2 flex items-center justify-center transition-all",
                    isDone
                      ? "bg-pink-500 border-pink-500 text-white scale-110"
                      : "border-pink-200 hover:border-pink-400",
                  )}
                >
                  {isDone && <Check className="h-5 w-5" />}
                </button>
                <span className={cn("font-medium", isDone && "line-through text-pink-400")}>{habit.name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                onClick={() => deleteHabit(habit.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
