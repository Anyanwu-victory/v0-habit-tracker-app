"use client"

import { useLocalStorage } from "@/hooks/use-local-storage"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  isSunday,
  isBefore, // added isBefore to check for past dates
  startOfDay, // added startOfDay for accurate date comparison
} from "date-fns"
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function CalendarPage() {
  const { data } = useLocalStorage()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!data) return null

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getStatusColor = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    const log = data.logs.find((l) => l.date === dateStr)
    const today = startOfDay(new Date())
    const isPast = isBefore(startOfDay(date), today)
    const isToday = isSameDay(date, today)

    if (!log || log.completedHabitIds.length === 0) {
      if (isPast) {
        return isSunday(date) ? "bg-red-50 border-red-200" : "bg-red-50 border-red-100"
      }
      return "bg-gray-50 border-gray-100" // Future/Pending
    }

    const percentage = log.completedHabitIds.length / data.habits.length
    if (percentage === 1) return "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.3)]"
    if (percentage >= 0.5) return "bg-yellow-400"

    // If some progress but not much
    if (isPast || isToday) return "bg-red-300"
    return "bg-gray-100"
  }

  const handleDayClick = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd")
    setSelectedDay(dateStr)
    setIsModalOpen(true)
  }

  const selectedLog = selectedDay ? data.logs.find((l) => l.date === selectedDay) : null
  const selectedDate = selectedDay ? parseISO(selectedDay) : null
  const isSelectedPastOrToday = selectedDate ? !isBefore(startOfDay(new Date()), startOfDay(selectedDate)) : false

  return (
    <div className="space-y-8 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{format(currentDate, "MMMM yyyy")}</h1>
          <p className="text-muted-foreground">Review your journey.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-7 gap-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className={cn(
              "text-center text-xs font-semibold py-2 uppercase tracking-wider",
              day === "Su" ? "text-red-400" : "text-muted-foreground",
            )}
          >
            {day}
          </div>
        ))}
        {/* Padding for first day of month */}
        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}
        {days.map((day) => (
          <button
            key={day.toISOString()}
            onClick={() => handleDayClick(day)}
            className={cn(
              "aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border relative",
              isSameDay(day, new Date()) ? "border-pink-400 bg-pink-50/50" : "border-pink-50 bg-white/50",
              isSunday(day) && "border-red-100",
              selectedDay === format(day, "yyyy-MM-dd") && "ring-2 ring-pink-500",
            )}
          >
            <span className={cn("text-sm font-medium", isSunday(day) && "text-red-500")}>{format(day, "d")}</span>
            <div className={cn("h-1.5 w-1.5 rounded-full", getStatusColor(day))} />
          </button>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="rounded-3xl border-pink-100 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {selectedDate && format(selectedDate, "EEEE, MMMM do")}
            </DialogTitle>
            <DialogDescription>
              {isSelectedPastOrToday ? "Habit completion summary for this day." : "Planning for this future date."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid gap-3">
              {data.habits.map((habit) => {
                const completed = selectedLog?.completedHabitIds.includes(habit.id)
                const statusLabel = completed ? "Done" : isSelectedPastOrToday ? "Missed" : "Pending"

                return (
                  <div
                    key={habit.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-2xl border transition-colors",
                      completed ? "bg-green-50 border-green-100" : "bg-gray-50 border-gray-100",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className={cn("h-5 w-5", isSelectedPastOrToday ? "text-red-300" : "text-gray-300")} />
                      )}
                      <span className={cn("font-medium", !completed && "text-muted-foreground")}>{habit.name}</span>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border bg-white",
                        completed
                          ? "text-green-600 border-green-200"
                          : isSelectedPastOrToday
                            ? "text-red-400 border-red-100"
                            : "text-gray-400 border-gray-200",
                      )}
                    >
                      {statusLabel}
                    </span>
                  </div>
                )
              })}
            </div>

            {selectedLog && (
              <div className="mt-4 p-4 bg-pink-50/50 rounded-2xl border border-pink-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-pink-600 font-semibold">Total Score</span>
                  <span className="font-bold text-pink-700">
                    {selectedLog.completedHabitIds.length} / {data.habits.length}
                  </span>
                </div>
                <div className="mt-2 h-2 w-full bg-white rounded-full overflow-hidden border border-pink-100">
                  <div
                    className="h-full bg-pink-400 transition-all duration-500"
                    style={{ width: `${(selectedLog.completedHabitIds.length / data.habits.length) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-wrap gap-4 text-xs font-medium text-muted-foreground px-2">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-green-400" /> Complete
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-yellow-400" /> Partial
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-red-400" /> Some
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-gray-100" /> None
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-red-50 border border-red-200" /> Missed Sunday
        </div>
      </div>
    </div>
  )
}
