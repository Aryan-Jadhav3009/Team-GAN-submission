import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, AlertTriangle, CheckCircle, PhoneCall, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SafetyAlertsCard({ data, analysis, loading }) {
  // Function to extract time from alert text
  const extractTime = (text) => {
    return text.split(":")[0]
  }

  // Function to extract location from alert text
  const extractLocation = (text) => {
    const locationMatch = text.match(/in the ([A-Za-z\s]+)/)
    return locationMatch ? locationMatch[1] : "Unknown"
  }

  // Function to check if an alert is a fall detection
  const isFallAlert = (text) => {
    return text.toLowerCase().includes("fall was detected")
  }

  // Function to extract impact level
  const extractImpactLevel = (text) => {
    const impactMatch = text.match(/with ([A-Za-z]+) impact/)
    return impactMatch ? impactMatch[1] : "Unknown"
  }

  // Count the number of fall alerts
  const fallAlertCount = loading || !data ? 0 : data.filter((alert) => isFallAlert(alert)).length

  return (
    <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <Shield className="mr-2 h-6 w-6 text-green-500" />
          Safety Monitoring
        </CardTitle>
        <CardDescription className="dark:text-gray-400">Track safety alerts and fall detection</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Loading safety data...</p>
          </div>
        ) : (
          <>
            {/* AI Analysis Section - Only show if there's a fall and analysis */}
            {fallAlertCount > 0 && analysis && analysis.length > 0 && (
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800 mb-4">
                <div className="flex items-start space-x-3">
                  <Sparkles className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-1">AI Safety Analysis</h4>
                    <div className="text-gray-800 dark:text-gray-200 whitespace-pre-line">{analysis[0]}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Summary Section */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3 dark:text-gray-200">Today's Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle
                        className={`h-5 w-5 ${fallAlertCount > 0 ? "text-red-500" : "text-green-500"} mr-2`}
                      />
                      <span className="text-gray-700 dark:text-gray-300">Fall Alerts</span>
                    </div>
                    <div
                      className={`text-xl font-bold ${fallAlertCount > 0 ? "text-red-500 dark:text-red-400" : "text-green-500 dark:text-green-400"}`}
                    >
                      {fallAlertCount}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {fallAlertCount === 0
                      ? "No falls detected today."
                      : fallAlertCount === 1
                        ? "1 fall has been detected today."
                        : `${fallAlertCount} falls have been detected today.`}
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-700 dark:text-gray-300">System Status</span>
                    </div>
                    <div className="text-green-500 dark:text-green-400 text-sm font-medium px-2.5 py-0.5 rounded bg-green-100 dark:bg-green-900/30">
                      Active
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    All monitoring systems are functioning properly.
                  </p>
                </div>
              </div>
            </div>

            {/* Active Alerts Section - Only show if there's a fall */}
            {fallAlertCount > 0 && (
              <Alert className="border-red-600 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <AlertTitle className="text-red-600 dark:text-red-400 text-lg font-semibold">
                  Emergency Alert
                </AlertTitle>
                <AlertDescription className="text-red-700 dark:text-red-300">
                  <p>A fall has been detected. Emergency services and your caregiver have been notified.</p>
                  <div className="mt-4 flex space-x-3">
                    <Button className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800">
                      <PhoneCall className="mr-2 h-4 w-4" />
                      Call Emergency
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-100 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-900/30"
                    >
                      Cancel Alert
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Safety Precautions */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">Safety Precautions</h3>
              <ul className="space-y-2 text-blue-700 dark:text-blue-300">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Keep walkways clear of clutter and cords</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Use nightlights in hallways and bathrooms</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Install grab bars in the bathroom and shower</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Wear non-slip footwear around the house</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Keep emergency numbers easily accessible</span>
                </li>
              </ul>
            </div>

            {/* Alert History */}
            <div>
              <h3 className="text-lg font-medium mb-4 dark:text-gray-200">Alert History</h3>
              <ul className="space-y-3">
                {data &&
                  data.map((alert, index) => {
                    const time = extractTime(alert)
                    const isFall = isFallAlert(alert)
                    const location = isFall ? extractLocation(alert) : ""
                    const impactLevel = isFall ? extractImpactLevel(alert) : ""

                    return (
                      <li
                        key={index}
                        className={`p-3 rounded-lg flex items-start space-x-3 ${
                          isFall
                            ? "bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800"
                            : "bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                        }`}
                      >
                        {isFall ? (
                          <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 mt-0.5" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5" />
                        )}
                        <div>
                          <p
                            className={`font-medium ${isFall ? "text-red-700 dark:text-red-300" : "text-gray-900 dark:text-gray-100"}`}
                          >
                            {time}
                          </p>
                          <p className={isFall ? "text-red-600 dark:text-red-300" : "text-gray-700 dark:text-gray-300"}>
                            {alert.substring(alert.indexOf(":") + 2)}
                          </p>

                          {isFall && (
                            <div className="mt-2 text-sm bg-white p-2 rounded border border-red-200 dark:bg-gray-800 dark:border-red-800 dark:text-gray-300">
                              <strong>Location:</strong> {location}
                              <br />
                              <strong>Impact Level:</strong> {impactLevel}
                              <br />
                              <strong>Actions taken:</strong> Emergency services were notified. Caregiver was contacted
                              and confirmed they would check on you.
                            </div>
                          )}
                        </div>
                      </li>
                    )
                  })}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
