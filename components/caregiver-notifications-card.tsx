import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageSquare, Phone, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function CaregiverNotificationsCard({ data, loading }) {
  // Mock caregiver data - in a real app, this would come from the backend
  const caregivers = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Primary Caregiver",
      avatar: "/placeholder.svg?height=40&width=40",
      lastContact: "Today, 2:15 PM",
      status: "available",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Family Member",
      avatar: "/placeholder.svg?height=40&width=40",
      lastContact: "Yesterday",
      status: "away",
    },
    {
      id: 3,
      name: "Dr. Emily Roberts",
      role: "Healthcare Provider",
      avatar: "/placeholder.svg?height=40&width=40",
      lastContact: "Monday, 10:30 AM",
      status: "busy",
    },
  ]

  return (
    <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <Users className="mr-2 h-6 w-6 text-blue-500" />
          Caregiver Connections
        </CardTitle>
        <CardDescription className="dark:text-gray-400">
          Stay in touch with your caregivers and healthcare providers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Loading caregiver data...</p>
          </div>
        ) : (
          <>
            {/* Latest Update */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">Latest Update</h3>
              <p className="text-blue-700 dark:text-blue-300">{data}</p>
            </div>

            {/* Caregivers List */}
            <div>
              <h3 className="text-lg font-medium mb-4 dark:text-gray-200">Your Care Team</h3>
              <ul className="space-y-4">
                {caregivers.map((caregiver) => (
                  <li
                    key={caregiver.id}
                    className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={caregiver.avatar} alt={caregiver.name} />
                          <AvatarFallback>
                            {caregiver.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{caregiver.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{caregiver.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            caregiver.status === "available"
                              ? "bg-green-500"
                              : caregiver.status === "away"
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }`}
                        ></span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {caregiver.status === "available"
                            ? "Available"
                            : caregiver.status === "away"
                              ? "Away"
                              : "Busy"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                      Last contact: {caregiver.lastContact}
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center dark:border-gray-600 dark:text-gray-300"
                      >
                        <MessageSquare className="mr-1 h-4 w-4" />
                        Message
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center dark:border-gray-600 dark:text-gray-300"
                      >
                        <Phone className="mr-1 h-4 w-4" />
                        Call
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center dark:border-gray-600 dark:text-gray-300"
                      >
                        <Video className="mr-1 h-4 w-4" />
                        Video
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg dark:bg-red-900/20 dark:border-red-800">
              <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">Emergency Contacts</h3>
              <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-red-700 dark:text-red-300">Emergency Services</p>
                    <p className="text-sm text-red-600 dark:text-red-400">911</p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800"
                  >
                    <Phone className="mr-1 h-4 w-4" />
                    Call
                  </Button>
                </li>
                <li className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-red-700 dark:text-red-300">Primary Caregiver</p>
                    <p className="text-sm text-red-600 dark:text-red-400">Sarah Johnson - (555) 123-4567</p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800"
                  >
                    <Phone className="mr-1 h-4 w-4" />
                    Call
                  </Button>
                </li>
                <li className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-red-700 dark:text-red-300">Healthcare Provider</p>
                    <p className="text-sm text-red-600 dark:text-red-400">Dr. Emily Roberts - (555) 987-6543</p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800"
                  >
                    <Phone className="mr-1 h-4 w-4" />
                    Call
                  </Button>
                </li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
