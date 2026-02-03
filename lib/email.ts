import { Resend } from 'resend';

// Lazy initialization to avoid build-time errors when API key is not set
let resend: Resend | null = null;
function getResendClient(): Resend {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'Daily Spark <hello@dailyspark.app>';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

interface SendWelcomeEmailParams {
  email: string;
  category: string;
  style: string;
  deliveryTime: string;
  isTrial: boolean;
}

export async function sendWelcomeEmail({
  email,
  category,
  style,
  deliveryTime,
  isTrial,
}: SendWelcomeEmailParams) {
  const subject = isTrial 
    ? '✨ Welcome to Daily Spark — Your 7-day trial starts now'
    : '✨ Welcome to Daily Spark — You\'re all set!';

  const trialNote = isTrial 
    ? `<p style="color: #a1a1aa; font-size: 14px; margin: 20px 0; padding: 15px; background: #18181b; border-radius: 8px;">
        🎁 <strong>Your 7-day free trial has started.</strong> After the trial, you can subscribe for $49/year to keep receiving daily wallpapers.
      </p>`
    : '';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #09090b; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 500px;" cellpadding="0" cellspacing="0">
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom: 30px;">
              <h1 style="color: #ffffff; font-size: 28px; margin: 0;">Welcome to Daily Spark ✨</h1>
            </td>
          </tr>
          
          <!-- Main content -->
          <tr>
            <td style="color: #a1a1aa; font-size: 16px; line-height: 1.6;">
              <p style="margin: 0 0 20px;">
                You're all set! Starting tomorrow, you'll receive a beautiful AI-generated wallpaper with an inspiring quote every morning.
              </p>
              
              ${trialNote}
              
              <p style="margin: 20px 0;">
                <strong style="color: #ffffff;">Your preferences:</strong>
              </p>
              
              <table style="width: 100%; background: #18181b; border-radius: 8px; padding: 20px;">
                <tr>
                  <td style="color: #71717a; padding: 8px 0;">Category</td>
                  <td style="color: #ffffff; text-align: right; text-transform: capitalize;">${category}</td>
                </tr>
                <tr>
                  <td style="color: #71717a; padding: 8px 0;">Style</td>
                  <td style="color: #ffffff; text-align: right; text-transform: capitalize;">${style}</td>
                </tr>
                <tr>
                  <td style="color: #71717a; padding: 8px 0;">Delivery Time</td>
                  <td style="color: #ffffff; text-align: right;">${deliveryTime} (your timezone)</td>
                </tr>
              </table>

              <p style="margin: 30px 0 20px;">
                <strong style="color: #ffffff;">How to use your wallpapers:</strong>
              </p>
              
              <ol style="margin: 0; padding-left: 20px; color: #a1a1aa;">
                <li style="margin-bottom: 10px;">Open the daily email on your phone</li>
                <li style="margin-bottom: 10px;">Long-press the wallpaper image</li>
                <li style="margin-bottom: 10px;">Tap "Save to Photos"</li>
                <li style="margin-bottom: 10px;">Go to Settings → Wallpaper → Add New</li>
              </ol>

              <p style="margin: 30px 0 20px;">
                <strong style="color: #ffffff;">⚡ Want it fully automated?</strong>
              </p>
              
              <p style="margin: 0 0 20px;">
                Download our iOS Shortcut to automatically set your wallpaper every morning — zero taps required.
              </p>
              
              <table cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                <tr>
                  <td style="background: #27272a; border-radius: 8px;">
                    <a href="${BASE_URL}/shortcut" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-weight: 500;">
                      Get iOS Shortcut →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding-top: 40px; border-top: 1px solid #27272a; text-align: center;">
              <p style="color: #52525b; font-size: 12px; margin: 0;">
                Questions? Just reply to this email.<br><br>
                <a href="${BASE_URL}/unsubscribe?email=${encodeURIComponent(email)}" style="color: #71717a;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const { data, error } = await getResendClient().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject,
      html,
    });

    if (error) {
      console.error('Failed to send welcome email:', error);
      return { success: false, error };
    }

    console.log('Sent welcome email to:', email, 'ID:', data?.id);
    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
}

interface SendTrialEndingEmailParams {
  email: string;
  daysLeft: number;
}

export async function sendTrialEndingEmail({
  email,
  daysLeft,
}: SendTrialEndingEmailParams) {
  const subject = daysLeft === 1 
    ? '⏰ Your Daily Spark trial ends tomorrow'
    : `⏰ Your Daily Spark trial ends in ${daysLeft} days`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #09090b; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 500px;" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding-bottom: 30px;">
              <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Your trial ends ${daysLeft === 1 ? 'tomorrow' : `in ${daysLeft} days`}</h1>
            </td>
          </tr>
          
          <tr>
            <td style="color: #a1a1aa; font-size: 16px; line-height: 1.6;">
              <p style="margin: 0 0 20px;">
                Hi there! Your Daily Spark free trial is almost over. After your trial ends, you'll stop receiving daily wallpapers.
              </p>
              
              <p style="margin: 0 0 30px;">
                If you've been enjoying your morning wallpapers, subscribe now to keep them coming:
              </p>
              
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto 30px;">
                <tr>
                  <td style="background: linear-gradient(to right, #f59e0b, #ea580c); border-radius: 8px;">
                    <a href="${BASE_URL}?upgrade=true" style="display: inline-block; padding: 14px 28px; color: #000000; text-decoration: none; font-weight: 600;">
                      Subscribe — $49/year
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0; color: #71717a; font-size: 14px; text-align: center;">
                That's just $4.08/month — less than one coffee.
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="padding-top: 40px; border-top: 1px solid #27272a; text-align: center;">
              <p style="color: #52525b; font-size: 12px; margin: 0;">
                <a href="${BASE_URL}/unsubscribe?email=${encodeURIComponent(email)}" style="color: #71717a;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const { data, error } = await getResendClient().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject,
      html,
    });

    if (error) {
      console.error('Failed to send trial ending email:', error);
      return { success: false, error };
    }

    console.log('Sent trial ending email to:', email);
    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Error sending trial ending email:', error);
    return { success: false, error };
  }
}
