export type Habit = {
  id: string
  name: string
  createdAt: string
}

export type DailyLog = {
  date: string // YYYY-MM-DD
  completedHabitIds: string[]
}

export type SkillStatus = "Not Started" | "Learning" | "Completed"

export type Skill = {
  id: string
  name: string
  status: SkillStatus
  notes: string
  projectLink?: string
}

export type WeeklyReview = {
  weekId: string // YYYY-WW
  checklist: {
    exercise: boolean
    skillConsistency: boolean
    jobApps: boolean
    financeAction: boolean
    spiritualRoutine: boolean
  }
  biggestWin: string
  improvement: string
}

export type Transaction = {
  id: string
  source: string
  amount: number
  date: string
  type: "income" | "debt"
}

export type AppData = {
  habits: Habit[]
  logs: DailyLog[]
  skills: Skill[]
  weeklyReviews: WeeklyReview[]
  transactions: Transaction[]
}
