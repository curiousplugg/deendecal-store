import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { resend } from '@/lib/resend';
import { stripe } from '@/lib/stripe';

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL?.trim() || 'DeenDecal <noreply@deendecal.com>';
const REPLY_TO_EMAIL =
  process.env.RESEND_REPLY_TO_EMAIL?.trim() || 'support@deendecal.com';

// Rate limiting: max 3 attempts per IP per hour
const RATE_LIMIT_ATTEMPTS = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

// Get client IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || realIP || 'unknown';
}

// Check rate limit
async function checkRateLimit(ipAddress: string): Promise<{ allowed: boolean; remainingTime?: number }> {
  const oneHourAgo = new Date(Date.now() - RATE_LIMIT_WINDOW);
  
  const { data, error } = await supabaseAdmin
    .from('email_subscriptions')
    .select('attempts, updated_at')
    .eq('ip_address', ipAddress)
    .gte('updated_at', oneHourAgo.toISOString())
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Rate limit check error:', error);
    return { allowed: true }; // Allow on error to avoid blocking legitimate users
  }

  if (data && data.attempts >= RATE_LIMIT_ATTEMPTS) {
    const lastAttempt = new Date(data.updated_at).getTime();
    const remainingTime = Math.ceil((RATE_LIMIT_WINDOW - (Date.now() - lastAttempt)) / 1000 / 60);
    return { allowed: false, remainingTime };
  }

  return { allowed: true };
}

// Validate email format
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

// Get promotion code details from Stripe
async function getPromotionCode(): Promise<{ code: string; id: string }> {
  try {
    const promotionCode = await stripe.promotionCodes.retrieve('promo_1SWpBxBJjaZO6BBgVozRb0yJ');
    return {
      code: promotionCode.code,
      id: promotionCode.id,
    };
  } catch {
    // Fallback to default code
    return {
      code: 'WELCOME20',
      id: 'promo_1SWpBxBJjaZO6BBgVozRb0yJ',
    };
  }
}

