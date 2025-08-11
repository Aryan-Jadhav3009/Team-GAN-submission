from flask import Flask, jsonify, request
from flask_cors import CORS
import csv
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import datetime
import google.genai as genai
import logging
from typing import Optional

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
_HAS_GENAI = True


# ---------------------------
# Email Configuration
# ---------------------------
EMAIL_NOTIFICATIONS_ENABLED = True
EMAIL_PASSWORD = os.environ.get("EMAIL_PASSWORD")
EMAIL_SENDER = os.environ.get("EMAIL_SENDER")
EMAIL_RECIPIENTS = os.environ.get("EMAIL_RECIPIENTS", "").split(",")

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

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
            
def send_email_alert(subject, message):
    if not EMAIL_NOTIFICATIONS_ENABLED:
        print("Email notifications are disabled.")
        return False
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_SENDER
        msg['To'] = ", ".join(EMAIL_RECIPIENTS)
        msg['Subject'] = subject
        full_message = f"Alert Time: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n{message}"
        msg.attach(MIMEText(full_message, 'plain'))
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_SENDER, EMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(f"Email alert sent: {subject}")
        return True
    except Exception as e:
        print(f"Failed to send email alert: {e}")
        return False

def get_value(row, keys, default="N/A"):
    for key in keys:
        if key in row and row[key].strip():
            return row[key].strip()
    return default

# ---------------------------
# Agent Class (Gemini)
# ---------------------------
class Agent:
    def __init__(self, name, instructions, model="gemini-2.5-flash"):
        self.name = name
        self.instructions = instructions
        self.model = model
        self.client = GeminiAI(model=model)
        print(f"Initialized {name} with Gemini model {model}")

    def generate_response(self, prompt):
        try:
            full_prompt = f"{self.instructions}\n\nUser request: {prompt}"
            print(f"{self.name} processing: {prompt[:50]}...")
            result = self.client._generate(full_prompt)
            print(f"{self.name} response length: {len(result)} characters")
            return result
        except Exception as e:
            print(f"Error with {self.name}: {e}")
            return f"Error: {e}"

# ---------------------------
# Agent Instructions
# ---------------------------
reminder_instructions = (
    "You are a Reminder Agent for an elderly care system. "
    "Your job is to provide clear, friendly reminders for daily tasks. "
    "Keep your responses brief, warm, and easy to understand for elderly users."
)
health_instructions = (
    "You are a Health Monitoring Agent for elderly users. "
    "Analyze the provided vital signs and indicate if there are any concerns."
)
safety_instructions = (
    "You are a Safety Monitoring Agent for elderly users. "
    "When a fall is detected, provide clear information about the incident and basic safety advice."
)
caregiver_instructions = (
    "You are a Caregiver Notification Agent. "
    "Create clear, informative messages for caregivers about critical incidents."
)

# ---------------------------
# CSV Loader
# ---------------------------
def load_csv(file_path):
    if not os.path.exists(file_path):
        print(f"File {file_path} not found!")
        return []
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        return list(reader)

# ---------------------------
# Processing Functions
# ---------------------------
def process_reminders(reminder_data, agent: Agent):
    results = []
    for row in reminder_data:
        reminder_type = row.get('Reminder Type', '')
        scheduled_time = row.get('Scheduled Time', '')
        sent = row.get('Reminder Sent', 'No')
        acknowledged = row.get('Acknowledged (Yes/No)', 'No')

        prompt = f"Create a friendly reminder for an elderly person about their {reminder_type} scheduled at {scheduled_time}."
        message = agent.generate_response(prompt)

        if sent == 'Yes' and acknowledged == 'Yes':
            message += " (Acknowledged)"
        elif sent == 'Yes':
            message += " (Sent but not acknowledged)"

        results.append(f"{scheduled_time}: {message}")
    results.sort()
    return results

def process_health(health_data, agent: Agent):
    results = []
    alerts = []
    for row in health_data:
        timestamp = row.get('Timestamp', '')
        if '####' in timestamp:
            continue
        heart_rate = row.get('Heart Rate', '')
        hr_threshold = row.get('Heart Rate Below/Above Threshold', '')
        blood_pressure = row.get('Blood Pressure', '')
        bp_threshold = row.get('Blood Pressure Below/Above Threshold', '')
        glucose = row.get('Glucose Levels', '')
        glucose_threshold = row.get('Glucose Levels Below/Above Threshold', '')
        oxygen = row.get('Oxygen Saturation', '')
        spo2_threshold = row.get('SpO2 Below Threshold', '')

        prompt = (
            f"Analyze these health metrics:\n"
            f"Time: {timestamp}\n"
            f"Heart Rate: {heart_rate} bpm (Abnormal: {hr_threshold})\n"
            f"Blood Pressure: {blood_pressure} (Abnormal: {bp_threshold})\n"
            f"Glucose: {glucose} mg/dL (Abnormal: {glucose_threshold})\n"
            f"Oxygen Saturation: {oxygen}% (Below threshold: {spo2_threshold})"
        )
        message = agent.generate_response(prompt)

        alert_conditions = []
        if hr_threshold == 'Yes':
            alert_conditions.append(f"Abnormal heart rate: {heart_rate} bpm")
        if bp_threshold == 'Yes':
            alert_conditions.append(f"Abnormal blood pressure: {blood_pressure}")
        if glucose_threshold == 'Yes':
            alert_conditions.append(f"Abnormal glucose level: {glucose} mg/dL")
        if spo2_threshold == 'Yes':
            alert_conditions.append(f"Low oxygen saturation: {oxygen}%")

        if alert_conditions and row.get('Alert Triggered', 'No') == 'Yes':
            alert_message = (
                f"Health Alert at {timestamp}\n\n"
                f"Alert Conditions:\n- " + "\n- ".join(alert_conditions) +
                f"\n\nAI Assessment:\n{message}"
            )
            alerts.append({"subject": "HEALTH ALERT: Abnormal Vital Signs", "message": alert_message})

        results.append(f"{timestamp}: {message}")

    for alert in alerts:
        send_email_alert(alert["subject"], alert["message"])
    return results

