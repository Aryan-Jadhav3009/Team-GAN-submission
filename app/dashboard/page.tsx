"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Shield, Users, AlertTriangle, Clock, Activity, ChevronRight, Bot } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import HealthMetricsCard from "@/components/health-metrics-card"
import RemindersCard from "@/components/reminders-card"
import SafetyAlertsCard from "@/components/safety-alerts-card"
import AIAssistant from "@/components/ai-assistant"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const [data, setData] = useState({
    reminders: [],
    health: [],
    health_insights: [],
    safety: [],
    safety_analysis: [],
    caregiver: "",
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [error, setError] = useState("")
  const { toast } = useToast()

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/health-data")

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`)
        }

        const fetchedData = await response.json()
        setData(fetchedData)
        setLoading(false)
        setError("") // Clear any previous errors
      } catch (error) {
        console.error("Error fetching health data:", error)
        setError("Unable to fetch health data. Using mock data instead.")
        setLoading(false)

        toast({
          title: "Connection Error",
          description: "Unable to connect to the health data service. Using cached data.",
          variant: "destructive",
        })
      }
    }

    fetchData()
  }, [toast])

  const hasFallAlert = data.safety && data.safety.some((alert) => alert.includes("fall was detected"))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert className="mb-6 border-red-600 bg-red-50 dark:bg-red-900/20">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <AlertTitle className="text-red-600 dark:text-red-400 text-lg font-semibold">Error</AlertTitle>
            <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
          </Alert>
        )}

        {/* Emergency Alert - Only show if there's a fall detected */}
        {hasFallAlert && (
          <Alert className="mb-6 border-red-600 bg-red-50 dark:bg-red-900/20">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <AlertTitle className="text-red-600 dark:text-red-400 text-lg font-semibold">Emergency Alert</AlertTitle>
            <AlertDescription className="text-red-700 dark:text-red-300">
              A fall has been detected. Emergency services and your caregiver have been notified.
              <Button
                variant="outline"
                className="mt-2 border-red-600 text-red-600 hover:bg-red-100 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-900/30"
              >
                Cancel Alert
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 gap-4 bg-transparent">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-gray-800 rounded-lg py-3 text-base"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="health"
              className="data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-gray-800 rounded-lg py-3 text-base"
            >
              Health
            </TabsTrigger>
            <TabsTrigger
              value="reminders"
              className="data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-gray-800 rounded-lg py-3 text-base"
            >
              Reminders
            </TabsTrigger>
            <TabsTrigger
              value="safety"
              className="data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-gray-800 rounded-lg py-3 text-base"
            >
              Safety
            </TabsTrigger>
            <TabsTrigger
              value="assistant"
              className="data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-gray-800 rounded-lg py-3 text-base"
            >
              <Bot className="h-4 w-4 mr-1" />
              AI Assistant
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-l-4 border-l-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-blue-500" />
                    Today's Reminders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-gray-500 dark:text-gray-400">Loading reminders...</p>
                  ) : (
                    <ul className="space-y-2">
                      {data.reminders &&
                        data.reminders.slice(0, 2).map((reminder, index) => (
                          <li key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            {reminder}
                          </li>
                        ))}
                    </ul>
                  )}
                  <Button
                    variant="ghost"
                    className="mt-4 text-blue-600 dark:text-blue-400"
                    onClick={() => setActiveTab("reminders")}
                  >
                    View all reminders <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500 dark:bg-gray-800 dark:border-gray-700 dark:border-l-red-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <Activity className="mr-2 h-5 w-5 text-red-500" />
                    Health Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-gray-500 dark:text-gray-400">Loading health data...</p>
                  ) : (
                    <ul className="space-y-2">
                      {data.health &&
                        data.health.slice(0, 2).map((health, index) => (
                          <li key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            {health}
                          </li>
                        ))}
                    </ul>
                  )}
                  <Button
                    variant="ghost"
                    className="mt-4 text-red-600 dark:text-red-400"
                    onClick={() => setActiveTab("health")}
                  >
                    View all health data <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-l-4 border-l-amber-500 dark:bg-gray-800 dark:border-gray-700 dark:border-l-amber-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-amber-500" />
                    Safety Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-gray-500 dark:text-gray-400">Loading safety data...</p>
                  ) : (
                    <ul className="space-y-2">
                      {data.safety &&
                        data.safety.slice(0, 2).map((safety, index) => (
                          <li
                            key={index}
                            className={`p-3 rounded-lg ${
                              safety.includes("fall was detected")
                                ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                                : "bg-gray-50 dark:bg-gray-700"
                            }`}
                          >
                            {safety}
                          </li>
                        ))}
                    </ul>
                  )}
                  <Button
                    variant="ghost"
                    className="mt-4 text-amber-600 dark:text-amber-400"
                    onClick={() => setActiveTab("safety")}
                  >
                    View all safety alerts <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500 dark:bg-gray-800 dark:border-gray-700 dark:border-l-green-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <Users className="mr-2 h-5 w-5 text-green-500" />
                    Caregiver Updates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-gray-500 dark:text-gray-400">Loading caregiver updates...</p>
                  ) : (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">{data.caregiver}</div>
                  )}
                  <Button
                    variant="outline"
                    className="mt-4 border-green-500 text-green-600 hover:bg-green-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-900/20"
                  >
                    Contact Caregiver
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Health Tab */}
          <TabsContent value="health">
            <HealthMetricsCard data={data.health} insights={data.health_insights} loading={loading} />
          </TabsContent>

          {/* Reminders Tab */}
          <TabsContent value="reminders">
            <RemindersCard data={data.reminders} loading={loading} />
          </TabsContent>

          {/* Safety Tab */}
          <TabsContent value="safety">
            <SafetyAlertsCard data={data.safety} analysis={data.safety_analysis} loading={loading} />
          </TabsContent>

          {/* AI Assistant Tab */}
          <TabsContent value="assistant">
            <AIAssistant />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
