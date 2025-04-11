import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Try to call the Flask backend with a timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

    const response = await fetch("http://localhost:5000/api/health-data", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    }).catch((err) => {
      console.log("Backend connection error:", err)
      return null // Return null instead of throwing
    })

    clearTimeout(timeoutId)

    // If we got a valid response, return the data
    if (response && response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    }

    // If we reach here, we need to use mock data
    console.log("Using mock data because backend is not accessible")

    // Mock data for preview/development
    const mockData = {
      reminders: [
        "8:00:00: Please remember to take your medication at 11:30:00.",
        "13:00:00: Remember to do your exercise at 13:00:00.",
        "13:00:00: It's time to drink water at 13:00:00.",
        "13:30:00: You have an appointment scheduled for 13:30:00.",
        "15:30:00: Please remember to take your medication at 15:30:00. (Sent but not acknowledged)",
        "20:00:00: You have an appointment scheduled for 20:00:00. (Acknowledged)",
      ],
      health: [
        "1/22/2025 20:4: Your heart rate is 116 bpm and blood pressure is 118/79 mmHg. Your heart rate, blood pressure and glucose level require attention.",
        "1/16/2025 12:2: Your heart rate is 119 bpm and blood pressure is 105/77 mmHg. Your heart rate and glucose level require attention.",
        "1/30/2025 3:01: Your heart rate is 109 bpm and blood pressure is 137/61 mmHg. Your heart rate, blood pressure and glucose level require attention.",
        "1/23/2025 15:0: Your heart rate is 89 bpm and blood pressure is 121/70 mmHg, which are within normal ranges.",
      ],
      health_insights: [
        "Based on your recent health metrics, I notice your heart rate has been consistently elevated above the normal range (60-100 bpm). Your blood pressure readings show slight elevation in the systolic (top) number.\n\nRecommendations:\n1. Take short rest breaks throughout your day and practice deep breathing exercises.\n2. Monitor your salt intake, as this can affect blood pressure.\n3. Your glucose levels require attention - try spacing out carbohydrate consumption throughout the day rather than in large meals.\n\nIt's positive that your oxygen saturation remains in a healthy range. Please discuss these patterns with your healthcare provider at your next appointment.",
      ],
      safety: [
        "01-07-2025 16:04: No fall detected. Activity: No Movement in Kitchen.",
        "1/20/2025 15:45: No fall detected. Activity: Lying in Living Room.",
        "1/19/2025 19:46: Alert! A fall was detected in the Bathroom with Medium impact. Inactivity duration: 463 seconds.",
        "01-03-2025 22:44: Alert! A fall was detected in the Kitchen with Low impact. Inactivity duration: 94 seconds.",
      ],
      safety_analysis: [
        "I noticed your fall occurred in the bathroom with medium impact, resulting in nearly 8 minutes of inactivity. This is concerning as bathrooms are common locations for serious falls.\n\nRecommendations:\n1. Install grab bars near the toilet and in the shower/tub area for additional support.\n2. Use a non-slip bath mat both inside and outside the tub/shower to prevent slipping on wet surfaces.\n\nRemember to keep the bathroom well-lit, especially at night, and consider a shower chair for added safety while bathing.",
      ],
      caregiver:
        "Caregiver has been notified about the fall detected at 1/19/2025 19:46 in the Bathroom. They have confirmed they are on their way to check on you.",
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error("Error in health-data API route:", error)

    // Fallback to mock data if any error occurs
    const mockData = {
      reminders: [
        "8:00:00: Please remember to take your medication at 11:30:00.",
        "13:00:00: Remember to do your exercise at 13:00:00.",
        "13:00:00: It's time to drink water at 13:00:00.",
        "13:30:00: You have an appointment scheduled for 13:30:00.",
        "15:30:00: Please remember to take your medication at 15:30:00. (Sent but not acknowledged)",
        "20:00:00: You have an appointment scheduled for 20:00:00. (Acknowledged)",
      ],
      health: [
        "1/22/2025 20:4: Your heart rate is 116 bpm and blood pressure is 118/79 mmHg. Your heart rate, blood pressure and glucose level require attention.",
        "1/16/2025 12:2: Your heart rate is 119 bpm and blood pressure is 105/77 mmHg. Your heart rate and glucose level require attention.",
        "1/30/2025 3:01: Your heart rate is 109 bpm and blood pressure is 137/61 mmHg. Your heart rate, blood pressure and glucose level require attention.",
        "1/23/2025 15:0: Your heart rate is 89 bpm and blood pressure is 121/70 mmHg, which are within normal ranges.",
      ],
      health_insights: [
        "Based on your recent health metrics, I notice your heart rate has been consistently elevated above the normal range (60-100 bpm). Your blood pressure readings show slight elevation in the systolic (top) number.\n\nRecommendations:\n1. Take short rest breaks throughout your day and practice deep breathing exercises.\n2. Monitor your salt intake, as this can affect blood pressure.\n3. Your glucose levels require attention - try spacing out carbohydrate consumption throughout the day rather than in large meals.\n\nIt's positive that your oxygen saturation remains in a healthy range. Please discuss these patterns with your healthcare provider at your next appointment.",
      ],
      safety: [
        "01-07-2025 16:04: No fall detected. Activity: No Movement in Kitchen.",
        "1/20/2025 15:45: No fall detected. Activity: Lying in Living Room.",
        "1/19/2025 19:46: Alert! A fall was detected in the Bathroom with Medium impact. Inactivity duration: 463 seconds.",
        "01-03-2025 22:44: Alert! A fall was detected in the Kitchen with Low impact. Inactivity duration: 94 seconds.",
      ],
      safety_analysis: [
        "I noticed your fall occurred in the bathroom with medium impact, resulting in nearly 8 minutes of inactivity. This is concerning as bathrooms are common locations for serious falls.\n\nRecommendations:\n1. Install grab bars near the toilet and in the shower/tub area for additional support.\n2. Use a non-slip bath mat both inside and outside the tub/shower to prevent slipping on wet surfaces.\n\nRemember to keep the bathroom well-lit, especially at night, and consider a shower chair for added safety while bathing.",
      ],
      caregiver:
        "Caregiver has been notified about the fall detected at 1/19/2025 19:46 in the Bathroom. They have confirmed they are on their way to check on you.",
    }

    return NextResponse.json(mockData)
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { question } = body

    // Call the AI endpoint in the Flask backend
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 500000) // 5 second timeout

    const response = await fetch("http://localhost:5000/api/ai/health-question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
      signal: controller.signal,
    }).catch((err) => {
      console.log("Backend connection error:", err)
      return null
    })

    clearTimeout(timeoutId)

    if (response && response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    }

    // Mock data for unavailable backend
    return NextResponse.json({
      answer:
        "I'm sorry, the AI service is currently unavailable. Please try again later or contact support if the issue persists.",
    })
  } catch (error) {
    console.error("Error in health question API route:", error)
    return NextResponse.json(
      {
        error: "Failed to process your question. Please try again.",
      },
      { status: 500 },
    )
  }
}
