"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MessageSquare, Bot, Sparkles, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AIAssistant() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleQuestionSubmit = async (e) => {
    e.preventDefault()

    if (!question.trim()) {
      toast({
        title: "Empty Question",
        description: "Please enter a health-related question.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setAnswer("")

    try {
      const response = await fetch("/api/health-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      })

      if (!response.ok) {
        throw new Error("Failed to get answer")
      }

      const data = await response.json()
      setAnswer(
        data.answer || "I'm sorry, I couldn't understand that. Please try asking another health-related question.",
      )
    } catch (error) {
      console.error("Error getting AI response:", error)
      setAnswer("I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.")

      toast({
        title: "Connection Error",
        description: "Unable to connect to the AI service. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <Bot className="mr-2 h-6 w-6 text-purple-500" />
          Health Assistant
        </CardTitle>
        <CardDescription className="dark:text-gray-400">
          Ask me any health-related questions for personalized guidance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleQuestionSubmit} className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Ask a health question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              disabled={loading}
            />
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-800"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⋯</span>
                  Thinking...
                </span>
              ) : (
                <span className="flex items-center">
                  <ArrowRight className="h-4 w-4 mr-1" />
                  Ask
                </span>
              )}
            </Button>
          </div>
        </form>

        {answer && (
          <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-start space-x-3">
              <Sparkles className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-1">AI Response</h4>
                <div className="text-gray-800 dark:text-gray-200 whitespace-pre-line">{answer}</div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Example Questions</h4>
          <ul className="space-y-2">
            <li
              className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
              onClick={() => setQuestion("What are good exercises for arthritis?")}
            >
              <MessageSquare className="inline-block h-4 w-4 mr-2" />
              What are good exercises for arthritis?
            </li>
            <li
              className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
              onClick={() => setQuestion("How can I improve my sleep quality?")}
            >
              <MessageSquare className="inline-block h-4 w-4 mr-2" />
              How can I improve my sleep quality?
            </li>
            <li
              className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
              onClick={() => setQuestion("What foods can help lower blood pressure?")}
            >
              <MessageSquare className="inline-block h-4 w-4 mr-2" />
              What foods can help lower blood pressure?
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
