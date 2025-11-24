-- Create email_subscriptions table
CREATE TABLE IF NOT EXISTS email_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  coupon_code VARCHAR(50) DEFAULT 'WELCOME20',
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email_sent BOOLEAN DEFAULT false,
  last_email_sent_at TIMESTAMP WITH TIME ZONE,
  ip_address VARCHAR(45),
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_email ON email_subscriptions(email);

-- Create index on ip_address for rate limiting
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_ip ON email_subscriptions(ip_address);

-- Create index on subscribed_at for analytics
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_subscribed_at ON email_subscriptions(subscribed_at);

-- Enable Row Level Security (RLS)
ALTER TABLE email_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (for API)
CREATE POLICY "Allow public inserts" ON email_subscriptions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow service role to read all
CREATE POLICY "Allow service role read" ON email_subscriptions
  FOR SELECT
  TO service_role
  USING (true);

