import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface Student {
  id: string
  name: string
  department: string
  year: string
  phq9: number
  lastUpdated: string
}

const initialStudents: Student[] = [
  { id: "s1", name: "Aarav Shah", department: "Computer Science", year: "3", phq9: 7, lastUpdated: "2025-09-01" },
  { id: "s2", name: "Isha Gupta", department: "Mechanical", year: "2", phq9: 12, lastUpdated: "2025-09-09" },
  { id: "s3", name: "Rahul Verma", department: "Electrical", year: "1", phq9: 4, lastUpdated: "2025-09-03" },
  { id: "s4", name: "Neha Singh", department: "Computer Science", year: "4", phq9: 18, lastUpdated: "2025-09-07" },
  { id: "s5", name: "Karan Patel", department: "Civil", year: "2", phq9: 9, lastUpdated: "2025-09-05" },
  { id: "s6", name: "Priya Nair", department: "Computer Science", year: "1", phq9: 2, lastUpdated: "2025-09-10" },
]

function severityBucket(score: number) {
  if (score <= 4) return "Minimal"
  if (score <= 9) return "Mild"
  if (score <= 14) return "Moderate"
  if (score <= 19) return "Mod. Severe"
  return "Severe"
}

export default function AdminDashboardPage() {
  const [query, setQuery] = useState("")
  const [dept, setDept] = useState("All")
  const [year, setYear] = useState("All")
  const students = initialStudents

  const departments = useMemo(() => ["All", ...Array.from(new Set(students.map(s => s.department)))], [students])
  const years = ["All", "1", "2", "3", "4"]

  const filtered = useMemo(() => {
    return students.filter(s =>
      (dept === "All" || s.department === dept) &&
      (year === "All" || s.year === year) &&
      (query.trim() === "" || s.name.toLowerCase().includes(query.toLowerCase()))
    )
  }, [students, dept, year, query])

  const dist = useMemo(() => {
    const buckets: Record<string, number> = { "Minimal": 0, "Mild": 0, "Moderate": 0, "Mod. Severe": 0, "Severe": 0 }
    filtered.forEach(s => { buckets[severityBucket(s.phq9)]++ })
    return Object.entries(buckets).map(([key, value]) => ({ severity: key, count: value }))
  }, [filtered])

  const avgScore = useMemo(() => {
    if (!filtered.length) return 0
    return Math.round((filtered.reduce((a, s) => a + s.phq9, 0) / filtered.length) * 10) / 10
  }, [filtered])

  return (
    <div className="min-h-screen w-full p-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Track student wellbeing across your college</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => window.location.assign("/")}>Back to site</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Search and segment students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <Label htmlFor="search">Search by name</Label>
                <Input id="search" placeholder="Type a name" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="dept">Department</Label>
                <select id="dept" value={dept} onChange={(e) => setDept(e.target.value)} className="w-full h-10 rounded-md border bg-background px-3">
                  {departments.map(d => (<option key={d} value={d}>{d}</option>))}
                </select>
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <select id="year" value={year} onChange={(e) => setYear(e.target.value)} className="w-full h-10 rounded-md border bg-background px-3">
                  {years.map(y => (<option key={y} value={y}>{y}</option>))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Severity distribution</CardTitle>
              <CardDescription>Based on latest PHQ-9 scores</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dist}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="severity" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Students" fill="#8b5cf6" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>Current selection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between"><span>Students</span><span className="font-semibold">{filtered.length}</span></div>
              <div className="flex items-center justify-between"><span>Average PHQ-9</span><span className="font-semibold">{avgScore}</span></div>
              <div>
                <div className="mb-1 text-sm">Wellbeing Index</div>
                <Progress value={Math.max(0, 100 - Math.min(100, avgScore * 4))} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
            <CardDescription>Latest PHQ-9 results by student</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Department</th>
                    <th className="py-2 pr-4">Year</th>
                    <th className="py-2 pr-4">PHQ-9</th>
                    <th className="py-2 pr-4">Severity</th>
                    <th className="py-2 pr-4">Updated</th>
                    <th className="py-2 pr-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => {
                    const sev = severityBucket(s.phq9)
                    return (
                      <tr key={s.id} className="border-b last:border-b-0 hover:bg-muted/30">
                        <td className="py-2 pr-4 font-medium">{s.name}</td>
                        <td className="py-2 pr-4">{s.department}</td>
                        <td className="py-2 pr-4">{s.year}</td>
                        <td className="py-2 pr-4">{s.phq9}</td>
                        <td className="py-2 pr-4">{sev}</td>
                        <td className="py-2 pr-4">{s.lastUpdated}</td>
                        <td className="py-2 pr-2 text-right">
                          <Button size="sm" variant="outline">View</Button>
                        </td>
                      </tr>
                    )
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-muted-foreground">No students match the current filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
