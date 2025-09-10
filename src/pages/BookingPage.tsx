import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, User, MapPin, Video, Phone, MessageSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const therapists = [
  {
    id: 1,
    name: "Dr. Rahul Sharma",
    specialty: "Anxiety & Depression",
    experience: "8 years",
    rating: 4.9,
    availableSlots: ["10:00 AM", "2:00 PM", "4:00 PM"],
    sessionTypes: ["Video", "Phone", "In-Person"]
  },
  {
    id: 2,
    name: "Dr. shreya Mehta",
    specialty: "Trauma & PTSD",
    experience: "12 years",
    rating: 4.8,
    availableSlots: ["9:00 AM", "1:00 PM", "3:00 PM"],
    sessionTypes: ["Video", "In-Person"]
  },
  {
    id: 3,
    name: "Dr. Suraj Samanta",
    specialty: "Family & Relationships",
    experience: "6 years",
    rating: 4.9,
    availableSlots: ["11:00 AM", "2:30 PM", "5:00 PM"],
    sessionTypes: ["Video", "Phone", "In-Person"]
  }
]

const BookingPage = () => {
  const [selectedTherapist, setSelectedTherapist] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [sessionType, setSessionType] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "",
    preferences: ""
  })

  const handleBooking = () => {
    // Handle booking logic here
    console.log("Booking submitted:", {
      therapist: selectedTherapist,
      time: selectedTime,
      sessionType,
      ...formData
    })
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
            <Calendar className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Book a Counselling Session</h1>
            <p className="text-lg text-muted-foreground">
              Connect with licensed mental health professionals
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Therapist Selection */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold mb-4">Choose Your Therapist</h2>
              <div className="space-y-4">
                {therapists.map((therapist, index) => (
                  <motion.div
                    key={therapist.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Card 
                      className={`cursor-pointer hover:shadow-[var(--shadow-medium)] transition-all duration-200 ${
                        selectedTherapist === therapist.id ? 'ring-2 ring-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setSelectedTherapist(therapist.id)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              <User className="h-5 w-5" />
                              {therapist.name}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {therapist.specialty} • {therapist.experience} experience
                            </CardDescription>
                          </div>
                          <Badge variant="secondary">
                            ⭐ {therapist.rating}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium mb-2">Available Today:</p>
                            <div className="flex flex-wrap gap-2">
                              {therapist.availableSlots.map((slot) => (
                                <Badge key={slot} variant="outline" className="text-xs">
                                  {slot}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-2">Session Types:</p>
                            <div className="flex gap-2">
                              {therapist.sessionTypes.map((type) => (
                                <Badge key={type} variant="secondary" className="text-xs">
                                  {type === "Video" && <Video className="h-3 w-3 mr-1" />}
                                  {type === "Phone" && <Phone className="h-3 w-3 mr-1" />}
                                  {type === "In-Person" && <MapPin className="h-3 w-3 mr-1" />}
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
                <CardDescription>
                  Fill out your information to schedule your session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Time Selection */}
                {selectedTherapist && (
                  <div className="space-y-3">
                    <Label>Preferred Time</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                      <SelectContent>
                        {therapists.find(t => t.id === selectedTherapist)?.availableSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Session Type */}
                {selectedTherapist && (
                  <div className="space-y-3">
                    <Label>Session Type</Label>
                    <Select value={sessionType} onValueChange={setSessionType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose session type" />
                      </SelectTrigger>
                      <SelectContent>
                        {therapists.find(t => t.id === selectedTherapist)?.sessionTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Personal Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Session</Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    placeholder="Brief description of what you'd like to discuss..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferences">Special Preferences (Optional)</Label>
                  <Textarea
                    id="preferences"
                    value={formData.preferences}
                    onChange={(e) => setFormData({...formData, preferences: e.target.value})}
                    placeholder="Any specific requests or accommodations..."
                    rows={2}
                  />
                </div>

                <Button 
                  onClick={handleBooking}
                  className="w-full"
                  disabled={!selectedTherapist || !selectedTime || !sessionType || !formData.name || !formData.email}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Session
                </Button>
              </CardContent>
            </Card>

            {/* Insurance Notice */}
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800">
              <CardContent className="p-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Insurance:</strong> We accept most major insurance plans. 
                  Our team will verify your coverage and inform you of any costs before your session.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default BookingPage