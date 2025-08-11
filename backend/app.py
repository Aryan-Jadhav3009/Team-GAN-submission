from flask import Flask, jsonify, request
from flask_cors import CORS
import csv
import os
import time
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import datetime

# ---------------------------
# Email Configuration (EDIT THESE VALUES)
# ---------------------------
# Set to True to enable email notifications, False to disable
EMAIL_NOTIFICATIONS_ENABLED = True

# Email sender details (use an app password for Gmail)
EMAIL_PASSWORD = os.environ.get("EMAIL_PASSWORD")
EMAIL_SENDER = os.environ.get("EMAIL_SENDER")
EMAIL_RECIPIENTS = os.environ.get("EMAIL_RECIPIENTS", "").split(",")


# SMTP server settings (for Gmail)
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

# ---------------------------
# Email Sending Function
# ---------------------------
def send_email_alert(subject, message):
    """
    Send an email alert to the configured recipients.
    """
    if not EMAIL_NOTIFICATIONS_ENABLED:
        print("Email notifications are disabled.")
        return False
    
    try:
        # Create message
        msg = MIMEMultipart()
        msg['From'] = EMAIL_SENDER
        msg['To'] = ", ".join(EMAIL_RECIPIENTS)
        msg['Subject'] = subject
        
        # Add timestamp to the message
        full_message = f"Alert Time: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n{message}"
        msg.attach(MIMEText(full_message, 'plain'))
        
        # Connect to server and send
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

# ---------------------------
# Helper Function: Get Value from Row
# ---------------------------
def get_value(row, keys, default="N/A"):
    """
    Try to return the value for the first key present in the row from a list of possible keys.
    """
    for key in keys:
        if key in row and row[key].strip():
            return row[key].strip()
    return default

# ---------------------------
# Define a basic Agent class
# ---------------------------
class Agent:
    def __init__(self, name, instructions, model='mistral'):
        self.name = name
        self.instructions = instructions
        self.model = model
        print(f"Initialized {name} with model {model}")

    def generate_response(self, prompt):
        """
        Compose the messages with a system prompt (the agent's instructions)
        and the user prompt, then call the Ollama API.
        """
        messages = [
            {"role": "system", "content": self.instructions},
            {"role": "user", "content": prompt}
        ]
        try:
            print(f"{self.name} processing: {prompt[:50]}...")
            response = ollama.chat(model=self.model, messages=messages)
            result = response.get('message', {}).get('content', '')
            print(f"{self.name} response length: {len(result)} characters")
        except Exception as e:
            print(f"Error with {self.name}: {e}")
            result = f"Error: {e}"
        return result

# ---------------------------
# Agent Instructions (customize as needed)
# ---------------------------
reminder_instructions = (
    "You are a Reminder Agent for an elderly care system. "
    "Your job is to provide clear, friendly reminders for daily tasks. "
    "Keep your responses brief, warm, and easy to understand for elderly users. "
    "Focus on the importance of the task and provide gentle encouragement."
)

health_instructions = (
    "You are a Health Monitoring Agent for elderly users. "
    "Analyze the provided vital signs and indicate if there are any concerns. "
    "For heart rate, normal range is 60-100 bpm. "
    "For blood pressure, normal range is around 120/80 mmHg. "
    "Explain any abnormalities in simple terms and suggest basic precautions. "
    "Keep your responses concise and easy to understand."
)

safety_instructions = (
    "You are a Safety Monitoring Agent for elderly users. "
    "When a fall is detected, provide clear information about the incident and basic safety advice. "
    "Emphasize the importance of seeking help and avoiding sudden movements after a fall. "
    "Keep your responses concise, calm, and reassuring."
)

caregiver_instructions = (
    "You are a Caregiver Notification Agent. "
    "Create clear, informative messages for caregivers about critical incidents. "
    "Include essential information about what happened and what actions have been taken. "
    "Keep your tone professional but compassionate."
)

# ---------------------------
# CSV Loader Helper Function
# ---------------------------
def load_csv(file_path):
    """
    Read a CSV file and return a list of dictionaries.
    """
    if not os.path.exists(file_path):
        print(f"File {file_path} not found!")
        return []
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        return list(reader)

# ---------------------------
# Processing Functions with Dynamic Column Detection
# ---------------------------
def process_reminders(reminder_data, agent: Agent):
    """
    Process reminder CSV data.
    """
    results = []
    for row in reminder_data:
        device_id = row.get('Device-ID/User-ID', '')
        timestamp = row.get('Timestamp', '')
        reminder_type = row.get('Reminder Type', '')
        scheduled_time = row.get('Scheduled Time', '')
        sent = row.get('Reminder Sent', 'No')
        acknowledged = row.get('Acknowledged (Yes/No)', 'No')
        
        # Create a prompt for the agent
        prompt = f"Create a friendly reminder for an elderly person about their {reminder_type} scheduled at {scheduled_time}."
        
        # Get AI-generated response
        message = agent.generate_response(prompt)
        
        # Add status information
        if sent == 'Yes' and acknowledged == 'Yes':
            message += " (Acknowledged)"
        elif sent == 'Yes':
            message += " (Sent but not acknowledged)"
            
        results.append(f"{scheduled_time}: {message}")
    
    # Sort reminders by scheduled time
    results.sort()
    return results

