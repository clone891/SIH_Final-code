import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Plus, Upload, Download, AlertTriangle } from "lucide-react"

interface Student {
  id: string
  name: string
  enrollmentNo: string
  college: string
  department: string
  year: string
  phq9: number
  lastUpdated: string
}

const initialStudents: Student[] = [
  { id: "s1", name: "Aarav Shah", enrollmentNo: "CS23A001", college: "Sahai Institute of Technology", department: "Computer Science", year: "3", phq9: 7, lastUpdated: "2025-09-01" },
  { id: "s2", name: "Isha Gupta", enrollmentNo: "ME22B014", college: "Sahai Institute of Technology", department: "Mechanical", year: "2", phq9: 12, lastUpdated: "2025-09-09" },
  { id: "s3", name: "Rahul Verma", enrollmentNo: "EE24C007", college: "National College of Engineering", department: "Electrical", year: "1", phq9: 4, lastUpdated: "2025-09-03" },
  { id: "s4", name: "Neha Singh", enrollmentNo: "CS21D112", college: "Sahai Institute of Technology", department: "Computer Science", year: "4", phq9: 18, lastUpdated: "2025-09-07" },
  { id: "s5", name: "Karan Patel", enrollmentNo: "CE22E089", college: "National College of Engineering", department: "Civil", year: "2", phq9: 9, lastUpdated: "2025-09-05" },
  { id: "s6", name: "Priya Nair", enrollmentNo: "CS24F034", college: "City University", department: "Computer Science", year: "1", phq9: 2, lastUpdated: "2025-09-10" },
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
  const [enrollment, setEnrollment] = useState("")
  const [dept, setDept] = useState("All")
  const [year, setYear] = useState("All")
  const [college, setCollege] = useState("All")
  const [students, setStudents] = useState<Student[]>(initialStudents)

  const [editOpen, setEditOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Student, "id">>({
    name: "",
    enrollmentNo: "",
    college: "",
    department: "",
    year: "1",
    phq9: 0,
    lastUpdated: new Date().toISOString().slice(0, 10)
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const departments = useMemo(() => ["All", ...Array.from(new Set(students.map(s => s.department)))], [students])
  const colleges = useMemo(() => ["All", ...Array.from(new Set(students.map(s => s.college)))], [students])
  const years = ["All", "1", "2", "3", "4"]

  const filtered = useMemo(() => {
    return students.filter(s =>
      (dept === "All" || s.department === dept) &&
      (year === "All" || s.year === year) &&
      (college === "All" || s.college === college) &&
      (query.trim() === "" || s.name.toLowerCase().includes(query.toLowerCase())) &&
      (enrollment.trim() === "" || s.enrollmentNo.toLowerCase().includes(enrollment.toLowerCase()))
    )
  }, [students, dept, year, college, query, enrollment])

  const dist = useMemo(() => {
    const buckets: Record<string, number> = { "Minimal": 0, "Mild": 0, "Moderate": 0, "Mod. Severe": 0, "Severe": 0 }
    filtered.forEach(s => { buckets[severityBucket(s.phq9)]++ })
    return Object.entries(buckets).map(([key, value]) => ({ severity: key, count: value }))
  }, [filtered])

  const avgScore = useMemo(() => {
    if (!filtered.length) return 0
    return Math.round((filtered.reduce((a, s) => a + s.phq9, 0) / filtered.length) * 10) / 10
  }, [filtered])

  const atRisk = useMemo(() => students.filter(s => s.phq9 >= 15).sort((a,b) => b.phq9 - a.phq9).slice(0, 5), [students])

  const triggerImport = () => fileInputRef.current?.click()

  const parseCsv = (text: string) => {
    const lines = text.split(/\r?\n/).filter(l => l.trim() !== "")
    if (lines.length < 2) return [] as Student[]
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase())
    const idx = (k: string) => headers.indexOf(k)
    const req = ["name","enrollmentno","college","department","year","phq9","lastupdated"]
    if (!req.every(k => idx(k) !== -1)) return [] as Student[]
    const rows = lines.slice(1).map((l,i) => {
      const c = l.split(",")
      const s: Student = {
        id: `imp_${Date.now()}_${i}`,
        name: c[idx("name")]?.trim() || "",
        enrollmentNo: c[idx("enrollmentno")]?.trim() || "",
        college: c[idx("college")]?.trim() || "",
        department: c[idx("department")]?.trim() || "",
        year: c[idx("year")]?.trim() || "",
        phq9: Number(c[idx("phq9")]) || 0,
        lastUpdated: c[idx("lastupdated")]?.trim() || new Date().toISOString().slice(0,10)
      }
      return s
    }).filter(s => s.name && s.enrollmentNo)
    return rows
  }

  const handleImportChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result || "")
      const rows = parseCsv(text)
      if (rows.length) {
        setStudents(prev => {
          const map = new Map(prev.map(p => [p.enrollmentNo.toLowerCase(), p]))
          rows.forEach(r => { map.set(r.enrollmentNo.toLowerCase(), { ...(map.get(r.enrollmentNo.toLowerCase()) || r), ...r }) })
          return Array.from(map.values())
        })
      }
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
    reader.readAsText(file)
  }

  const exportCsv = () => {
    const hdr = ["name","enrollmentNo","college","department","year","phq9","lastUpdated"].join(",")
    const rows = filtered.map(s => [s.name,s.enrollmentNo,s.college,s.department,s.year,String(s.phq9),s.lastUpdated].join(","))
    const csv = [hdr, ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "students.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const openAdd = () => {
    setEditingId(null)
    setForm({ name: "", enrollmentNo: "", college: "", department: "", year: "1", phq9: 0, lastUpdated: new Date().toISOString().slice(0,10) })
    setEditOpen(true)
  }

  const openEdit = (s: Student) => {
    setEditingId(s.id)
    const { id, ...rest } = s
    setForm(rest)
    setEditOpen(true)
  }

  const saveRecord = () => {
    const payload: Student = {
      id: editingId ?? `s_${Date.now()}`,
      ...form,
      phq9: Math.max(0, Math.min(27, Number(form.phq9)))
    }
    setStudents(prev => {
      const idx = prev.findIndex(p => p.enrollmentNo.toLowerCase() === payload.enrollmentNo.toLowerCase())
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], ...payload }
        return copy
      }
      return [payload, ...prev]
    })
    setEditOpen(false)
  }

  return (
    <div className="min-h-screen w-full p-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Track student wellbeing across your college</p>
          </div>
          <div className="flex items-center gap-2">
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleImportChange} />
            <Button onClick={openAdd} className="rounded-xl"><Plus className="h-4 w-4" /> Add Record</Button>
            <Button variant="secondary" onClick={triggerImport} className="rounded-xl"><Upload className="h-4 w-4" /> Import CSV</Button>
            <Button variant="outline" onClick={exportCsv} className="rounded-xl"><Download className="h-4 w-4" /> Export CSV</Button>
            <Button onClick={() => window.location.assign("/")} className="rounded-xl">Back to site</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Search and segment students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <div className="md:col-span-2">
                <Label htmlFor="search">Search by name</Label>
                <Input id="search" placeholder="Type a name" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="enrollment">Enrollment No.</Label>
                <Input id="enrollment" placeholder="e.g. CS23A001" value={enrollment} onChange={(e) => setEnrollment(e.target.value)} />
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
              <div>
                <Label htmlFor="college">College</Label>
                <select id="college" value={college} onChange={(e) => setCollege(e.target.value)} className="w-full h-10 rounded-md border bg-background px-3">
                  {colleges.map(c => (<option key={c} value={c}>{c}</option>))}
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-orange-500" /> At‑risk alerts</CardTitle>
              <CardDescription>PHQ‑9 ≥ 15</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {atRisk.length === 0 && <div className="text-sm text-muted-foreground">No at‑risk students.</div>}
              {atRisk.map(s => (
                <div key={s.id} className="flex items-center justify-between rounded-md border p-2">
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.enrollmentNo} • {s.department} • {s.college}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{s.phq9}</div>
                    <div className="text-xs text-muted-foreground">{s.lastUpdated}</div>
                  </div>
                </div>
              ))}
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
                    <th className="py-2 pr-4">Enrollment No.</th>
                    <th className="py-2 pr-4">College</th>
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
                        <td className="py-2 pr-4">{s.enrollmentNo}</td>
                        <td className="py-2 pr-4">{s.college}</td>
                        <td className="py-2 pr-4">{s.department}</td>
                        <td className="py-2 pr-4">{s.year}</td>
                        <td className="py-2 pr-4">{s.phq9}</td>
                        <td className="py-2 pr-4">{sev}</td>
                        <td className="py-2 pr-4">{s.lastUpdated}</td>
                        <td className="py-2 pr-2 text-right">
                          <Button size="sm" variant="outline" onClick={() => openEdit(s)}>Update</Button>
                        </td>
                      </tr>
                    )
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-6 text-center text-muted-foreground">No students match the current filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Update Student" : "Add Student"}</DialogTitle>
              <DialogDescription>Manage student record and latest PHQ‑9.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="enroll">Enrollment No.</Label>
                <Input id="enroll" value={form.enrollmentNo} onChange={(e) => setForm({ ...form, enrollmentNo: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="college">College</Label>
                <Input id="college" value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="dept2">Department</Label>
                <Input id="dept2" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="year2">Year</Label>
                <select id="year2" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="w-full h-10 rounded-md border bg-background px-3">
                  {["1","2","3","4"].map(y => (<option key={y} value={y}>{y}</option>))}
                </select>
              </div>
              <div>
                <Label htmlFor="phq">PHQ‑9</Label>
                <Input id="phq" type="number" min={0} max={27} value={form.phq9} onChange={(e) => setForm({ ...form, phq9: Number(e.target.value) })} />
              </div>
              <div>
                <Label htmlFor="date">Updated</Label>
                <Input id="date" type="date" value={form.lastUpdated} onChange={(e) => setForm({ ...form, lastUpdated: e.target.value })} />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="secondary" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button onClick={saveRecord} disabled={!form.name || !form.enrollmentNo}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
}
