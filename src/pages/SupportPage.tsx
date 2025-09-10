import { useState } from "react"
import { motion } from "framer-motion"
import { Users, Send, Heart, MessageCircle, Shield, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const supportGroups = [
  {
    name: "Jammu College Anxiety Support",
    members: 342,
    description: "A safe space for students to share experiences and coping strategies",
    meetingTime: "Tuesdays 7PM EST",
    tags: ["Anxiety", "Coping Skills", "Weekly"]
  },
  {
    name: "Anxiety Recovery Group",
    members: 189,
    description: "Supporting each other through depression recovery journey",
    meetingTime: "Thursdays 6PM EST",
    tags: ["Depression", "Recovery", "Peer Support"]
  },
  {
    name: "Mindfulness & Meditation",
    members: 567,
    description: "Practice mindfulness together and share meditation experiences",
    meetingTime: "Daily 8AM EST",
    tags: ["Mindfulness", "Meditation", "Daily Practice"]
  },
  {
    name: "Depression Support Circle",
    members: 298,
    description: "Mental health support specifically for depression",
    meetingTime: "Saturdays 4PM EST",
    tags: ["Depression", "Community", "Identity"]
  }
]

const SupportPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    supportType: "",
    experience: "",
    availability: "",
    anonymous: false,
    agreement: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Support form submitted:", formData)
  }

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
            <Users className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Peer Support Network</h1>
            <p className="text-lg text-muted-foreground">
              Connect with others on similar journeys and find strength in community
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Support Groups */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold mb-4">Available Support Groups</h2>
              <div className="space-y-4">
                {supportGroups.map((group, index) => (
                  <motion.div
                    key={group.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Card className="hover:shadow-[var(--shadow-medium)] transition-all duration-200">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              <MessageCircle className="h-5 w-5" />
                              {group.name}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {group.description}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{group.members}</p>
                            <p className="text-xs text-muted-foreground">members</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Shield className="h-4 w-4" />
                            {group.meetingTime}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {group.tags.map((tag) => (
                              <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <Button className="w-full">
                            <Users className="h-4 w-4 mr-2" />
                            Join Group
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Support Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Join Our Support Network</CardTitle>
                <CardDescription>
                  Fill out this form to connect with peer support opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age Range</Label>
                      <Select onValueChange={(value) => setFormData({...formData, age: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select age range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="18-25">18-25</SelectItem>
                          <SelectItem value="26-35">26-35</SelectItem>
                          <SelectItem value="36-45">36-45</SelectItem>
                          <SelectItem value="46-55">46-55</SelectItem>
                          <SelectItem value="55+">55+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Type of Support You're Seeking</Label>
                    <Select onValueChange={(value) => setFormData({...formData, supportType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select support type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="anxiety">Anxiety Support</SelectItem>
                        <SelectItem value="depression">Depression Support</SelectItem>
                        <SelectItem value="trauma">Trauma Recovery</SelectItem>
                        <SelectItem value="addiction">Addiction Recovery</SelectItem>
                        <SelectItem value="relationships">Relationship Issues</SelectItem>
                        <SelectItem value="general">General Mental Health</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Share Your Experience (Optional)</Label>
                    <Textarea
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: e.target.value})}
                      placeholder="Tell us a bit about your journey or what you hope to gain from peer support..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Availability</Label>
                    <Select onValueChange={(value) => setFormData({...formData, availability: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="When are you available?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekday-morning">Weekday Mornings</SelectItem>
                        <SelectItem value="weekday-evening">Weekday Evenings</SelectItem>
                        <SelectItem value="weekend">Weekends</SelectItem>
                        <SelectItem value="flexible">Flexible Schedule</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="anonymous" 
                        checked={formData.anonymous}
                        onCheckedChange={(checked) => setFormData({...formData, anonymous: !!checked})}
                      />
                      <Label htmlFor="anonymous" className="text-sm">
                        I prefer to participate anonymously
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="agreement" 
                        checked={formData.agreement}
                        onCheckedChange={(checked) => setFormData({...formData, agreement: !!checked})}
                      />
                      <Label htmlFor="agreement" className="text-sm">
                        I agree to maintain confidentiality and respect group guidelines
                      </Label>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={!formData.name || !formData.email || !formData.agreement}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit Application
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                  <Star className="h-5 w-5" />
                  Community Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                  <li>• Maintain confidentiality and respect privacy</li>
                  <li>• Practice empathy and active listening</li>
                  <li>• Avoid giving medical advice</li>
                  <li>• Be supportive and non-judgmental</li>
                  <li>• Respect diverse backgrounds and experiences</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default SupportPage