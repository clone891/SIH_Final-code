import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { User, Edit, Camera, Shield, Bell, Moon, Sun, Download, Trash2, Loader2, Check, X, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTheme } from "@/components/ThemeProvider"
import { useAuth } from "@/context/AuthContext"

const ProfilePage = () => {
  const { theme, setTheme } = useTheme()
  const { user, updateProfile, refreshProfile, loading: authLoading } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setSaving] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [profile, setProfile] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    bio: '',
    emergencyContact: '',
    profile_picture: ''
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsReminders: false,
    weeklyReports: true,
    anonymousData: false,
    darkMode: theme === "dark"
  })

  const stats = {
    totalSessions: 24,
    streakDays: 12,
    journalEntries: 45,
    goalsAchieved: 8
  }

  // Load user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        bio: user.bio || '',
        emergencyContact: user.emergencyContact || '',
        profile_picture: user.profile_picture || ''
      })
    }
  }, [user])

  // Check username availability with debounce
  useEffect(() => {
    if (!isEditing || !profile.username || profile.username === user?.username) {
      setUsernameAvailable(null)
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsCheckingUsername(true)
      try {
        // You'll need to implement this in your auth context
        const available = await checkUsernameAvailability(profile.username)
        setUsernameAvailable(available)
      } catch (error) {
        console.error('Failed to check username:', error)
        setUsernameAvailable(null)
      } finally {
        setIsCheckingUsername(false)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [profile.username, isEditing, user?.username])

  // Mock function - you'll need to implement this in your auth context
  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    // This should call your backend API
    const response = await fetch(`/api/auth/check-username/?username=${encodeURIComponent(username)}`)
    const data = await response.json()
    return data.available
  }

  const handleSave = async () => {
    if (!user) return

    // Validate username availability
    if (profile.username !== user.username && usernameAvailable === false) {
      setMessage({ type: 'error', text: 'Username is not available' })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      const updateData: any = {}
      
      // Only include changed fields
      if (profile.username !== user.username) updateData.username = profile.username
      if (profile.firstName !== user.firstName) updateData.firstName = profile.firstName
      if (profile.lastName !== user.lastName) updateData.lastName = profile.lastName
      if (profile.email !== user.email) updateData.email = profile.email
      if (profile.phone !== user.phone) updateData.phone = profile.phone
      if (profile.dateOfBirth !== user.dateOfBirth) updateData.dateOfBirth = profile.dateOfBirth
      if (profile.bio !== user.bio) updateData.bio = profile.bio
      if (profile.emergencyContact !== user.emergencyContact) updateData.emergencyContact = profile.emergencyContact

      if (Object.keys(updateData).length > 0) {
        await updateProfile(updateData)
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
      }
      
      setIsEditing(false)
      setUsernameAvailable(null)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' })
    } finally {
      setSaving(false)
    }
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' })
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setMessage({ type: 'error', text: 'Image size should be less than 5MB' })
      return
    }

    setIsUploading(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('profile_picture', file)

      const response = await fetch('/api/me/profile-picture/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}` // You might need to get token from auth context
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const data = await response.json()
      setProfile(prev => ({ ...prev, profile_picture: data.profile_picture }))
      await refreshProfile() // Refresh the user data
      setMessage({ type: 'success', text: 'Profile picture updated successfully!' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to upload image' })
    } finally {
      setIsUploading(false)
    }
  }

  const handlePreferenceChange = (key: string, value: boolean) => {
    if (key === "darkMode") {
      setTheme(value ? "dark" : "light")
    }
    setPreferences(prev => ({ ...prev, [key]: value }))
    // You can also save preferences to backend here
  }

  const getDisplayName = () => {
    const fullName = `${profile.firstName} ${profile.lastName}`.trim()
    return fullName || profile.username || 'User'
  }

  const getAvatarInitials = () => {
    if (profile.firstName && profile.lastName) {
      return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
    }
    return profile.username ? profile.username.slice(0, 2).toUpperCase() : 'U'
  }

  if (authLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 bg-gradient-subtle">
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
          >
            <User className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Profile</h1>
            <p className="text-lg text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </motion.div>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert className={message.type === 'error' ? 'border-red-500' : 'border-green-500'}>
              {message.type === 'error' ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardHeader className="text-center">
                <div className="relative mx-auto mb-4">
                  <Avatar className="w-24 h-24">
                    {profile.profile_picture ? (
                      <AvatarImage src={profile.profile_picture} alt="Profile" />
                    ) : null}
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {getAvatarInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
                <CardTitle>{getDisplayName()}</CardTitle>
                <CardDescription>@{profile.username}</CardDescription>
                <CardDescription className="text-sm">{profile.email}</CardDescription>
                <Badge variant="secondary" className="mt-2">
                  Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recent'}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 sm:gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">{stats.totalSessions}</p>
                    <p className="text-xs text-muted-foreground">Sessions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{stats.streakDays}</p>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{stats.journalEntries}</p>
                    <p className="text-xs text-muted-foreground">Journal Entries</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{stats.goalsAchieved}</p>
                    <p className="text-xs text-muted-foreground">Goals Met</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={isSaving}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <Input
                      id="username"
                      value={profile.username}
                      onChange={(e) => setProfile({...profile, username: e.target.value})}
                      disabled={!isEditing}
                      className="pr-10"
                    />
                    {isEditing && profile.username !== user?.username && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        {isCheckingUsername ? (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        ) : usernameAvailable === true ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : usernameAvailable === false ? (
                          <X className="h-4 w-4 text-red-500" />
                        ) : null}
                      </div>
                    )}
                  </div>
                  {isEditing && usernameAvailable === false && (
                    <p className="text-sm text-red-500">Username is not available</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) => setProfile({...profile, dateOfBirth: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    disabled={!isEditing}
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency">Emergency Contact</Label>
                  <Input
                    id="emergency"
                    value={profile.emergencyContact}
                    onChange={(e) => setProfile({...profile, emergencyContact: e.target.value})}
                    disabled={!isEditing}
                    placeholder="Name - Phone number"
                  />
                </div>

                {isEditing && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      onClick={handleSave} 
                      className="w-full sm:w-auto"
                      disabled={isSaving || (profile.username !== user?.username && usernameAvailable === false)}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsEditing(false)
                        setMessage(null)
                        setUsernameAvailable(null)
                        // Reset form to original values
                        if (user) {
                          setProfile({
                            username: user.username || '',
                            firstName: user.firstName || '',
                            lastName: user.lastName || '',
                            email: user.email || '',
                            phone: user.phone || '',
                            dateOfBirth: user.dateOfBirth || '',
                            bio: user.bio || '',
                            emergencyContact: user.emergencyContact || '',
                            profile_picture: user.profile_picture || ''
                          })
                        }
                      }}
                      className="w-full sm:w-auto"
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Settings & Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Settings & Preferences
                </CardTitle>
                <CardDescription>
                  Customize your app experience and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Notifications */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notifications
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                      <Switch
                        checked={preferences.emailNotifications}
                        onCheckedChange={(checked) => handlePreferenceChange("emailNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Reminders</p>
                        <p className="text-sm text-muted-foreground">Get session reminders via text</p>
                      </div>
                      <Switch
                        checked={preferences.smsReminders}
                        onCheckedChange={(checked) => handlePreferenceChange("smsReminders", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Weekly Progress Reports</p>
                        <p className="text-sm text-muted-foreground">Weekly summary of your progress</p>
                      </div>
                      <Switch
                        checked={preferences.weeklyReports}
                        onCheckedChange={(checked) => handlePreferenceChange("weeklyReports", checked)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Appearance */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    Appearance
                  </h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-muted-foreground">Switch to dark theme</p>
                    </div>
                    <Switch
                      checked={preferences.darkMode}
                      onCheckedChange={(checked) => handlePreferenceChange("darkMode", checked)}
                    />
                  </div>
                </div>

                <Separator />

                {/* Privacy */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Privacy
                  </h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Anonymous Data Collection</p>
                      <p className="text-sm text-muted-foreground">Help improve our services</p>
                    </div>
                    <Switch
                      checked={preferences.anonymousData}
                      onCheckedChange={(checked) => handlePreferenceChange("anonymousData", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Manage your data and account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Export My Data
                  </Button>
                  <Button variant="outline" className="w-full sm:w-auto text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Exported data includes your session history, progress tracking, and personal information. 
                  Account deletion is permanent and cannot be undone.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default ProfilePage