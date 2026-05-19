# Grok Vision API Integration - Setup Guide

This guide explains how to set up and deploy Grok Vision API integration for automated vaccine data extraction in VaxBuddy.

## What Was Changed

1. **api/extract-vaccine-data.js** - New Vercel Edge Function that securely handles Grok Vision API calls
2. **index.html** - Added `extractVaccineDataFromImage()` function and modified photo upload handler
3. **.env.local** - Local environment variables (for testing)
4. **vercel.json** - Updated configuration for Edge Function deployment

## Features

When users upload a vaccine photo:
- ✅ Photo is uploaded to Supabase storage
- ✅ Image is sent to Grok Vision API for analysis
- ✅ Extracted vaccine data automatically fills form fields:
  - Injection name
  - Batch number
  - Expiry date
  - Manufacturer
  - Date manufactured
- ✅ User can edit extracted data if needed
- ✅ All extraction happens securely on backend (API key never exposed to browser)

## Prerequisites

1. **Grok API Account** (required)
   - Visit: https://console.x.ai
   - Sign up or log in
   - Create an API key
   - Ensure you have available credits for vision API calls

2. **Vercel Account** (recommended, free)
   - Visit: https://vercel.com
   - Sign up
   - Install Vercel CLI: `npm install -g vercel`

## Setup Steps

### Option A: Deploy to Vercel (Recommended)

**1. Get Grok API Key**
```
1. Go to https://console.x.ai
2. Navigate to API Keys section
3. Create new API key
4. Copy the key (format: xai-xxx...)
```

**2. Prepare Repository**
```bash
cd /Users/adlin-6684/vaxbuddy
git init                          # If not already initialized
git add .
git commit -m "Add Grok Vision integration"
```

**3. Deploy to Vercel**
```bash
npm install -g vercel            # Install Vercel CLI if needed
vercel                           # Deploy
# Follow prompts:
# - "Link to existing project?" → No
# - "What's your project's name?" → vaxbuddy
# - "In which directory is your code?" → ./ (current directory)
```

**4. Set Environment Variable on Vercel**
After deployment, go to your project on Vercel dashboard:
1. Go to https://vercel.com/dashboard
2. Select your "vaxbuddy" project
3. Click "Settings" → "Environment Variables"
4. Add new variable:
   - Name: `GROK_API_KEY`
   - Value: `xai-your-api-key-here` (paste your actual key)
5. Click "Save"
6. Click "Deployments" and redeploy for the variable to take effect

**5. Test It**
- Open your VaxBuddy app on Vercel domain
- Select a profile and mark a vaccine as done
- Upload a vaccine photo (labels, batch info, expiry date visible)
- The form should auto-fill with extracted data

---

### Option B: Local Testing with Vercel Dev

**1. Get Grok API Key** (same as above)

**2. Create .env.local**
```bash
cd /Users/adlin-6684/vaxbuddy
cat > .env.local << EOF
GROK_API_KEY=xai-your-api-key-here
EOF
```

**3. Install & Run Vercel Dev**
```bash
npm install -g vercel
vercel dev
```

This will run your app with the Edge Function locally at `http://localhost:3000`

**4. Test**
- Open http://localhost:3000
- Upload a vaccine photo in the app
- Check that fields auto-fill

---

### Option C: Local Testing Only (Without Deployment)

If you want to test locally before deploying:

**1. Install Node.js** (if not already installed)
   - Download from https://nodejs.org

**2. Create .env.local**
```bash
cd /Users/adlin-6684/vaxbuddy
echo "GROK_API_KEY=xai-your-api-key-here" > .env.local
```

**3. Run with Vercel Dev**
```bash
npm install -g vercel
vercel dev
```

**4. Open http://localhost:3000 and test photo extraction**

---

## How It Works

```
User uploads vaccine photo
        ↓
Photo converted to base64 (browser)
        ↓
Browser sends to /api/extract-vaccine-data (backend)
        ↓
Backend receives request securely
        ↓
Backend calls Grok Vision API with API key (secure!)
        ↓
Grok Vision analyzes image and extracts text
        ↓
Backend parses JSON response
        ↓
Backend returns extracted fields to browser
        ↓
Browser auto-fills form fields
        ↓
User can edit and confirm
```

## Troubleshooting

### "API key not configured"
- Verify `GROK_API_KEY` is set in Vercel Environment Variables
- Redeploy after setting the variable
- Check vercel.json has `env` section configured

### "No vaccine data found in image"
- Image quality might be too low
- Try images with clear, readable text
- Ensure batch info, dates, manufacturer names are visible
- Lighting should be good (not blurry)

### "Failed to extract vaccine data"
- Check Grok account has API credits available
- Verify image file is supported (JPG, PNG, WebP)
- Check file size is under 5MB
- Ensure internet connection is stable

### Photo uploads but data not extracted
- This is OK! User can manually enter the data
- Some image types may not extract perfectly
- Manual entry is always available as fallback

### 400/500 Errors in browser console
- Check API key is correct in Vercel environment
- Verify Edge Function file is in `api/extract-vaccine-data.js`
- Try the request again (may be transient Grok API issue)

## Testing Image Tips

For best results, take photos of:
- Vaccine vials with clear labels
- Documentation papers with printed text
- Batch/lot numbers, expiry dates
- Manufacturer names/logos

Avoid:
- Handwritten text (use handwriting OCR instead)
- Very small text
- Blurry/low contrast images
- Photos at extreme angles

## Cost

- **Grok Vision API**: Pay-as-you-go per API call
  - Estimated: $0.01-0.05 per image depending on image size
  - Typical: ~3 calls per vaccine administered
  - Example: 100 vaccines = ~$1-5 in API costs

- **Vercel Deployment**: Free tier includes Edge Functions

## Next Steps

1. ✅ Set up Grok API account
2. ✅ Update `.env.local` with your API key
3. ✅ Deploy to Vercel OR run `vercel dev`
4. ✅ Test with vaccine photos
5. ✅ Commit changes to git if satisfied

## Questions?

- Grok Docs: https://docs.x.ai/api/vision
- Vercel Docs: https://vercel.com/docs
- VaxBuddy Repo: Contact your developer

## Rollback

If you need to disable Grok Vision:
1. Delete `/api/extract-vaccine-data.js`
2. Revert the `index.html` photo upload changes
3. The app will still work with manual data entry
4. Photo uploads will still work without extraction
