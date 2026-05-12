# VaxBuddy Deployment Guide

This guide helps you deploy VaxBuddy to production.

## Prerequisites

- Node.js installed (for local testing)
- Vercel account (free tier works)
- Supabase account (free tier works)
- GitHub account

## Deployment Steps

### 1. Supabase Setup

1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Project Settings → API**
4. Copy your:
   - **Project URL**
   - **Anon Key**

### 2. Enable Supabase Features

#### Authentication
- Go to **Authentication → Providers**
- Email provider is enabled by default
- Customize email templates if needed

#### Storage
1. Go to **Storage**
2. Create new bucket named `photos`
3. Make it **Private**
4. Add policy for authenticated users

#### Database Tables

Run these SQL commands in Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dob DATE NOT NULL,
  avatar TEXT DEFAULT '🐶',
  photo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Create vaccines table
CREATE TABLE vaccines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  due_date DATE NOT NULL,
  done BOOLEAN DEFAULT FALSE,
  done_date DATE,
  notes TEXT,
  age_months NUMERIC,
  custom BOOLEAN DEFAULT FALSE,
  reminder_set BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_vaccines_profile_id ON vaccines(profile_id);
CREATE INDEX idx_vaccines_user_id ON vaccines(user_id);
CREATE INDEX idx_vaccines_due_date ON vaccines(due_date);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccines ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profiles"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profiles"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profiles"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profiles"
  ON profiles FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for vaccines
CREATE POLICY "Users can view their own vaccines"
  ON vaccines FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vaccines"
  ON vaccines FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vaccines"
  ON vaccines FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vaccines"
  ON vaccines FOR DELETE
  USING (auth.uid() = user_id);
```

### 3. Update API Keys in Code

Edit `index.html` (lines 34-37):

```javascript
const sb=createClient(
  'YOUR_SUPABASE_PROJECT_URL',
  'YOUR_SUPABASE_ANON_KEY'
);
```

Replace with your actual Supabase credentials.

### 4. Deploy to Vercel

#### Option A: Via GitHub (Recommended)
1. Go to [vercel.com](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your GitHub repo
4. Click "Deploy"
5. Vercel automatically deploys on every push to `main`

#### Option B: CLI
```bash
npm i -g vercel
cd /path/to/vaxbuddy
vercel --prod
```

### 5. Configure Custom Domain (Optional)

1. In Vercel dashboard, go to project settings
2. Add your custom domain
3. Follow DNS configuration steps
4. Domain active in ~24 hours

## Environment Variables

If using `.env` files (for local development):

```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Monitoring & Maintenance

### Performance
- Check Vercel Analytics dashboard
- Monitor Supabase database performance
- Review error logs regularly

### Backups
- Supabase automatically backs up data daily
- Download backup from Supabase console if needed

### Updates
1. Make changes locally
2. Test thoroughly
3. Commit to GitHub
4. Vercel auto-deploys
5. Verify on production

## Troubleshooting

### Supabase Connection Issues
- Verify API keys are correct
- Check CORS settings in Supabase
- Ensure tables exist and have RLS policies

### Storage Upload Fails
- Check bucket exists and is named `photos`
- Verify RLS policies allow authenticated uploads
- Ensure file size < 5MB

### Auth Not Working
- Verify email provider enabled
- Check email templates are correct
- Confirm user confirmed email before login

## Security Checklist

- [ ] Supabase RLS policies configured
- [ ] Storage bucket is private
- [ ] API keys not exposed in code
- [ ] HTTPS enabled
- [ ] Email verification required
- [ ] Rate limiting configured
- [ ] Backup strategy in place

## Support

For deployment issues:
- Check [Vercel Docs](https://vercel.com/docs)
- Check [Supabase Docs](https://supabase.com/docs)
- Open GitHub issue: https://github.com/adlinbelma/vaxbuddy/issues

---

**Questions?** Reach out via GitHub issues or discussions!
