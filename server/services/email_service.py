import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from db.connection import SessionLocal
from db.models import User, Article, Delivery
import os
from dotenv import load_dotenv

load_dotenv()


SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL = os.getenv("EMAIL_USER")
PASSWORD = os.getenv("EMAIL_PASS")

def get_articles_for_user(user_id=None, db=None):
    close_db = False
    if db is None:
        db = SessionLocal()
        close_db = True
        
    try:
        query = db.query(Article)
        
        if user_id:
            # Exclude articles that have already been delivered to this user
            delivered_subquery = db.query(Delivery.article_id).filter(Delivery.user_id == user_id)
            query = query.filter(Article.id.not_in(delivered_subquery))
            
        return query.order_by(Article.published_at.desc()).limit(10).all()
    finally:
        if close_db:
            db.close()

def generate_email_html(articles):
    html = """
    <div style="margin:0;padding:0;background:#0f172a;font-family:Arial, sans-serif;">
        <div style="max-width:600px;margin:auto;background:#020617;padding:20px;border-radius:12px;color:#e2e8f0;">

            <!-- Header -->
            <div style="text-align:center;padding-bottom:20px;">
                <h1 style="color:#38bdf8;margin:0;">🚀 Code Builders</h1>
                <p style="color:#94a3b8;margin-top:5px;">Your Daily Tech Intelligence</p>
            </div>

            <hr style="border:0;border-top:1px solid #1e293b;margin:20px 0;"/>
    """

    for art in articles:
        html += f"""
            <!-- Article Card -->
            <div style="background:#020617;border:1px solid #1e293b;border-radius:10px;margin-bottom:20px;overflow:hidden;">
                
                <!-- Image -->
                <img src="{art.image_url}" alt="article image" style="width:100%;height:auto;display:block;">

                <!-- Content -->
                <div style="padding:15px;">
                    <h2 style="color:#f1f5f9;font-size:18px;margin:0 0 10px;">
                        {art.title}
                    </h2>

                    <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin-bottom:15px;">
                        {art.ai_summary or art.description}
                    </p>

                    <!-- Button -->
                    <a href="{art.url}" style="
                        display:inline-block;
                        padding:10px 16px;
                        background:#0ea5e9;
                        color:white;
                        text-decoration:none;
                        border-radius:6px;
                        font-size:14px;
                        font-weight:bold;
                    ">
                        Read Full Article →
                    </a>
                </div>
            </div>
        """

    html += """
            <!-- Footer -->
            <div style="text-align:center;margin-top:30px;">
                <p style="font-size:12px;color:#64748b;">
                    Built with ❤️ by Code Builders
                </p>
                <p style="font-size:12px;color:#475569;">
                    You’re receiving this because you subscribed to tech updates.
                </p>
            </div>

        </div>
    </div>
    """

    return html

def send_welcome_email(to_email):
    if not EMAIL or not PASSWORD:
        print("Warning: EMAIL_USER or EMAIL_PASS not configured. Skipping welcome email.")
        return

    subject = "Welcome to Code Builders News Agent 🚀"
    html_content = """
    <div style="margin:0;padding:0;background:#05080F;font-family:'Fira Code', monospace, sans-serif;color:#e2e8f0;">
        <div style="max-width:600px;margin:auto;background:#0A0D14;padding:30px;border-radius:12px;border:1px solid #1e293b;">
            <div style="text-align:center;padding-bottom:20px;">
                <h1 style="color:#38bdf8;margin:0;text-transform:uppercase;letter-spacing:2px;">[SYS_INIT] Code Builders News Agent</h1>
                <p style="color:#94a3b8;margin-top:10px;">Subscription Accepted. Welcome to the global stream.</p>
            </div>
            <hr style="border:0;border-top:1px solid #1e293b;margin:20px 0;"/>
            <div style="padding:15px;color:#cbd5e1;line-height:1.6;">
                <p>Hello Developer,</p>
                <p>You have successfully initialized your subscription to our curated tech feed. Here is what you can expect from our automated intelligence:</p>
                <ul style="list-style-type:square;padding-left:20px;color:#94a3b8;">
                    <li style="margin-bottom:10px;"><strong style="color:#38bdf8;">[AI Curated]:</strong> We scrape the internet and filter out the marketing noise, bringing you only raw, practical updates.</li>
                    <li style="margin-bottom:10px;"><strong style="color:#38bdf8;">[Daily Deploy]:</strong> Expect a daily payload delivered directly to your inbox at 9:00 AM.</li>
                    <li style="margin-bottom:10px;"><strong style="color:#38bdf8;">[Zero Spam]:</strong> No tracking, no fluff. Just pure code and tech news.</li>
                    <li style="margin-bottom:10px;"><strong style="color:#38bdf8;">[Targeted Inbox]:</strong> Browse your personalized feed on the dashboard anytime.</li>
                </ul>
                <p style="margin-top:20px;">Stay synced.</p>
            </div>
            <div style="text-align:center;margin-top:30px;padding-top:20px;border-top:1px solid #1e293b;">
                <p style="font-size:12px;color:#64748b;">Built with ❤️ by Code Builders</p>
                <p style="font-size:12px;color:#475569;">SYSTEM.DATETIME // Automated Dispatch</p>
            </div>
        </div>
    </div>
    """
    msg = MIMEMultipart()
    msg["From"] = EMAIL
    msg["To"] = to_email
    msg["Subject"] = subject

    msg.attach(MIMEText(html_content, "html"))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL, PASSWORD)
        server.sendmail(EMAIL, to_email, msg.as_string())
        server.quit()
        print(f"✅ Welcome email sent to {to_email}")
    except Exception as e:
        print(f"❌ Failed to send welcome email to {to_email}: {e}")

def send_email(to_email, html_content):
    if not EMAIL or not PASSWORD:
        raise RuntimeError("EMAIL_USER/EMAIL_PASS are not configured")

    msg = MIMEMultipart()
    msg["From"] = EMAIL
    msg["To"] = to_email
    msg["Subject"] = "🚀 Your Daily Tech Newsletter"

    msg.attach(MIMEText(html_content, "html"))

    server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    server.starttls()
    server.login(EMAIL, PASSWORD)

    server.sendmail(EMAIL, to_email, msg.as_string())
    server.quit()

def send_newsletters():
    db = SessionLocal()
    sent = 0
    failed = 0
    skipped = 0

    try:
        users = db.query(User).filter_by(is_active=True).all()

        for user in users:
            articles = get_articles_for_user(user.id, db=db)

            if not articles:
                skipped += 1
                continue

            html = generate_email_html(articles)

            try:
                send_email(user.email, html)
                
                # Log successful deliveries so they aren't sent again
                for art in articles:
                    db.add(Delivery(user_id=user.id, article_id=art.id, status="sent"))
                db.commit()
                
                sent += 1
                print(f"✅ Sent to {user.email}")
            except Exception as e:
                db.rollback()
                failed += 1
                print(f"❌ Failed for {user.email}: {e}")

        return {
            "total_users": len(users),
            "sent": sent,
            "failed": failed,
            "skipped_no_matching_articles": skipped,
        }
    finally:
        db.close()