import { motion } from "framer-motion"
import { Heart, Brain, Moon, Sun, Activity, Leaf, Zap, Coffee } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const wellnessActivities = [
  {
    title: "Guided Meditation",
    description: "5-minute mindfulness session to center yourself",
    duration: "5 min",
    icon: Brain,
    color: "text-purple-500",
    progress: 100
  },
  {
    title: "Breathing Exercise",
    description: "Deep breathing technique for anxiety relief",
    duration: "3 min",
    icon: Leaf,
    color: "text-green-500",
    progress: 75
  },
  {
    title: "Gratitude Journal",
    description: "Write down three things you're grateful for today",
    duration: "10 min",
    icon: Heart,
    color: "text-pink-500",
    progress: 50
  },
  {
    title: "Progressive Muscle Relaxation",
    description: "Tension release exercise for physical and mental relaxation",
    duration: "15 min",
    icon: Activity,
    color: "text-blue-500",
    progress: 25
  }
]

const dailyTips = [
  {
    title: "Stay Hydrated",
    description: "Drink water regularly to maintain mental clarity",
    icon: Coffee
  },
  {
    title: "Take Breaks",
    description: "Step away from screens every hour for mental rest",
    icon: Sun
  },
  {
    title: "Practice Gratitude",
    description: "Acknowledge three positive things from your day",
    icon: Heart
  },
  {
    title: "Get Enough Sleep",
    description: "Aim for 7-9 hours of quality sleep each night",
    icon: Moon
  }
]

const WellnessPage = () => {
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
            <Heart className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Wellness Hub</h1>
            <p className="text-lg text-muted-foreground">
              Your daily dose of mental health activities and self-care tools
            </p>
          </motion.div>
        </div>

        {/* Today's Focus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Zap className="h-5 w-5" />
                Today's Focus: Mindful Presence
              </CardTitle>
              <CardDescription>
                "Take time to be present in this moment. Notice your breath, your surroundings, and how you feel right now."
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Wellness Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4">Wellness Activities</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {wellnessActivities.map((activity, index) => (
              <motion.div
                key={activity.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="hover:shadow-[var(--shadow-medium)] transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <activity.icon className={`h-8 w-8 ${activity.color}`} />
                        <div>
                          <CardTitle className="text-lg">{activity.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {activity.description}
                          </CardDescription>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                        {activity.duration}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Today's Progress</span>
                        <span>{activity.progress}%</span>
                      </div>
                      <Progress value={activity.progress} className="h-2" />
                      <Button className="w-full" variant={activity.progress === 100 ? "secondary" : "default"}>
                        {activity.progress === 100 ? "Completed" : "Start Activity"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Daily Wellness Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                Daily Wellness Tips
              </CardTitle>
              <CardDescription>
                Simple habits to support your mental wellbeing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {dailyTips.map((tip, index) => (
                  <div key={tip.title} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
                    <tip.icon className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-medium text-foreground">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Wellness Check</CardTitle>
              <CardDescription>
                How are you feeling right now?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {["😊 Great", "😌 Good", "😐 Okay", "😟 Not Good", "😢 Struggling"].map((mood) => (
                  <Button key={mood} variant="outline" size="sm">
                    {mood}
                  </Button>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Regular check-ins help you stay aware of your emotional state and identify patterns.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default WellnessPage