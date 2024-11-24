import asyncio
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import ssl


class SMTPMessage:

    def __init__(self, sender: str, host: str, port: int, password: str):
        self.password = password
        self.port = port
        self.host = host
        self.sender = sender

    def render_message(self, receiver: str, text: str) -> MIMEMultipart:
        plain_text = \
            f"""Новое обновление по вашему любимому спорту! 
            # {text}
        """

        html_text = \
            f"""<div width="100%" style="margin:0;background-color:#f0f2f3">
            <div style="margin:auto;max-width:600px;padding-top:50px" class="m_-7984133988146846855email-container">
              <table role="presentation" cellspacing="0" cellpadding="0" width="100%" align="center" id="m_-7984133988146846855logoContainer" style="background:#252f3d;border-radius:3px 3px 0 0;max-width:600px">
                <tbody><tr>
                  <td style="background:#252f3d;border-radius:3px 3px 0 0;padding:20px 0 10px 0;text-align:center">
                  </td>
                </tr>
              </tbody>
              </table>
              <table role="presentation" cellspacing="0" cellpadding="0" width="100%" align="center" id="m_-7984133988146846855emailBodyContainer" style="border:0px;border-bottom:1px solid #d6d6d6;max-width:600px">
                  <tbody><tr>
                    <td style="background-color:#fff;color:#444;font-family:'Amazon Ember','Helvetica Neue',Roboto,Arial,sans-serif;font-size:14px;line-height:140%;padding:25px 35px">
                    {text}
                    </td>
                  </tr>
              <tr>
                <td style="background-color:#fff;color:#444;font-family:'Amazon Ember','Helvetica Neue',Roboto,Arial,sans-serif;font-size:14px;line-height:140%;padding:25px 35px;padding-top:0;text-align:center">
                  <div style="font-weight:bold;padding-bottom:15px"></div>
                  <div style="color:#000;font-size:36px;font-weight:bold;padding-bottom:15px"></div>
                  <div style="color:#444;font-size:10px"></div>
                </td>
              </tr>
              </tbody>
              </table>
                </div>
        </div>
            """

        message = MIMEMultipart('alternative')
        message['From'] = self.sender
        message['To'] = receiver
        message['Subject'] = 'Уведомление от сервиса спортивных мероприятий!'
        # Add HTML/plain-text parts to MIMEMultipart message
        # The email client will try to render the last part first
        for text in [MIMEText(plain_text, 'plain'), MIMEText(html_text, 'html')]:
            message.attach(text)

        return message

    def send_email(self, receiver: str, text: str):
        ctx = ssl.create_default_context()
        msg = self.render_message(receiver, text)
        with smtplib.SMTP_SSL(self.host, self.port, context=ctx) as server:
            server.login(self.sender, self.password)
            return server.sendmail(self.sender, receiver, msg.as_string())

    async def asend_email(self, receiver: str, text: str):
        return await asyncio.to_thread(self.send_email, receiver, text)
