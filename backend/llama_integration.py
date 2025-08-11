"""
gemini_integration.py
Replacement for llama_integration.py using Google's Gemini / Gen AI Python SDK.

This version reads the API key from the environment variable GEMINI_API_KEY by default
(see "Method 2" from the docs). If that variable isn't set, the SDK will fall back to
Google ADC / Vertex settings if available.

Install SDK:
    pip install --upgrade google-genai
"""

import os
import logging
from typing import Optional

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

try:
    from google import genai
    _HAS_GENAI = True
except Exception:
    _HAS_GENAI = False


class GeminiAI:
    """
    GeminiAI: wrapper around Google's GenAI (Gemini) model.

    By default this class will:
      1) Read api_key from the constructor param if provided.
      2) Otherwise read GEMINI_API_KEY from the environment.
      3) Otherwise rely on SDK's Application Default Credentials / Vertex (ADC).

    Use:
        export GEMINI_API_KEY="ya29...."   # Linux / macOS
        setx GEMINI_API_KEY "ya29...."     # Windows (persist)
        $env:GEMINI_API_KEY="ya29..."      # PowerShell (session)
    """

    def __init__(self, model: str = "gemini-2.5-flash", api_key: Optional[str] = None, vertexai: bool = False):
        self.model = model

        if not _HAS_GENAI:
            logger.error(
                "google-genai SDK not found. Install it with:\n"
                "  pip install --upgrade google-genai\n"
            )
            raise ImportError("google-genai SDK is required. Run: pip install --upgrade google-genai")

        # Prefer explicit constructor arg; otherwise check environment variable.
        if api_key is None:
            api_key = os.getenv("GEMINI_API_KEY")

        if api_key:
            logger.info("Initializing GenAI client with API key from %s.", "constructor" if api_key else "env")
            # Pass api_key to client for simple API-key based auth if supported by your SDK version.
            try:
                self.client = genai.Client(vertexai=vertexai, api_key=api_key)
            except TypeError:
                # Older/newer SDK variants may require different init; try fallback.
                self.client = genai.Client(api_key=api_key)
        else:
            # No API key provided — rely on ADC / Vertex configuration
            logger.info("No GEMINI_API_KEY found. Initializing GenAI client using Application Default Credentials (ADC).")
            # If using Vertex / service-account, set GOOGLE_APPLICATION_CREDENTIALS and optionally GOOGLE_CLOUD_PROJECT.
            try:
                self.client = genai.Client(vertexai=vertexai)
            except TypeError:
                self.client = genai.Client()

        logger.info(f"GeminiAI initialized with model: {self.model}")

    def _generate(self, prompt: str, max_output_tokens: Optional[int] = None) -> str:
        """Internal wrapper around the SDK generate call."""
        try:
            generation_kwargs = {"model": self.model, "contents": prompt}
            if max_output_tokens:
                try:
                    gen_cfg = genai.types.GenerationConfig(max_output_tokens=max_output_tokens)
                    generation_kwargs["generation_config"] = gen_cfg
                except Exception:
                    # Ignore if SDK variant doesn't expose types.GenerationConfig
                    pass

            response = self.client.models.generate_content(**generation_kwargs)
            text = getattr(response, "text", None)
            if text is None:
                # Try alternate structure (SDK versions vary)
                try:
                    text = response.output[0].content[0].text
                except Exception:
                    text = ""
            return text.strip()
        except Exception as e:
            logger.exception("Error generating content from Gemini: %s", e)
            raise

    def generate_health_insights(self, health_data: str) -> str:
        prompt = f"""
You are a friendly healthcare assistant for elderly users. Based on the following health data, provide
3 personalized insights and simple recommendations. Keep it under 200 words and use simple language.

{health_data}

Focus on:
1. Notable patterns or concerns
2. Simple, actionable recommendations
3. Positive reinforcement for good metrics
"""
        try:
            return self._generate(prompt, max_output_tokens=400)
        except Exception:
            return "Unable to generate health insights at this time."

    def generate_reminder_message(self, reminder_type: str, scheduled_time: str, user_preferences: Optional[dict] = None) -> str:
        preferences = user_preferences or {}
        name = preferences.get("name", "")
        name_fragment = f" named {name}" if name else ""

        prompt = f"""
Create a gentle, friendly reminder message for an elderly person{name_fragment} about their {reminder_type} at {scheduled_time}.
The message should be:
- Very brief (under 30 words)
- Easy to understand
- Warm and supportive in tone
- Include the specific time: {scheduled_time}
Provide only the message text, no extra formatting.
"""
        try:
            text = self._generate(prompt, max_output_tokens=60)
            if text:
                return text
        except Exception:
            logger.exception("Gemini generation failed for reminder. Using fallback message.")

        # Fallbacks
        if reminder_type.lower() == "medication":
            return f"Please remember to take your medication at {scheduled_time}."
        if reminder_type.lower() == "hydration":
            return f"It's time to drink water at {scheduled_time}."
        if reminder_type.lower() == "exercise":
            return f"Remember to do your exercise at {scheduled_time}."
        if reminder_type.lower() == "appointment":
            return f"You have an appointment scheduled for {scheduled_time}."
        return f"Reminder: {reminder_type} at {scheduled_time}."

    def analyze_fall_incident(self, fall_data: str) -> str:
        prompt = f"""
As a healthcare assistant, analyze the following fall incident data and provide brief safety recommendations:

{fall_data}

Include:
1. One key observation about the fall
2. Two specific safety recommendations to prevent future falls

Keep under 150 words and use clear language for an elderly user.
"""
        try:
            return self._generate(prompt, max_output_tokens=300)
        except Exception:
            return "Unable to analyze fall incident at this time. Please consult your caregiver."

    def answer_health_question(self, question: str) -> str:
        prompt = f"""
You are a friendly healthcare assistant for elderly users. Answer the following question clearly and briefly (under 150 words).
Include a short disclaimer recommending consultation with a healthcare professional for medical advice.

Question: {question}
"""
        try:
            return self._generate(prompt, max_output_tokens=300)
        except Exception:
            return "Sorry, I'm unable to answer your question right now. Please try again later or consult a healthcare provider."


if __name__ == "__main__":
    # Example usage (method 2 - environment variable)
    # In your shell:
    #   export GEMINI_API_KEY="ya29..."      # Linux/macOS
    #   setx GEMINI_API_KEY "ya29..."       # Windows (persist)
    #   $env:GEMINI_API_KEY="ya29..."       # PowerShell (session)
    #
    # Or use a .env + python-dotenv in dev:
    #   pip install python-dotenv
    #   create .env with GEMINI_API_KEY=ya29...
    #   and then load it before creating the client.

    try:
        gem = GeminiAI()  # reads GEMINI_API_KEY automatically if available
    except ImportError as e:
        raise

    health_data = "Heart rate: 85 bpm, Blood pressure: 130/85 mmHg, Glucose: 110 mg/dL"
    print("Health insights:\n", gem.generate_health_insights(health_data))
    print("Reminder:\n", gem.generate_reminder_message("Medication", "9:00 AM", {"name": "John"}))
    print("Fall analysis:\n", gem.analyze_fall_incident("Slipped on wet floor near kitchen sink; minor bruising."))
    print("Health Q&A:\n", gem.answer_health_question("What are safe exercises for seniors with mild knee pain?"))
