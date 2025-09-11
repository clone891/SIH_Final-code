import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead or of hurting yourself in some way"
]

const OPTIONS: { label: string; value: number }[] = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 }
]

function severityFromScore(score: number) {
  if (score <= 4) return { level: "Minimal", color: "text-green-600", bg: "bg-green-500/10" }
  if (score <= 9) return { level: "Mild", color: "text-lime-600", bg: "bg-lime-500/10" }
  if (score <= 14) return { level: "Moderate", color: "text-yellow-700", bg: "bg-yellow-500/10" }
  if (score <= 19) return { level: "Moderately severe", color: "text-orange-700", bg: "bg-orange-500/10" }
  return { level: "Severe", color: "text-red-700", bg: "bg-red-500/10" }
}

export default function Phq9Page() {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null))
  const [submitted, setSubmitted] = useState(false)

  const allAnswered = useMemo(() => answers.every((a) => a !== null), [answers])
  const total = useMemo(() => answers.reduce((sum, a) => sum + (a ?? 0), 0), [answers])
  const severity = useMemo(() => severityFromScore(total), [total])

  const onSelect = (qIndex: number, value: number) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[qIndex] = value
      return next
    })
  }

  const handleSubmit = () => {
    if (!allAnswered) return
    setSubmitted(true)
  }

  const reset = () => {
    setAnswers(Array(QUESTIONS.length).fill(null))
    setSubmitted(false)
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }}>
            <h1 className="text-3xl font-bold mb-2">PHQ-9 Depression Assessment</h1>
            <p className="text-muted-foreground">Over the last 2 weeks, how often have you been bothered by any of the following problems?</p>
          </motion.div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Questions</CardTitle>
            <CardDescription>Select one option for each question.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {QUESTIONS.map((q, i) => (
              <div key={i} className="rounded-xl p-4 border bg-card/60">
                <div className="mb-3 font-medium text-foreground">{i + 1}. {q}</div>
                <RadioGroup value={answers[i] !== null ? String(answers[i]) : undefined} onValueChange={(v) => onSelect(i, Number(v))} className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
                  {OPTIONS.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/40 cursor-pointer">
                      <RadioGroupItem value={String(opt.value)} id={`q${i}-${opt.value}`} />
                      <Label htmlFor={`q${i}-${opt.value}`} className="cursor-pointer">{opt.label}</Label>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            ))}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Button className="w-full sm:w-auto" onClick={handleSubmit} disabled={!allAnswered}>Submit Assessment</Button>
              <Button variant="secondary" className="w-full sm:w-auto" onClick={reset}>Reset</Button>
            </div>
          </CardContent>
        </Card>

        {submitted && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card className={`${severity.bg} border-primary/20`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Your Results</span>
                  <span className={`text-lg font-semibold ${severity.color}`}>{severity.level}</span>
                </CardTitle>
                <CardDescription>PHQ-9 total score: {total} / 27</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm leading-relaxed">
                <p>
                  Severity levels: 0–4 Minimal, 5–9 Mild, 10–14 Moderate, 15–19 Moderately severe, 20–27 Severe.
                </p>
                <p>
                  This screening tool helps monitor symptoms. It does not replace professional diagnosis. If you selected anything other than "Not at all" for question 9 or if your score is in the moderate or higher range, consider reaching out for support.
                </p>
                <div className="pt-2">
                  <Button onClick={reset}>Retake</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