def process_safety(safety_data, agent: Agent):
    results = []
    fall_alerts = []
    for row in safety_data:
        timestamp = row.get('Timestamp', '')
        movement = row.get('Movement Activity', '')
        fall_detected = row.get('Fall Detected', 'No')
        impact_level = row.get('Impact Force Level', '-')
        inactivity = row.get('Post-Fall Inactivity Duration (Seconds)', '0')
        location = row.get('Location', '')

        if fall_detected == 'Yes':
            prompt = (
                f"A fall was detected:\n"
                f"Time: {timestamp}\n"
                f"Location: {location}\n"
                f"Impact Level: {impact_level}\n"
                f"Inactivity Duration: {inactivity} seconds"
            )
            message = agent.generate_response(prompt)
            fall_alerts.append({
                "subject": "URGENT: Fall Detected",
                "message": (
                    f"Fall Alert Details:\nTime: {timestamp}\n"
                    f"Location: {location}\nImpact Level: {impact_level}\n"
                    f"Inactivity Duration: {inactivity} seconds\n\nAI Assessment:\n{message}"
                )
            })
        else:
            message = f"No fall detected. Activity: {movement} in {location}."

        results.append(f"{timestamp}: {message}")

    for alert in fall_alerts:
        send_email_alert(alert["subject"], alert["message"])
    return results

def get_caregiver_notification(safety_data, health_data, agent: Agent):
    for row in safety_data:
        if row.get('Fall Detected', 'No') == 'Yes' and row.get('Caregiver Notified (Yes/No)', 'No') == 'Yes':
            timestamp = row.get('Timestamp', '')
            location = row.get('Location', '')
            prompt = f"Create a notification for a caregiver about a fall at {timestamp} in {location}."
            return agent.generate_response(prompt)

    health_alerts = []
    for row in health_data:
        if row.get('Alert Triggered', 'No') == 'Yes' and row.get('Caregiver Notified (Yes/No)', 'No') == 'Yes':
            timestamp = row.get('Timestamp', '')
            if '####' in timestamp:
                continue
            if row.get('Heart Rate Below/Above Threshold', 'No') == 'Yes':
                health_alerts.append("heart rate")
            if row.get('Blood Pressure Below/Above Threshold', 'No') == 'Yes':
                health_alerts.append("blood pressure")
            if row.get('Glucose Levels Below/Above Threshold', 'No') == 'Yes':
                health_alerts.append("glucose level")
            if row.get('SpO2 Below Threshold', 'No') == 'Yes':
                health_alerts.append("oxygen saturation")

    if health_alerts:
        prompt = f"Create a notification for a caregiver about abnormal {', '.join(health_alerts)}."
        return agent.generate_response(prompt)

    return "No recent caregiver notifications."

# ---------------------------
# Run Agents
# ---------------------------
def run_agents():
    reminder_agent = Agent("Reminder Agent", reminder_instructions)
    health_agent = Agent("Health Agent", health_instructions)
    safety_agent = Agent("Safety Agent", safety_instructions)
    caregiver_agent = Agent("Caregiver Agent", caregiver_instructions)

    reminder_data = load_csv("backend/data/daily_reminder.csv")
    health_data = load_csv("backend/data/health_monitoring.csv")
    safety_data = load_csv("backend/data/safety_monitoring.csv")

    results = {}
    results['reminders'] = process_reminders(reminder_data, reminder_agent)
    results['health'] = process_health(health_data, health_agent)
    results['safety'] = process_safety(safety_data, safety_agent)
    results['caregiver'] = get_caregiver_notification(safety_data, health_data, caregiver_agent)

    if results['health']:
        latest_health_data = results['health'][-1]
        prompt = f"Based on this health data: {latest_health_data}\n\nProvide 3 personalized health insights."
        results['health_insights'] = [health_agent.generate_response(prompt)]
    else:
        results['health_insights'] = []

    fall_incidents = [alert for alert in results['safety'] if "fall was detected" in alert.lower()]
    if fall_incidents:
        latest_fall = fall_incidents[-1]
        prompt = f"Based on this fall incident: {latest_fall}\n\nProvide safety recommendations."
        results['safety_analysis'] = [safety_agent.generate_response(prompt)]
    else:
        results['safety_analysis'] = []

    return results

# ---------------------------
# Flask App
# ---------------------------
app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return jsonify({"message": "Healthcare API is running"})

@app.route('/api/health-data', methods=['GET'])
def health_data():
    try:
        return jsonify(run_agents())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/ai/health-question', methods=['POST'])
def ai_health_question():
    try:
        data = request.get_json()
        question = data.get('question', '')
        if not question:
            return jsonify({"error": "No question provided"}), 400

        health_qa_instructions = (
            "You are a Health Assistant for elderly users. "
            "Answer questions clearly and concisely."
        )
        health_qa_agent = Agent("Health Q&A Agent", health_qa_instructions)
        return jsonify({"answer": health_qa_agent.generate_response(question)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/test-email', methods=['GET'])
def test_email():
    try:
        if send_email_alert("Test Email", "This is a test email."):
            return jsonify({"message": "Test email sent successfully"})
        else:
            return jsonify({"error": "Failed to send test email"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", debug=False, port=port)