def process_health(health_data, agent: Agent):
    """
    Process health CSV data.
    """
    results = []
    alerts = []
    
    for row in health_data:
        device_id = row.get('Device-ID/User-ID', '')
        timestamp = row.get('Timestamp', '')
        
        # Skip entries with missing timestamps (marked as ############)
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
        
        # Create a prompt for the agent
        prompt = (
            f"Analyze these health metrics for an elderly person:\n"
            f"Time: {timestamp}\n"
            f"Heart Rate: {heart_rate} bpm (Abnormal: {hr_threshold})\n"
            f"Blood Pressure: {blood_pressure} (Abnormal: {bp_threshold})\n"
            f"Glucose: {glucose} mg/dL (Abnormal: {glucose_threshold})\n"
            f"Oxygen Saturation: {oxygen}% (Below threshold: {spo2_threshold})\n\n"
            f"Provide a brief assessment of these vital signs in simple language."
        )
        
        # Get AI-generated response
        message = agent.generate_response(prompt)
        
        # Check if this is an alert condition that needs an email
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
                f"Health Alert for User {device_id} at {timestamp}\n\n"
                f"Alert Conditions:\n- " + "\n- ".join(alert_conditions) + "\n\n"
                f"AI Assessment:\n{message}"
            )
            alerts.append({
                "subject": f"HEALTH ALERT: Abnormal Vital Signs Detected",
                "message": alert_message
            })
        
        results.append(f"{timestamp}: {message}")
    
    # Send email alerts for health issues
    for alert in alerts:
        send_email_alert(alert["subject"], alert["message"])
    
    return results

def process_safety(safety_data, agent: Agent):
    """
    Process safety CSV data.
    """
    results = []
    fall_alerts = []
    
    for row in safety_data:
        device_id = row.get('Device-ID/User-ID', '')
        timestamp = row.get('Timestamp', '')
        movement = row.get('Movement Activity', '')
        fall_detected = row.get('Fall Detected', 'No')
        impact_level = row.get('Impact Force Level', '-')
        inactivity = row.get('Post-Fall Inactivity Duration (Seconds)', '0')
        location = row.get('Location', '')
        
        # Format the safety message
        if fall_detected == 'Yes':
            prompt = (
                f"A fall was detected for an elderly person with these details:\n"
                f"Time: {timestamp}\n"
                f"Location: {location}\n"
                f"Impact Level: {impact_level}\n"
                f"Inactivity Duration: {inactivity} seconds\n\n"
                f"Provide a brief assessment and safety advice."
            )
            message = agent.generate_response(prompt)
            
            # Create fall alert for email
            fall_alert = {
                "subject": f"URGENT: Fall Detected for User {device_id}",
                "message": (
                    f"Fall Alert Details:\n"
                    f"User ID: {device_id}\n"
                    f"Time: {timestamp}\n"
                    f"Location: {location}\n"
                    f"Impact Level: {impact_level}\n"
                    f"Inactivity Duration: {inactivity} seconds\n\n"
                    f"AI Assessment:\n{message}\n\n"
                    f"IMMEDIATE ACTION REQUIRED: Please check on the user as soon as possible."
                )
            }
            fall_alerts.append(fall_alert)
        else:
            message = f"No fall detected. Activity: {movement} in {location}."
            
        results.append(f"{timestamp}: {message}")
    
    # Send email alerts for falls
    for alert in fall_alerts:
        send_email_alert(alert["subject"], alert["message"])
    
    return results

