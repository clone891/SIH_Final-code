import { motion } from "framer-motion"
import { HelpCircle, Book, Video, Headphones, FileText, ExternalLink, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const resources = [
  {
    category: "Articles",
    icon: FileText,
    items: [
      {
        title: "Understanding Anxiety: A Complete Guide",
        description: "Learn about anxiety symptoms, causes, and evidence-based treatment options",
        type: "Article",
        duration: "10 min read",
        popular: true
      },
      {
        title: "Building Resilience in Difficult Times",
        description: "Practical strategies to develop mental resilience and cope with challenges",
        type: "Article",
        duration: "8 min read"
      },
      {
        title: "The Science of Sleep and Mental Health",
        description: "How sleep affects your mental wellbeing and tips for better sleep hygiene",
        type: "Article",
        duration: "12 min read"
      }
    ]
  },
  {
    category: "Videos",
    icon: Video,
    items: [
      {
        title: "Guided Meditation for Beginners",
        description: "A gentle introduction to meditation practice with step-by-step guidance",
        type: "Video",
        duration: "15 min",
        popular: true
      },
      {
        title: "Cognitive Behavioral Therapy Basics",
        description: "Understanding CBT techniques and how they can help manage negative thoughts",
        type: "Video",
        duration: "22 min"
      },
      {
        title: "Mindful Breathing Exercises",
        description: "Learn various breathing techniques to manage stress and anxiety",
        type: "Video",
        duration: "18 min"  
      }
    ]
  },
  {
    category: "Podcasts",
    icon: Headphones,
    items: [
      {
        title: "Mental Health Matters",
        description: "Weekly discussions with mental health professionals about various topics",
        type: "Podcast",
        duration: "45 min episodes"
      },
      {
        title: "Therapy for Black Girls",
        description: "Mental health discussions centered on the experiences of Black women",
        type: "Podcast",
        duration: "30 min episodes",
        popular: true
      },
      {
        title: "The Hilarious World of Depression",
        description: "Comedians discuss their experiences with depression and mental health",
        type: "Podcast",
        duration: "40 min episodes"
      }
    ]
  }
]

const faqItems = [
  {
    question: "How do I know if I need professional help?",
    answer: "Consider seeking professional help if you experience persistent symptoms that interfere with daily life, such as ongoing sadness, anxiety, changes in sleep or appetite, or thoughts of self-harm."
  },
  {
    question: "What's the difference between therapy and counseling?",
    answer: "While often used interchangeably, therapy typically refers to longer-term treatment addressing deeper psychological issues, while counseling may focus on specific problems or life transitions."
  },
  {
    question: "Is online therapy as effective as in-person therapy?",
    answer: "Research shows that online therapy can be just as effective as in-person therapy for many conditions, offering convenience and accessibility while maintaining therapeutic quality."
  },
  {
    question: "How long does therapy typically take?",
    answer: "The length of therapy varies greatly depending on individual needs, goals, and the type of therapy. Some people benefit from short-term therapy (6-20 sessions), while others engage in longer-term treatment."
  },
  {
    question: "What should I expect in my first therapy session?",
    answer: "First sessions typically involve discussing your concerns, medical history, and goals for therapy. Your therapist will explain their approach and you'll work together to create a treatment plan."
  }
]

const HelpPage = () => {
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
            <HelpCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Health & Support Resources</h1>
            <p className="text-lg text-muted-foreground">
              Educational content and answers to help you on your mental health journey
            </p>
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Search for topics, symptoms, or questions..." 
                    className="pl-10"
                  />
                </div>
                <Button>Search</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs defaultValue="resources" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="resources">Learning Resources</TabsTrigger>
              <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="resources" className="space-y-6 mt-6">
              {resources.map((category, categoryIndex) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + categoryIndex * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <category.icon className="h-5 w-5" />
                        {category.category}
                      </CardTitle>
                      <CardDescription>
                        Educational {category.category.toLowerCase()} to support your mental health journey
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.items.map((item, index) => (
                          <div key={item.title} className="p-4 rounded-xl border hover:shadow-[var(--shadow-soft)] transition-all duration-200">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-foreground line-clamp-2">{item.title}</h4>
                              {item.popular && (
                                <Badge variant="secondary" className="text-xs">
                                  Popular
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {item.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {item.duration}
                              </span>
                              <Button variant="outline" size="sm">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="faq" className="space-y-4 mt-6">
              {faqItems.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Quick Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary">Need Immediate Support?</CardTitle>
              <CardDescription>
                If you're experiencing a mental health crisis, help is available 24/7
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Crisis Resources
                </Button>
                <Button variant="outline">
                  <Book className="h-4 w-4 mr-2" />
                  Self-Help Guide
                </Button>
                <Button variant="outline">
                  <Video className="h-4 w-4 mr-2" />
                  Guided Exercises
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default HelpPage