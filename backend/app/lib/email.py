import resend
import os
from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")

def send_welcome_email(to_email: str, user_name: str):
    params = {
        "from": "Allocare <onboarding@resend.dev>",
        "to": [to_email],
        "subject": "Welcome to Allocare! 🚀",
        "html": f"""
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
                <h2 style="color: #2E6B6B;">Welcome to Allocare, {user_name}!</h2>
                <p>We're excited to help you take control of your finances. With Allocare, you're budgeting by <strong>allocation</strong>, not by regret.</p>
                <p>Next steps:</p>
                <ul>
                    <li>Complete your onboarding</li>
                    <li>Set your monthly income</li>
                    <li>Define your budget buckets</li>
                </ul>
                <a href="https://www.allocare.online/dashboard" 
                   style="display: inline-block; background-color: #2E6B6B; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px;">
                   Go to Dashboard
                </a>
                <p style="margin-top: 32px; font-size: 12px; color: #64748b;">
                    If you didn't create an account, you can safely ignore this email.
                </p>
            </div>
        """,
    }

    try:
        resend.Emails.send(params)
    except Exception as e:
        print(f"Failed to send email: {e}")