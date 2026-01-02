"use client"

import { useLocalStorage } from "@/hooks/use-local-storage"
import type { SkillStatus } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Link2 } from "lucide-react"

export default function SkillsPage() {
  const { data, updateData } = useLocalStorage()

  if (!data) return null

  const updateSkill = (id: string, updates: Partial<any>) => {
    const skills = data.skills.map((s) => (s.id === id ? { ...s, ...updates } : s))
    updateData({ ...data, skills })
  }

  return (
    <div className="space-y-8 pb-10">
      <header>
        <h1 className="text-3xl font-bold">Skill Mastery</h1>
        <p className="text-muted-foreground mt-1">Deep work and continuous growth.</p>
      </header>

      <div className="grid gap-6">
        {data.skills.map((skill) => (
          <Card key={skill.id} className="rounded-3xl border-pink-100 overflow-hidden bg-white/70 backdrop-blur-sm">
            <CardHeader className="bg-pink-50/50 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-pink-700">{skill.name}</CardTitle>
                <Select
                  value={skill.status}
                  onValueChange={(val: SkillStatus) => updateSkill(skill.id, { status: val })}
                >
                  <SelectTrigger className="w-40 rounded-xl bg-white border-pink-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="Learning">Learning</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Notes</label>
                <Textarea
                  placeholder="What did you learn today?"
                  value={skill.notes}
                  onChange={(e) => updateSkill(skill.id, { notes: e.target.value })}
                  className="rounded-2xl border-pink-100 focus-visible:ring-pink-500 min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Project Link</label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="https://github.com/..."
                    value={skill.projectLink || ""}
                    onChange={(e) => updateSkill(skill.id, { projectLink: e.target.value })}
                    className="pl-10 rounded-xl border-pink-100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
