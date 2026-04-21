import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from dotenv import load_dotenv

from db.connection import SessionLocal
from db.models import Article, Delivery, User

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
            delivered_subquery = db.query(Delivery.article_id).filter(
                Delivery.user_id == user_id
            )
            query = query.filter(Article.id.not_in(delivered_subquery))

        return query.order_by(Article.published_at.desc()).limit(10).all()
    finally:
        if close_db:
            db.close()


def generate_email_html(articles):
    html = """<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#050505;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
    <div style="margin:0;padding:0;background:#050505;font-family:Consolas,'Courier New',monospace;color:#e5e5e5;">
        <div style="max-width:640px;margin:auto;background:#0A0A0A;padding:24px;border-radius:12px;border:1px solid #1f1f1f;">

            <!-- HEADER -->
            <div style="text-align:center;margin-bottom:20px;">
                <h1 style="color:#ef4444;margin:0;font-size:26px;letter-spacing:2px;">DEV9</h1>
                <p style="color:#737373;margin-top:6px;">// daily developer newsletter @ 09:00</p>
            </div>

            <hr style="border:0;border-top:1px solid #1f1f1f;margin:20px 0;" />

            <!-- MAC TERMINAL INFO -->
            <div style="border:1px solid #1f1f1f;border-radius:10px;overflow:hidden;margin-bottom:26px;">
              <!-- Top bar -->
              <div style="background:#161b22;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;">
                <div>
                  <span style="display:inline-block;width:12px;height:12px;background:#ff5f56;border-radius:50%;margin-right:6px;"></span>
                  <span style="display:inline-block;width:12px;height:12px;background:#ffbd2e;border-radius:50%;margin-right:6px;"></span>
                  <span style="display:inline-block;width:12px;height:12px;background:#27c93f;border-radius:50%;"></span>
                </div>
              </div>
              <!-- Terminal body -->
              <div style="background:#020202;padding:16px 20px;font-size:14px;line-height:1.7;font-family:Consolas,'Courier New',monospace;">
                <p style="margin:0;color:#ef4444;">$ dev9 --run</p>
                <p style="margin:4px 0 0 0;color:#ffffff;">✔ fetched {len(articles)} high-signal articles</p>
              </div>
            </div>
    """

    for art in articles:
        html += f"""
            <!-- ARTICLE -->
            <div style="border-bottom:1px solid #1f1f1f;padding:16px 0;">

                <!-- IMAGE -->
                <div style="margin-bottom:12px;">
                    <img src="{art.image_url or ''}"
                         alt="article image"
                         style="width:100%;height:auto;border-radius:6px;display:block;"
                         onerror="this.style.display='none';" />
                </div>

                <!-- TITLE -->
                <h2 style="color:#f5f5f5;font-size:17px;margin:0 0 8px;">
                    {art.title}
                </h2>

                <!-- SUMMARY -->
                <p style="color:#a3a3a3;font-size:14px;line-height:1.6;margin-bottom:10px;">
                    {art.ai_summary or art.description}
                </p>

                <!-- CTA -->
                <a href="https://dev9-web.vercel.app/today"
                   style="color:#ef4444;text-decoration:none;font-size:13px;font-weight:bold;">
                    > read_more()
                </a>

            </div>
        """

    html += """
            <!-- FOOTER -->
            <div style="margin-top:24px;padding-top:16px;border-top:1px solid #1f1f1f;text-align:center;">
                <p style="font-size:12px;color:#525252;">
                    // dev9 system • built by Code Builders
                </p>
                <p style="font-size:11px;color:#404040;">
                    signal > noise • unsubscribe anytime
                </p>
            </div>

        </div>
    </div>
</body>
</html>
    """

    return html


