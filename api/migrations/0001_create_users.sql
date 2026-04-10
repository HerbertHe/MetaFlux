CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  nickname TEXT,
  email TEXT UNIQUE,
  phone_country_code TEXT,
  phone_number TEXT,
  phone_e164 TEXT UNIQUE,
  account TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- partial unique indexes for nullable fields (more explicit than column UNIQUE)
CREATE UNIQUE INDEX IF NOT EXISTS users_email_key ON users(email) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS users_phone_e164_key ON users(phone_e164) WHERE phone_e164 IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS users_account_key ON users(account) WHERE account IS NOT NULL;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'users_set_updated_at'
  ) THEN
    CREATE TRIGGER users_set_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;

