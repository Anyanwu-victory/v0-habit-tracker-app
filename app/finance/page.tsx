"use client"

import { cn } from "@/lib/utils"

import { useLocalStorage } from "@/hooks/use-local-storage"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Minus, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { format } from "date-fns"

export default function FinancePage() {
  const { data, updateData } = useLocalStorage()
  const [amount, setAmount] = useState("")
  const [source, setSource] = useState("")
  const [type, setType] = useState<"income" | "debt">("income")

  if (!data) return null

  const totalIncome = data.transactions.filter((t) => t.type === "income").reduce((acc, t) => acc + t.amount, 0)

  const totalDebt = data.transactions.filter((t) => t.type === "debt").reduce((acc, t) => acc + t.amount, 0)

  const balance = totalIncome - totalDebt

  const addTransaction = () => {
    if (!amount || !source) return
    const newTx = {
      id: Math.random().toString(36).substr(2, 9),
      source,
      amount: Number.parseFloat(amount),
      date: new Date().toISOString(),
      type,
    }
    updateData({ ...data, transactions: [newTx, ...data.transactions] })
    setAmount("")
    setSource("")
  }

  return (
    <div className="space-y-8 pb-10">
      <header>
        <h1 className="text-3xl font-bold">Wealth Tracker</h1>
        <p className="text-muted-foreground">Manage your flow and freedom.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-green-50 border-green-100 rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">${totalIncome.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-100 rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Debts</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">${totalDebt.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-pink-50 border-pink-100 rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-pink-700">Net Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-700">${balance.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl border-pink-100">
        <CardHeader>
          <CardTitle>Add Entry</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Source (e.g. Salary, FairMoney)"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="rounded-xl"
          />
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="rounded-xl"
          />
          <div className="flex gap-2">
            <Button
              onClick={() => setType("income")}
              variant={type === "income" ? "default" : "outline"}
              className={cn("flex-1 rounded-xl", type === "income" && "bg-green-600 hover:bg-green-700")}
            >
              Income
            </Button>
            <Button
              onClick={() => setType("debt")}
              variant={type === "debt" ? "default" : "outline"}
              className={cn("flex-1 rounded-xl", type === "debt" && "bg-red-600 hover:bg-red-700")}
            >
              Debt
            </Button>
          </div>
          <Button onClick={addTransaction} className="rounded-xl bg-pink-500 text-white">
            Save
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-bold">Recent Transactions</h3>
        <div className="grid gap-2">
          {data.transactions.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between p-4 bg-white border border-pink-50 rounded-2xl shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2 rounded-xl",
                    t.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600",
                  )}
                >
                  {t.type === "income" ? <Plus className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                </div>
                <div>
                  <div className="font-semibold">{t.source}</div>
                  <div className="text-xs text-muted-foreground">{format(new Date(t.date), "MMM d, h:mm a")}</div>
                </div>
              </div>
              <div className={cn("font-bold", t.type === "income" ? "text-green-600" : "text-red-600")}>
                {t.type === "income" ? "+" : "-"}${t.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
