import requests
import json
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class LlamaAI:
    """
    A class to handle interactions with Ollama running Llama 3.0
    """
    def __init__(self, base_url="http://localhost:11434"):
        self.base_url = base_url
        self.model = "llama3"
        logger.info(f"Initialized LlamaAI with base URL: {base_url}")
    
    def _make_request(self, endpoint, payload):
        """Make a request to the Ollama API"""
        url = f"{self.base_url}/api/{endpoint}"
        
        try:
            response = requests.post(url, json=payload)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Error making request to Ollama: {e}")
            return {"error": str(e)}
    
    def generate_health_insights(self, health_data):
        """Generate personalized health insights based on health metrics"""
        # Create a prompt with the user's health data
        prompt = f"""
        As a healthcare assistant, analyze the following health data and provide 
        3 personalized insights and recommendations:
        
        {health_data}
        
        Focus on:
        1. Notable patterns or concerns
        2. Simple, actionable recommendations
        3. Positive reinforcement for good metrics
        
        Keep your response under 200 words and use simple language appropriate for elderly users.
        """
        
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }
        
        response = self._make_request("generate", payload)
        
        if "error" in response:
            return "Unable to generate health insights at this time."
        
        return response.get("response", "No insights available")
    
    def generate_reminder_message(self, reminder_type, scheduled_time, user_preferences=None):
        """Generate a personalized reminder message"""
        preferences = user_preferences or {}
        name = preferences.get("name", "")
        
        prompt = f"""
        Create a gentle, friendly reminder message for an elderly person{' named ' + name if name else ''} 
        about their {reminder_type} at {scheduled_time}.
        
        The message should be:
        - Very brief (under 30 words)
        - Easy to understand
        - Warm and supportive in tone
        - Include the specific time: {scheduled_time}
        
        Just provide the message text with no additional formatting or explanation.
        """
        
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }
        
        response = self._make_request("generate", payload)
        
        if "error" in response:
            # Fallback message if the AI fails
            if reminder_type == "Medication":
                return f"Please remember to take your medication at {scheduled_time}."
            elif reminder_type == "Hydration":
                return f"It's time to drink water at {scheduled_time}."
            elif reminder_type == "Exercise":
                return f"Remember to do your exercise at {scheduled_time}."
            elif reminder_type == "Appointment":
                return f"You have an appointment scheduled for {scheduled_time}."
            else:
                return f"Reminder: {reminder_type} at {scheduled_time}."
        
        # Clean up any potential formatting in the response
        message = response.get("response", "").strip()
        return message
    
    def analyze_fall_incident(self, fall_data):
        """Analyze a fall incident and provide recommendations"""
        prompt = f"""
        As a healthcare assistant, analyze the following fall incident data and provide 
        brief safety recommendations:
        
        {fall_data}
        
        Include:
        1. One key observation about the fall
        2. Two specific safety recommendations to prevent future falls
        
        Keep your response under 150 words and use simple, clear language for an elderly user.
        """
        
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }
        
        response = self._make_request("generate", payload)
        
        if "error" in response:
            return "Unable to analyze fall incident at this time. Please consult with your caregiver about safety precautions."
        
        return response.get("response", "No analysis available")
    
    def answer_health_question(self, question):
        """Answer a general health question from the user"""
        prompt = f"""
        As a healthcare assistant for elderly users, answer the following question:
        
        {question}
        
        Your response should be:
        - Clear and easy to understand
        - Brief (under 150 words)
        - Informative but not overly technical
        - Include a disclaimer about consulting healthcare providers for medical advice
        
        Focus on general health information and best practices, not specific medical advice.
        """
        
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }
        
        response = self._make_request("generate", payload)
        
        if "error" in response:
            return "I'm sorry, I'm unable to answer your question at this time. Please try again later or consult with your healthcare provider."
        
        return response.get("response", "No answer available")

# Example usage
if __name__ == "__main__":
    llama = LlamaAI()
    
    # Test health insights
    health_data = "Heart rate: 85 bpm, Blood pressure: 130/85 mmHg, Glucose: 110 mg/dL"
    print(llama.generate_health_insights(health_data))
    
    # Test reminder message
    print(llama.generate_reminder_message("Medication", "9:00 AM", {"name": "John"}))