def send_welcome_email(to_email):
    if not EMAIL or not PASSWORD:
        print(
            "Warning: EMAIL_USER or EMAIL_PASS not configured. Skipping welcome email."
        )
        return

    subject = "Welcome to Dev9 — Your Daily News-Letter for Developers"

    html_content = """<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#050505;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
    <div style="margin:0;padding:0;background:#050505;font-family:Consolas,'Courier New',monospace;color:#e5e5e5;">
      <div style="max-width:640px;margin:auto;background:#0A0A0A;border:1px solid #1f1f1f;border-radius:14px;padding:28px;">

        <!-- HEADER -->
        <div style="text-align:left;margin-bottom:24px;">
          <h1 style="color:#ef4444;margin:0;font-size:30px;letter-spacing:3px;">DEV9</h1>
          <p style="color:#737373;margin-top:6px;">// daily developer news-letter @ 09:00</p>
        </div>

        <hr style="border:0;border-top:1px solid #1f1f1f;margin:20px 0;" />

        <!-- MAC TERMINAL UI -->
        <div style="border:1px solid #1f1f1f;border-radius:10px;overflow:hidden;margin-bottom:26px;">
          
          <!-- Top bar -->
          <div style="background:#161b22;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;">
            <div>
              <span style="display:inline-block;width:12px;height:12px;background:#ff5f56;border-radius:50%;margin-right:6px;"></span>
              <span style="display:inline-block;width:12px;height:12px;background:#ffbd2e;border-radius:50%;margin-right:6px;"></span>
              <span style="display:inline-block;width:12px;height:12px;background:#27c93f;border-radius:50%;"></span>
            </div>
          </div>

          <!-- Terminal body (RED THEME FIXED) -->
          <div style="background:#020202;padding:18px 20px;font-size:14px;line-height:1.7;font-family:Consolas,'Courier New',monospace;">

            <!-- Command -->
            <p style="margin:0;color:#ef4444;">
              $ dev9 --init
            </p>

            <!-- Output -->
            <p style="margin:4px 0 12px 0;color:#ffffff;">
              ✔ connection established
            </p>

            <!-- Command -->
            <p style="margin:0;color:#ef4444;">
              $ enable news-letter
            </p>

            <!-- Output -->
            <p style="margin:4px 0 12px 0;color:#ffffff;">
              ✔ daily intelligence stream activated
            </p>

            <!-- Command -->
            <p style="margin:0;color:#ef4444;">
              $ system_status
            </p>

            <!-- Output (highlight state) -->
            <p style="margin:4px 0;color:#ffffff;font-weight:600;">
              READY // SIGNAL LOCKED
            </p>

          </div>
        </div>

        <!-- BODY -->
        <div style="color:#d4d4d4;line-height:1.7;font-size:14px;">

          <!-- BIG WELCOME -->
          <h2 style="color:#ef4444;font-size:22px;margin-bottom:10px;">
            // WELCOME TO DEV9
          </h2>

          <p style="margin:0 0 14px 0;">
            you’re now connected to <span style="color:#ef4444;">Dev9 News-Letter</span> —
            a system built for developers who value <span style="color:#ef4444;">signal over noise</span>.
          </p>

          <p>
            every day at 09:00, you’ll receive a curated stream of 
            <span style="color:#ef4444;">high-impact tech updates</span>,
            refined with AI to keep you informed, fast, and ahead.
          </p>

          <p style="margin-top:10px;">
            no distractions. no generic content. just what actually matters.
          </p>

          <!-- FEATURE BLOCK -->
          <div style="margin-top:22px;background:#020202;padding:16px;border-radius:8px;border:1px solid #1f1f1f;">
            <p style="margin:0;color:#ef4444;"><span style="color:#ef4444;">//</span> capabilities</p>
            <ul style="padding-left:18px;margin-top:12px;color:#a3a3a3;line-height:1.6;">
              <li><span style="color:#ef4444;">AI-curated articles</span> → filtered for relevance</li>
              <li><span style="color:#ef4444;">sharp summaries</span> → instant understanding</li>
              <li><span style="color:#ef4444;">real dev ecosystem</span> → tools, AI, trends</li>
              <li><span style="color:#ef4444;">personalized feed</span> → built around you</li>
            </ul>
          </div>

          <!-- CTA -->
          <div style="text-align:center;margin:30px 0;">
            <a href="https://dev9-web.vercel.app"
               style="display:inline-block;background:#ef4444;color:#020202;padding:12px 24px;border-radius:8px;font-weight:bold;text-decoration:none;">
               > open_news_dashboard()
            </a>
          </div>

          <p>
            first drop scheduled at <span style="color:#ef4444;">09:00</span>.
          </p>

          <p style="margin-top:16px;">
            stay sharp ⚡  
            <br/>— dev9 news system
          </p>

        </div>

        <!-- FOOTER -->
        <div style="margin-top:28px;padding-top:16px;border-top:1px solid #1f1f1f;text-align:center;">
          <p style="font-size:12px;color:#525252;">
            built by Code Builders • engineered for developers
          </p>
        </div>

      </div>
    </div>
</body>
</html>
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