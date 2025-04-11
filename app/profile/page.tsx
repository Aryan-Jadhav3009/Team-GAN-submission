"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { User, Settings, FileText, Bell, Shield, Phone } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"

export default function ProfilePage() {
  const [personalInfo, setPersonalInfo] = useState({
    name: "John Doe",
    age: "72",
    phone: "(555) 123-4567",
    email: "john.doe@example.com",
    address: "123 Main St, Anytown, USA 12345",
    emergencyContact: "Sarah Johnson (Daughter) - (555) 987-6543",
  })

  const [medicalInfo, setMedicalInfo] = useState({
    conditions: "Hypertension, Type 2 Diabetes",
    medications: "Lisinopril 10mg (morning), Metformin 500mg (morning and evening), Aspirin 81mg (morning)",
    allergies: "Penicillin, Shellfish",
    primaryDoctor: "Dr. Emily Roberts - (555) 789-0123",
    lastCheckup: "March 15, 2023",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    medicationReminders: true,
    appointmentReminders: true,
    healthAlerts: true,
    caregiverUpdates: true,
    textMessages: true,
    emailNotifications: false,
    phoneCallAlerts: true,
  })

  const handlePersonalInfoChange = (e) => {
    setPersonalInfo({
      ...personalInfo,
      [e.target.name]: e.target.value,
    })
  }

  const handleMedicalInfoChange = (e) => {
    setMedicalInfo({
      ...medicalInfo,
      [e.target.name]: e.target.value,
    })
  }

  const handleNotificationToggle = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid grid-cols-3 gap-4 bg-transparent">
            <TabsTrigger
              value="personal"
              className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg py-3 text-base"
            >
              <User className="mr-2 h-5 w-5" />
              Personal Information
            </TabsTrigger>
            <TabsTrigger
              value="medical"
              className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg py-3 text-base"
            >
              <FileText className="mr-2 h-5 w-5" />
              Medical Information
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg py-3 text-base"
            >
              <Settings className="mr-2 h-5 w-5" />
              Notification Settings
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Personal Information</CardTitle>
                <CardDescription>Update your personal details and emergency contacts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={personalInfo.name} onChange={handlePersonalInfoChange} />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" name="age" value={personalInfo.age} onChange={handlePersonalInfoChange} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" value={personalInfo.phone} onChange={handlePersonalInfoChange} />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={personalInfo.email}
                      onChange={handlePersonalInfoChange}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="address">Home Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={personalInfo.address}
                    onChange={handlePersonalInfoChange}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Textarea
                    id="emergencyContact"
                    name="emergencyContact"
                    value={personalInfo.emergencyContact}
                    onChange={handlePersonalInfoChange}
                  />
                  <p className="text-sm text-gray-500">Please include name, relationship, and phone number</p>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medical Information Tab */}
          <TabsContent value="medical">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Medical Information</CardTitle>
                <CardDescription>Update your health conditions, medications, and healthcare providers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="conditions">Health Conditions</Label>
                  <Textarea
                    id="conditions"
                    name="conditions"
                    value={medicalInfo.conditions}
                    onChange={handleMedicalInfoChange}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="medications">Medications</Label>
                  <Textarea
                    id="medications"
                    name="medications"
                    value={medicalInfo.medications}
                    onChange={handleMedicalInfoChange}
                  />
                  <p className="text-sm text-gray-500">Please include dosage and schedule</p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    name="allergies"
                    value={medicalInfo.allergies}
                    onChange={handleMedicalInfoChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="primaryDoctor">Primary Doctor</Label>
                    <Input
                      id="primaryDoctor"
                      name="primaryDoctor"
                      value={medicalInfo.primaryDoctor}
                      onChange={handleMedicalInfoChange}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="lastCheckup">Last Checkup</Label>
                    <Input
                      id="lastCheckup"
                      name="lastCheckup"
                      value={medicalInfo.lastCheckup}
                      onChange={handleMedicalInfoChange}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Notification Settings</CardTitle>
                <CardDescription>Customize how and when you receive alerts and reminders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Alert Types</h3>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-amber-500" />
                      <div>
                        <p className="font-medium">Medication Reminders</p>
                        <p className="text-sm text-gray-500">Receive alerts when it's time to take your medication</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.medicationReminders}
                      onCheckedChange={() => handleNotificationToggle("medicationReminders")}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Appointment Reminders</p>
                        <p className="text-sm text-gray-500">Receive alerts about upcoming doctor appointments</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.appointmentReminders}
                      onCheckedChange={() => handleNotificationToggle("appointmentReminders")}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium">Health Alerts</p>
                        <p className="text-sm text-gray-500">
                          Receive alerts about important changes in your health metrics
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.healthAlerts}
                      onCheckedChange={() => handleNotificationToggle("healthAlerts")}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Caregiver Updates</p>
                        <p className="text-sm text-gray-500">
                          Allow caregivers to receive updates about your health status
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.caregiverUpdates}
                      onCheckedChange={() => handleNotificationToggle("caregiverUpdates")}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium">Notification Methods</h3>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                      <div>
                        <p className="font-medium">Text Messages</p>
                        <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.textMessages}
                      onCheckedChange={() => handleNotificationToggle("textMessages")}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={() => handleNotificationToggle("emailNotifications")}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Phone Call Alerts</p>
                        <p className="text-sm text-gray-500">Receive critical alerts via automated phone calls</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.phoneCallAlerts}
                      onCheckedChange={() => handleNotificationToggle("phoneCallAlerts")}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-blue-600 hover:bg-blue-700">Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
