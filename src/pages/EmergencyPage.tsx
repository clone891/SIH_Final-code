import { motion } from "framer-motion"
import { AlertTriangle, Phone, MessageSquare, MapPin, Clock, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const emergencyContacts = [
  {
    name: "India Suicide Helpline Directory | AASRA",
    number: "91-9820466726",
    description: "24/7 crisis support",
    type: "Crisis"
  },
  {
    name: "College helpline number",
    number: "xxxx xxxx 12",
    description: "Emergency college contact",
    type: "Support"
  },
  {
    name: "Emergency Services",
    number: "112",
    description: "National Helpline for sucide prevention",
    type: "Emergency"
  },
  {
    name: "National Helpline service",
    number: "102",
    description: "Emergency Ambulance assistance",
    type: "Emergency"
  }
]

const EmergencyPage = () => {
  return (
    <div className="h-full overflow-y-auto p-6 bg-gradient-subtle">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-4"
          >
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Emergency Resources</h1>
            <p className="text-lg text-muted-foreground">
              If you're in crisis, help is available 24/7. You are not alone.
            </p>
          </motion.div>
        </div>

        {/* Crisis Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-destructive bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Immediate Crisis Support
              </CardTitle>
              <CardDescription>
                If you're having thoughts of suicide or self-harm, please reach out immediately.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button 
                  size="lg" 
                  className="bg-destructive hover:bg-destructive/90"
                  onClick={() => window.open("tel:988")}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call 112
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.open("sms:741741?body=HOME")}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Text Crisis Line
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Emergency Contacts Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {emergencyContacts.map((contact, index) => (
            <motion.div
              key={contact.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="hover:shadow-[var(--shadow-medium)] transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{contact.name}</CardTitle>
                      <CardDescription className="mt-1">{contact.description}</CardDescription>
                    </div>
                    <Badge variant={contact.type === "Emergency" ? "destructive" : "secondary"}>
                      {contact.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-mono font-medium text-primary">
                      {contact.number}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (contact.number.includes("TEXT")) {
                          window.open("sms:741741?body=HOME")
                        } else {
                          window.open(`tel:${contact.number.replace(/\D/g, '')}`)
                        }
                      }}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Additional Support Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">24/7 Availability</h4>
                    <p className="text-sm text-muted-foreground">All crisis lines operate around the clock</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">Multiple Contact Methods</h4>
                    <p className="text-sm text-muted-foreground">Phone, text, and online chat available</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">Local Resources</h4>
                    <p className="text-sm text-muted-foreground">Can connect you with local support</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Safety Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center text-sm text-muted-foreground bg-muted/30 rounded-2xl p-4"
        >
          <p>
            Remember: Seeking help is a sign of strength, not weakness. 
            These resources are confidential and staffed by trained professionals.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default EmergencyPage