// Send email with coupon code
async function sendCouponEmail(email: string, couponCode: string): Promise<boolean> {
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: '🎉 Your 20% Off Discount Code!',
      replyTo: REPLY_TO_EMAIL,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Discount Code</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header with Logo -->
                    <tr>
                      <td align="center" style="padding: 40px 20px 20px; background: linear-gradient(135deg, #2c3f51 0%, #c89d24 100%);">
                        <img src="https://deendecal.com/DDlogo.png" alt="DeenDecal Logo" width="120" height="120" style="display: block; margin: 0 auto; border-radius: 50%; object-fit: cover;">
                      </td>
                    </tr>
                    
                    <!-- Welcome Message -->
                    <tr>
                      <td style="padding: 40px 40px 20px; text-align: center;">
                        <h1 style="margin: 0; color: #2c3f51; font-size: 28px; font-weight: 700; line-height: 1.2;">
                          Welcome to DeenDecal! 🎉
                        </h1>
                        <p style="margin: 20px 0 0; color: #666; font-size: 16px; line-height: 1.6;">
                          Thank you for subscribing! We're thrilled to have you join our community of faith-inspired car enthusiasts.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Coupon Code Box -->
                    <tr>
                      <td style="padding: 30px 40px;">
                        <div style="background: linear-gradient(135deg, #c89d24 0%, #e6b84d 100%); border-radius: 12px; padding: 30px; text-align: center; box-shadow: 0 4px 12px rgba(200, 157, 36, 0.3);">
                          <p style="margin: 0 0 15px; color: #ffffff; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                            Your Exclusive Discount Code
                          </p>
                          <div style="background: #ffffff; border-radius: 8px; padding: 20px; margin: 15px 0; display: inline-block;">
                            <p style="margin: 0; color: #2c3f51; font-size: 32px; font-weight: 800; letter-spacing: 2px; font-family: 'Courier New', monospace;">
                              ${couponCode}
                            </p>
                          </div>
                          <p style="margin: 15px 0 0; color: #ffffff; font-size: 18px; font-weight: 600;">
                            20% OFF Your First Order
                          </p>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Instructions -->
                    <tr>
                      <td style="padding: 0 40px 30px;">
                        <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6; text-align: center;">
                          Use this code at checkout to save 20% on your first purchase of our premium Shahada Metal Car Decals.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- CTA Button -->
                    <tr>
                      <td style="padding: 0 40px 40px; text-align: center;">
                        <a href="https://deendecal.com" style="display: inline-block; background: linear-gradient(135deg, #2c3f51 0%, #c89d24 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                          Shop Now
                        </a>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; background-color: #f8f9fa; border-top: 1px solid #e9ecef;">
                        <p style="margin: 0 0 10px; color: #666; font-size: 12px; text-align: center; line-height: 1.6;">
                          This code is valid for first-time orders only and can be used once per customer.
                        </p>
                        <p style="margin: 0; color: #999; font-size: 12px; text-align: center;">
                          © ${new Date().getFullYear()} DeenDecal. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return false;
    }

    return true;
  } catch {
    console.error('Error sending email');
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!validateEmail(trimmedEmail)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Get client IP for rate limiting
    const ipAddress = getClientIP(request);

    // Check rate limit
    const rateLimit = await checkRateLimit(ipAddress);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many requests. Please try again in ${rateLimit.remainingTime} minutes.`,
        },
        { status: 429 }
      );
    }

    // Get promotion code from Stripe
    const { code: couponCode } = await getPromotionCode();

    // Check if email already exists
    const { data: existingSubscription, error: checkError } = await supabaseAdmin
      .from('email_subscriptions')
      .select('email, coupon_code, email_sent')
      .eq('email', trimmedEmail)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Database check error:', checkError);
      return NextResponse.json(
        { success: false, error: 'Server error. Please try again later.' },
        { status: 500 }
      );
    }

    // If email exists, resend the email
    if (existingSubscription) {
      const emailSent = await sendCouponEmail(trimmedEmail, couponCode);
      
      if (emailSent) {
        // Update last_email_sent_at
        await supabaseAdmin
          .from('email_subscriptions')
          .update({
            last_email_sent_at: new Date().toISOString(),
            email_sent: true,
          })
          .eq('email', trimmedEmail);

        return NextResponse.json({
          success: true,
          message: 'This email is already subscribed! Check your inbox for your discount code.',
          alreadySubscribed: true,
          emailSent: true,
        });
      } else {
        // Email sending failed
        return NextResponse.json({
          success: false,
          error: 'Unable to send email. Please check that your email address is valid and try again. If the problem persists, contact support.',
          alreadySubscribed: true,
          emailSent: false,
        }, { status: 500 });
      }
    }

    // Insert new subscription
    const { data: newSubscription, error: insertError } = await supabaseAdmin
      .from('email_subscriptions')
      .insert({
        email: trimmedEmail,
        coupon_code: couponCode,
        ip_address: ipAddress,
        attempts: 1,
        email_sent: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json(
        { success: false, error: 'Server error. Please try again later.' },
        { status: 500 }
      );
    }

    // Send email with coupon code
    const emailSent = await sendCouponEmail(trimmedEmail, couponCode);

    // Update email_sent status
    if (emailSent) {
      await supabaseAdmin
        .from('email_subscriptions')
        .update({
          email_sent: true,
          last_email_sent_at: new Date().toISOString(),
        })
        .eq('id', newSubscription.id);

      return NextResponse.json({
        success: true,
        message: 'Success! Check your email for your 20% off discount code.',
        emailSent: true,
      });
    } else {
      // Email sending failed - update database to reflect this
      await supabaseAdmin
        .from('email_subscriptions')
        .update({
          email_sent: false,
        })
        .eq('id', newSubscription.id);

      return NextResponse.json({
        success: false,
        error: 'Unable to send email. Please check that your email address is valid and try again. If the problem persists, contact support at deendecal@gmail.com.',
        emailSent: false,
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Subscribe API error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error. Please try again later.' },
      { status: 500 }
    );
  }
}