def get_caregiver_notification(safety_data, health_data, agent: Agent):
    """
    Generate caregiver notification based on safety and health data.
    """
    # Check for falls first
    for row in safety_data:
        if row.get('Fall Detected', 'No') == 'Yes' and row.get('Caregiver Notified (Yes/No)', 'No') == 'Yes':
            timestamp = row.get('Timestamp', '')
            location = row.get('Location', '')
            impact_level = row.get('Impact Force Level', '-')
            inactivity = row.get('Post-Fall Inactivity Duration (Seconds)', '0')
            
            prompt = (
                f"Create a notification for a caregiver about a fall incident:\n"
                f"Time: {timestamp}\n"
                f"Location: {location}\n"
                f"Impact Level: {impact_level}\n"
                f"Inactivity Duration: {inactivity} seconds\n\n"
                f"The message should be informative and reassuring."
            )
            return agent.generate_response(prompt)
    
    # Check for health alerts
    health_alerts = []
    for row in health_data:
        if row.get('Alert Triggered', 'No') == 'Yes' and row.get('Caregiver Notified (Yes/No)', 'No') == 'Yes':
            timestamp = row.get('Timestamp', '')
            
            # Skip entries with missing timestamps (marked as ############)
            if '####' in timestamp:
                continue
                
            alerts = []
            if row.get('Heart Rate Below/Above Threshold', 'No') == 'Yes':
                alerts.append("heart rate")
            if row.get('Blood Pressure Below/Above Threshold', 'No') == 'Yes':
                alerts.append("blood pressure")
            if row.get('Glucose Levels Below/Above Threshold', 'No') == 'Yes':
                alerts.append("glucose level")
            if row.get('SpO2 Below Threshold', 'No') == 'Yes':
                alerts.append("oxygen saturation")
                
            if alerts:
                health_alerts.append(f"abnormal {', '.join(alerts)} at {timestamp}")
    
    if health_alerts:
        if len(health_alerts) == 1:
            prompt = f"Create a notification for a caregiver about {health_alerts[0]}. The message should be informative and reassuring."
            return agent.generate_response(prompt)
        else:
            prompt = f"Create a notification for a caregiver about multiple health alerts: {', '.join(health_alerts[:-1])} and {health_alerts[-1]}. The message should be informative and reassuring."
            return agent.generate_response(prompt)
    
    return "No recent caregiver notifications."

def run_agents():
    # Initialize agents
    reminder_agent = Agent("Reminder Agent", reminder_instructions)
    health_agent = Agent("Health Agent", health_instructions)
    safety_agent = Agent("Safety Agent", safety_instructions)
    caregiver_agent = Agent("Caregiver Agent", caregiver_instructions)

    # Load CSV datasets
    reminder_data = load_csv("backend/data/daily_reminder.csv")
    health_data = load_csv("backend/data/health_monitoring.csv")
    safety_data = load_csv("backend/data/safety_monitoring.csv")

    results = {}
    print("Processing reminders...")
    results['reminders'] = process_reminders(reminder_data, reminder_agent)
    print("Processing health data...")
    results['health'] = process_health(health_data, health_agent)
    print("Processing safety data...")
    results['safety'] = process_safety(safety_data, safety_agent)
    print("Generating caregiver notification...")
    results['caregiver'] = get_caregiver_notification(safety_data, health_data, caregiver_agent)
    
    # Generate AI insights for health and safety
    if results['health']:
        latest_health_data = results['health'][-1]
        prompt = f"Based on this health data: {latest_health_data}\n\nProvide 3 personalized health insights and recommendations in a concise format."
        results['health_insights'] = [health_agent.generate_response(prompt)]
    else:
        results['health_insights'] = []
        
    # Generate AI analysis for safety if there's a fall
    fall_incidents = [alert for alert in results['safety'] if "fall was detected" in alert.lower()]
    if fall_incidents:
        latest_fall = fall_incidents[-1]
        prompt = f"Based on this fall incident: {latest_fall}\n\nProvide a brief safety analysis with 2-3 specific recommendations to prevent future falls."
        results['safety_analysis'] = [safety_agent.generate_response(prompt)]
    else:
        results['safety_analysis'] = []
    
    return results

# ---------------------------
# Flask Web Application
# ---------------------------
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def index():
    return jsonify({"message": "Healthcare API is running"})

@app.route('/api/health-data', methods=['GET'])
def health_data():
    try:
        # Process the data and get results
        results_data = run_agents()
        return jsonify(results_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/ai/health-question', methods=['POST'])
def ai_health_question():
    """
    Endpoint to answer health-related questions using an AI agent.
    """
    try:
        data = request.get_json()
        question = data.get('question', '')
        
        if not question:
            return jsonify({"error": "No question provided"}), 400
        
        # Initialize a health Q&A agent
        health_qa_instructions = (
            "You are a Health Assistant for elderly users. "
            "Answer health-related questions in a clear, concise, and easy-to-understand manner. "
            "Provide practical advice when appropriate, but always remind the user to consult with "
            "healthcare professionals for medical concerns. Keep your responses under 150 words."
        )
        health_qa_agent = Agent("Health Q&A Agent", health_qa_instructions)
        
        # Generate response
        answer = health_qa_agent.generate_response(question)
        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/test-email', methods=['GET'])
def test_email():
    """
    Endpoint to test the email notification system.
    """
    try:
        success = send_email_alert(
            "Test Email from Health Companion System",
            "This is a test email to verify that the email notification system is working correctly."
        )
        
        if success:
            return jsonify({"message": "Test email sent successfully"})
        else:
            return jsonify({"error": "Failed to send test email"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", debug=False, port=port)
