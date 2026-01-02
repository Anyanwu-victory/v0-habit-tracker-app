"use client"

import { useLocalStorage } from "@/hooks/use-local-storage"
import { format, startOfWeek } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export default function WeeklyReviewPage() {
  const { data, updateData } = useLocalStorage()

  if (!data) return null

  const weekId = format(startOfWeek(new Date()), "yyyy-ww")
  const currentReview = data.weeklyReviews.find((r) => r.weekId === weekId) || {
    weekId,
    checklist: {
      exercise: false,
      skillConsistency: false,
      jobApps: false,
      financeAction: false,
      spiritualRoutine: false,
    },
    biggestWin: "",
    improvement: "",
  }

  const updateReview = (updates: Partial<any>) => {
    const existingIndex = data.weeklyReviews.findIndex((r) => r.weekId === weekId)
    const newReviews = [...data.weeklyReviews]

    if (existingIndex > -1) {
      newReviews[existingIndex] = { ...currentReview, ...updates }
    } else {
      newReviews.push({ ...currentReview, ...updates })
    }

    updateData({ ...data, weeklyReviews: newReviews })
  }

  const toggleCheck = (key: keyof typeof currentReview.checklist) => {
    updateReview({
      checklist: {
        ...currentReview.checklist,
        [key]: !currentReview.checklist[key],
      },
    })
  }

  return (
    <div className="space-y-8 pb-10">
      <header>
        <h1 className="text-3xl font-bold">Weekly Review</h1>
        <p className="text-muted-foreground">Pause. Reflect. recalibrate.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-3xl border-pink-100 bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Critical Pillars</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Exercised 3 times?", key: "exercise" },
              { label: "Skill learning consistency?", key: "skillConsistency" },
              { label: "Job applications done?", key: "jobApps" },
              { label: "Savings / debt action?", key: "financeAction" },
              { label: "Spiritual routine kept?", key: "spiritualRoutine" },
            ].map((item) => (
              <div key={item.key} className="flex items-center gap-3">
                <Checkbox
                  id={item.key}
                  checked={currentReview.checklist[item.key as keyof typeof currentReview.checklist]}
                  onCheckedChange={() => toggleCheck(item.key as any)}
                  className="rounded-md border-pink-300 data-[state=checked]:bg-pink-500"
                />
                <label htmlFor={item.key} className="text-sm font-medium leading-none cursor-pointer">
                  {item.label}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-3xl border-pink-100 bg-white">
            <CardHeader>
              <CardTitle className="text-lg text-pink-600">Biggest Win</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="What are you proud of this week?"
                value={currentReview.biggestWin}
                onChange={(e) => updateReview({ biggestWin: e.target.value })}
                className="rounded-2xl border-pink-50 focus-visible:ring-pink-500"
              />
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-pink-100 bg-white">
            <CardHeader>
              <CardTitle className="text-lg text-pink-600">Improvement for Next Week</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="How can you make next week 1% better?"
                value={currentReview.improvement}
                onChange={(e) => updateReview({ improvement: e.target.value })}
                className="rounded-2xl border-pink-50 focus-visible:ring-pink-500"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
