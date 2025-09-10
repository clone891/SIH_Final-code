import { motion } from "framer-motion"
import { TrendingUp, Calendar, Heart, Brain, Target, Award } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const progressData = {
  overallScore: 72,
  weeklyImprovement: 8,
  streakDays: 12,
  completedSessions: 24,
  goals: [
    { name: "Daily Check-ins", current: 12, target: 14, percentage: 86 },
    { name: "Mindfulness Practice", current: 8, target: 10, percentage: 80 },
    { name: "Mood Tracking", current: 10, target: 14, percentage: 71 },
    { name: "Sleep Quality", current: 6, target: 7, percentage: 86 }
  ],
  achievements: [
    { name: "First Week Complete", icon: Award, earned: true },
    { name: "Mindfulness Master", icon: Brain, earned: true },
    { name: "Consistency Champion", icon: Target, earned: false },
    { name: "Wellness Warrior", icon: Heart, earned: false }
  ],
  moodTrend: [
    { date: "Mon", mood: 6 },
    { date: "Tue", mood: 7 },
    { date: "Wed", mood: 5 },
    { date: "Thu", mood: 8 },
    { date: "Fri", mood: 7 },
    { date: "Sat", mood: 8 },
    { date: "Sun", mood: 9 }
  ]
}

const ProgressPage = () => {
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
            <TrendingUp className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Progress</h1>
            <p className="text-lg text-muted-foreground">
              Track your mental health journey and celebrate your achievements
            </p>
          </motion.div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Overall Score", value: `${progressData.overallScore}%`, icon: TrendingUp, color: "text-primary" },
            { label: "Weekly Growth", value: `+${progressData.weeklyImprovement}%`, icon: Calendar, color: "text-green-500" },
            { label: "Current Streak", value: `${progressData.streakDays} days`, icon: Target, color: "text-orange-500" },
            { label: "Sessions Done", value: progressData.completedSessions, icon: Heart, color: "text-pink-500" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4 text-center">
                  <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-2`} />
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Goals Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Weekly Goals Progress
              </CardTitle>
              <CardDescription>
                Your progress towards this week's mental health goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {progressData.goals.map((goal, index) => (
                <div key={goal.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{goal.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {goal.current}/{goal.target}
                    </span>
                  </div>
                  <Progress value={goal.percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {goal.percentage}% complete
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Mood Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Mood Trend (This Week)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressData.moodTrend.map((day, index) => (
                    <div key={day.date} className="flex items-center gap-4">
                      <span className="text-sm font-medium w-8">{day.date}</span>
                      <div className="flex-1">
                        <Progress value={day.mood * 10} className="h-3" />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">
                        {day.mood}/10
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements
                </CardTitle>
                <CardDescription>
                  Milestones you've reached on your journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {progressData.achievements.map((achievement, index) => (
                  <div 
                    key={achievement.name}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${
                      achievement.earned 
                        ? 'bg-primary/5 border-primary/20' 
                        : 'bg-muted/30 border-muted'
                    }`}
                  >
                    <achievement.icon className={`h-6 w-6 ${
                      achievement.earned ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <span className={`font-medium ${
                      achievement.earned ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {achievement.name}
                    </span>
                    {achievement.earned && (
                      <Badge variant="secondary" className="ml-auto">
                        Earned
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Encouragement Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-center bg-primary/5 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-primary mb-2">
            You're doing great! 🌟
          </h3>
          <p className="text-muted-foreground">
            Every step forward is progress. Keep up the excellent work on your mental health journey.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default ProgressPage