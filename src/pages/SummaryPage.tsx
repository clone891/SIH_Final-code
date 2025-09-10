import { motion } from "framer-motion"
import { FileText, Calendar, MessageCircle, TrendingUp, Clock, Download, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const chatSessions = [
  {
    id: 1,
    date: "2024-02-28",
    duration: "45 minutes",
    topic: "Anxiety Management",
    mood: "Anxious → Calmer",
    keyInsights: [
      "Identified work-related stress triggers",
      "Practiced breathing techniques",
      "Set boundaries for work-life balance"
    ],
    progress: "Positive",
    therapistNotes: "Patient showed good engagement with coping strategies"
  },
  {
    id: 2,
    date: "2024-02-25",
    duration: "38 minutes", 
    topic: "Sleep & Mood",
    mood: "Tired → Reflective",
    keyInsights: [
      "Connected sleep quality to mood changes",
      "Discussed sleep hygiene improvements",
      "Planned gradual bedtime routine changes"
    ],
    progress: "Stable",
    therapistNotes: "Making connections between physical and mental health"
  },
  {
    id: 3,
    date: "2024-02-22",
    duration: "42 minutes",
    topic: "Relationship Stress",
    mood: "Frustrated → Hopeful",
    keyInsights: [
      "Explored communication patterns",
      "Discussed assertiveness techniques",
      "Set goals for difficult conversation"
    ],
    progress: "Positive",
    therapistNotes: "Ready to implement new communication strategies"
  },
  {
    id: 4,
    date: "2024-02-18",
    duration: "50 minutes",
    topic: "Self-Worth & Confidence",
    mood: "Sad → Optimistic",
    keyInsights: [
      "Challenged negative self-talk patterns",
      "Identified personal strengths",
      "Created positive affirmation practice"
    ],
    progress: "Significant",
    therapistNotes: "Breakthrough session with emotional processing"
  }
]

const summaryStats = {
  totalSessions: 24,
  totalTime: "18 hours 30 minutes",
  averageSession: "46 minutes",
  topicsCovered: ["Anxiety", "Depression", "Relationships", "Self-Esteem", "Sleep", "Work Stress"],
  overallProgress: "Positive Trajectory",
  nextGoals: ["Maintain sleep routine", "Practice assertiveness", "Continue mindfulness"]
}

const SummaryPage = () => {
  return (
    <div className="h-full overflow-y-auto p-6 bg-gradient-subtle">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <FileText className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Chat Summary & Progress</h1>
            <p className="text-lg text-muted-foreground">
              Review your therapy sessions, insights, and progress over time
            </p>
          </motion.div>
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <TrendingUp className="h-5 w-5" />
                Your Journey Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{summaryStats.totalSessions}</p>
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{summaryStats.totalTime}</p>
                  <p className="text-sm text-muted-foreground">Total Time</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{summaryStats.averageSession}</p>
                  <p className="text-sm text-muted-foreground">Average Session</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{summaryStats.overallProgress}</p>
                  <p className="text-sm text-muted-foreground">Overall Progress</p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <div className="space-y-3">
                  <div>
                    <p className="font-medium mb-2">Topics Covered:</p>
                    <div className="flex flex-wrap gap-2">
                      {summaryStats.topicsCovered.map((topic) => (
                        <Badge key={topic} variant="secondary">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Next Session Goals:</p>
                    <ul className="text-sm text-muted-foreground">
                      {summaryStats.nextGoals.map((goal, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-primary rounded-full"></span>
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and Export */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                <SelectItem value="anxiety">Anxiety</SelectItem>
                <SelectItem value="depression">Depression</SelectItem>
                <SelectItem value="relationships">Relationships</SelectItem>
                <SelectItem value="self-esteem">Self-Esteem</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="recent">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Last 30 days</SelectItem>
                <SelectItem value="quarter">Last 3 months</SelectItem>
                <SelectItem value="all-time">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Summary
          </Button>
        </motion.div>

        {/* Session History */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Sessions</h2>
          {chatSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        {session.topic}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(session.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {session.duration}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={
                          session.progress === "Significant" ? "default" :
                          session.progress === "Positive" ? "secondary" : "outline"
                        }
                      >
                        {session.progress}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Mood Journey</h4>
                      <p className="text-sm text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg">
                        {session.mood}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Therapist Notes</h4>
                      <p className="text-sm text-muted-foreground italic">
                        "{session.therapistNotes}"
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Key Insights & Actions</h4>
                    <ul className="space-y-1">
                      {session.keyInsights.map((insight, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-1 h-1 bg-primary rounded-full mt-2"></span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Progress Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-green-700 dark:text-green-300">
                Progress Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-green-700 dark:text-green-300">
                <div>
                  <h4 className="font-medium mb-2">Strengths Observed:</h4>
                  <ul className="space-y-1">
                    <li>• Consistent engagement with coping strategies</li>
                    <li>• Growing self-awareness and insight</li>
                    <li>• Willingness to try new approaches</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Areas of Growth:</h4>
                  <ul className="space-y-1">
                    <li>• Improved emotional regulation</li>
                    <li>• Better stress management skills</li>
                    <li>• Enhanced communication abilities</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SummaryPage