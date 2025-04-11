"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function RemindersCard({ data, loading }) {
  const [completedReminders, setCompletedReminders] = useState([])

  const toggleReminderCompletion = (index) => {
    if (completedReminders.includes(index)) {
      setCompletedReminders(completedReminders.filter((i) => i !== index))
    } else {
      setCompletedReminders([...completedReminders, index])
    }
  }

  // Function to extract time from reminder text
  const extractTime = (text) => {
    return text.split(":")[0]
  }

  // Function to extract task from reminder text
  const extractTask = (text) => {
    const colonIndex = text.indexOf(":")
    if (colonIndex !== -1) {
      return text.substring(colonIndex + 2)
    }
    return text
  }

  // Function to determine reminder type
  const getReminderType = (text) => {
    const lowerText = text.toLowerCase()
    if (lowerText.includes("medication")) return "medication"
    if (lowerText.includes("exercise")) return "exercise"
    if (lowerText.includes("hydration") || lowerText.includes("drink water")) return "hydration"
    if (lowerText.includes("appointment")) return "appointment"
    return "other"
  }

  // Function to determine if a reminder is upcoming, current, or past
  const getReminderStatus = (timeStr) => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    // Parse the time string (e.g., "8:00:00")
    const timeParts = timeStr.match(/(\d+):(\d+):(\d+)/)
    if (!timeParts) return "unknown"

    const hour = Number.parseInt(timeParts[1])
    const minute = Number.parseInt(timeParts[2])

    // Compare with current time
    if (hour < currentHour || (hour === currentHour && minute < currentMinute)) {
      return "past"
    } else if (hour === currentHour && Math.abs(minute - currentMinute) <= 30) {
      return "current"
    } else {
      return "upcoming"
    }
  }

  // Function to get acknowledgment status
  const getAcknowledgmentStatus = (text) => {
    if (text.includes("(Acknowledged)")) return "acknowledged"
    if (text.includes("(Sent but not acknowledged)")) return "sent"
    return "pending"
  }

  return (
    <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <Bell className="mr-2 h-6 w-6 text-amber-500" />
          Daily Reminders
        </CardTitle>
        <CardDescription className="dark:text-gray-400">
          Keep track of your medications and important tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Loading reminders...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {data &&
                data.map((reminder, index) => {
                  const time = extractTime(reminder)
                  const task = extractTask(reminder)
                  const type = getReminderType(task)
                  const status = getReminderStatus(time)
                  const acknowledgment = getAcknowledgmentStatus(task)
                  const isCompleted = completedReminders.includes(index) || acknowledgment === "acknowledged"

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border flex items-start justify-between ${
                        isCompleted
                          ? "bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600"
                          : status === "current"
                            ? "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
                            : status === "upcoming"
                              ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                              : "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`mt-1 ${
                            isCompleted
                              ? "text-green-500 dark:text-green-400"
                              : status === "current"
                                ? "text-amber-500 dark:text-amber-400"
                                : status === "upcoming"
                                  ? "text-blue-500 dark:text-blue-400"
                                  : "text-gray-400 dark:text-gray-500"
                          }`}
                        >
                          {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                        </div>
                        <div>
                          <p
                            className={`font-medium ${isCompleted ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-gray-100"}`}
                          >
                            {time}
                          </p>
                          <p
                            className={
                              isCompleted
                                ? "line-through text-gray-500 dark:text-gray-400"
                                : "text-gray-700 dark:text-gray-300"
                            }
                          >
                            {task}
                          </p>

                          {/* Type-specific instructions */}
                          {type === "medication" && !isCompleted && (
                            <div className="mt-2 text-sm bg-gray-50 p-2 rounded border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                              <strong>Instructions:</strong> Take with a full glass of water.
                            </div>
                          )}
                          {type === "hydration" && !isCompleted && (
                            <div className="mt-2 text-sm bg-gray-50 p-2 rounded border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                              <strong>Instructions:</strong> Drink at least 8 ounces of water.
                            </div>
                          )}
                          {type === "exercise" && !isCompleted && (
                            <div className="mt-2 text-sm bg-gray-50 p-2 rounded border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                              <strong>Instructions:</strong> Perform gentle stretching exercises for 10-15 minutes.
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant={isCompleted ? "outline" : "default"}
                        size="sm"
                        className={
                          isCompleted
                            ? "border-green-500 text-green-600 dark:border-green-600 dark:text-green-400"
                            : "bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700"
                        }
                        onClick={() => toggleReminderCompletion(index)}
                        disabled={acknowledgment === "acknowledged"}
                      >
                        {isCompleted ? "Undo" : "Complete"}
                      </Button>
                    </div>
                  )
                })}
            </div>

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                className="border-amber-500 text-amber-600 dark:border-amber-600 dark:text-amber-400"
              >
                Add Reminder
              </Button>
              <Button variant="outline" className="border-gray-300 dark:border-gray-600 dark:text-gray-300">
                View Calendar
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
