import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Heart, TrendingUp, TrendingDown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HealthMetricsCard({ data, insights, loading }) {
  // Function to extract heart rate, blood pressure, glucose, and oxygen values from the text
  const extractVitals = (text) => {
    const hrMatch = text.match(/heart rate is (\d+)/i)
    const bpMatch = text.match(/blood pressure is (\d+)\/(\d+)/i)
    const glucoseMatch = text.match(/glucose level requires attention/i)
    const oxygenMatch = text.match(/oxygen saturation requires attention/i)

    const timestamp = text.split(":")[0]

    return {
      hr: hrMatch ? Number.parseInt(hrMatch[1]) : null,
      systolic: bpMatch ? Number.parseInt(bpMatch[1]) : null,
      diastolic: bpMatch ? Number.parseInt(bpMatch[2]) : null,
      glucoseAlert: !!glucoseMatch,
      oxygenAlert: !!oxygenMatch,
      timestamp: timestamp,
    }
  }

  // Function to determine if a vital sign is normal, high, or low
  const getVitalStatus = (type, value) => {
    if (!value) return { status: "unknown", color: "text-gray-500 dark:text-gray-400" }

    if (type === "hr") {
      if (value < 60) return { status: "low", color: "text-blue-500 dark:text-blue-400" }
      if (value > 100) return { status: "high", color: "text-red-500 dark:text-red-400" }
      return { status: "normal", color: "text-green-500 dark:text-green-400" }
    }

    if (type === "systolic") {
      if (value < 90) return { status: "low", color: "text-blue-500 dark:text-blue-400" }
      if (value > 130) return { status: "high", color: "text-red-500 dark:text-red-400" }
      return { status: "normal", color: "text-green-500 dark:text-green-400" }
    }

    if (type === "diastolic") {
      if (value < 60) return { status: "low", color: "text-blue-500 dark:text-blue-400" }
      if (value > 80) return { status: "high", color: "text-red-500 dark:text-red-400" }
      return { status: "normal", color: "text-green-500 dark:text-green-400" }
    }

    return { status: "unknown", color: "text-gray-500 dark:text-gray-400" }
  }

  // Process the data to extract vital signs
  const processedData =
    loading || !data
      ? []
      : data.map((item) => {
          const vitals = extractVitals(item)
          const hrStatus = getVitalStatus("hr", vitals.hr)
          const systolicStatus = getVitalStatus("systolic", vitals.systolic)
          const diastolicStatus = getVitalStatus("diastolic", vitals.diastolic)

          return {
            ...vitals,
            hrStatus,
            systolicStatus,
            diastolicStatus,
            fullText: item,
          }
        })

  // Get the latest readings
  const latestReading = processedData.length > 0 ? processedData[processedData.length - 1] : null

  return (
    <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <Activity className="mr-2 h-6 w-6 text-red-500" />
          Health Metrics
        </CardTitle>
        <CardDescription className="dark:text-gray-400">
          Monitor your vital signs and track changes over time
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Loading health data...</p>
          </div>
        ) : (
          <>
            {/* AI Insights Section */}
            {insights && insights.length > 0 && (
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-start space-x-3">
                  <Sparkles className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-1">AI Health Insights</h4>
                    <div className="text-gray-800 dark:text-gray-200 whitespace-pre-line">{insights[0]}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Latest Readings Section */}
            {latestReading && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4 dark:text-gray-200">
                  Latest Readings ({latestReading.timestamp})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Heart className="h-5 w-5 text-red-500 mr-2" />
                        <span className="text-gray-700 dark:text-gray-300">Heart Rate</span>
                      </div>
                      <div className={`flex items-center ${latestReading.hrStatus.color}`}>
                        <span className="text-xl font-bold">{latestReading.hr}</span>
                        <span className="ml-1 text-sm">bpm</span>
                        {latestReading.hrStatus.status === "high" && <TrendingUp className="ml-1 h-4 w-4" />}
                        {latestReading.hrStatus.status === "low" && <TrendingDown className="ml-1 h-4 w-4" />}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {latestReading.hrStatus.status === "normal" && "Your heart rate is within the normal range."}
                      {latestReading.hrStatus.status === "high" && "Your heart rate is elevated. Consider resting."}
                      {latestReading.hrStatus.status === "low" && "Your heart rate is lower than normal."}
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg
                          className="h-5 w-5 text-blue-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300">Blood Pressure</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-xl font-bold ${latestReading.systolicStatus.color}`}>
                          {latestReading.systolic}
                        </span>
                        <span className="mx-1 text-gray-500 dark:text-gray-400">/</span>
                        <span className={`text-xl font-bold ${latestReading.diastolicStatus.color}`}>
                          {latestReading.diastolic}
                        </span>
                        <span className="ml-1 text-sm">mmHg</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {latestReading.systolicStatus.status === "normal" &&
                        latestReading.diastolicStatus.status === "normal" &&
                        "Your blood pressure is within the normal range."}
                      {(latestReading.systolicStatus.status === "high" ||
                        latestReading.diastolicStatus.status === "high") &&
                        "Your blood pressure is elevated. Monitor and consult your doctor if it persists."}
                      {(latestReading.systolicStatus.status === "low" ||
                        latestReading.diastolicStatus.status === "low") &&
                        "Your blood pressure is lower than normal."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* History Section */}
            <div>
              <h3 className="text-lg font-medium mb-4 dark:text-gray-200">History</h3>
              <ul className="space-y-3">
                {processedData.map((item, index) => (
                  <li
                    key={index}
                    className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <p className="text-gray-800 dark:text-gray-200">{item.fullText}</p>
                    {item.fullText.includes("requires attention") && (
                      <div className="mt-2 text-sm text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20 p-2 rounded">
                        <strong>Precaution:</strong> Please monitor your health metrics carefully. If readings remain
                        outside normal ranges, contact your healthcare provider.
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center mt-6">
              <Button className="bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700">
                Download Health Report
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
