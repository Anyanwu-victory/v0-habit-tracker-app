"use client"

import { cn } from "@/lib/utils"

import { useLocalStorage } from "@/hooks/use-local-storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO } from "date-fns"
import { Sparkles, Trophy, CalendarDays } from "lucide-react"

export default function Dashboard() {
  const { data } = useLocalStorage()
  if (!data) return null

  const today = format(new Date(), "yyyy-MM-dd")
  const todayLog = data.logs.find((l) => l.date === today)
  const dailyCompletion =
    data.habits.length > 0 ? ((todayLog?.completedHabitIds.length || 0) / data.habits.length) * 100 : 0

  // Weekly progress
  const startOfWk = startOfWeek(new Date())
  const endOfWk = endOfWeek(new Date())
  const weeklyLogs = data.logs.filter((l) => isWithinInterval(parseISO(l.date), { start: startOfWk, end: endOfWk }))
  const weeklyCompletionCount = weeklyLogs.reduce((acc, log) => acc + log.completedHabitIds.length, 0)
  const totalWeeklyPossible = data.habits.length * 7
  const weeklyProgress = totalWeeklyPossible > 0 ? (weeklyCompletionCount / totalWeeklyPossible) * 100 : 0

  // Streak (simplified)
  const streak = data.logs.length // Just counting active days for this demo

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Good morning, seeker</h1>
        <p className="text-muted-foreground flex items-center gap-2 mt-1">
          <Sparkles className="h-4 w-4 text-pink-500" />
          One step at a time, your progress builds your future.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white/50 border-pink-100 backdrop-blur-sm shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Today's Progress</CardTitle>
            <CheckCircle className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(dailyCompletion)}%</div>
            <Progress value={dailyCompletion} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-white/50 border-pink-100 backdrop-blur-sm shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Weekly Consistency</CardTitle>
            <CalendarDays className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(weeklyProgress)}%</div>
            <Progress value={weeklyProgress} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-white/50 border-pink-100 backdrop-blur-sm shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Trophy className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streak} Days</div>
            <p className="text-xs text-muted-foreground mt-1">Consistency is key</p>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Today's Focus</h2>
        <div className="grid gap-4">
          {data.habits.slice(0, 3).map((habit) => (
            <div
              key={habit.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-white/80 border border-pink-100 shadow-sm"
            >
              <span className="font-medium">{habit.name}</span>
              <div
                className={cn(
                  "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors",
                  todayLog?.completedHabitIds.includes(habit.id)
                    ? "bg-pink-500 border-pink-500 text-white"
                    : "border-pink-200",
                )}
              >
                {todayLog?.completedHabitIds.includes(habit.id) && <Check className="h-4 w-4" />}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

import { CheckCircle, Check } from "lucide-react"
