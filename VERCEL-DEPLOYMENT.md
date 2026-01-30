# Vercel Deployment Guide

## Environment Variables Setup

Your build was failing because Firebase environment variables weren't configured on Vercel. Follow these steps to fix it:

### Required Environment Variables

Go to your Vercel project settings and add these environment variables:

#### Firebase Configuration (Required for Firebase features)
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### Optional Environment Variables
```
NEXT_PUBLIC_NODERED_URL=your_nodered_url
GEMINI_API_KEY=your_gemini_api_key
```

### How to Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with its value
4. Select the environment(s): Production, Preview, Development
5. Click **Save**
6. **Redeploy** your application

### Firebase Setup

If you haven't set up Firebase yet:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Click on the web app icon (</>)
6. Copy the configuration values
7. Add them to Vercel environment variables

### Quick Deploy

After adding environment variables:

```bash
# Push changes to trigger new deployment
git add .
git commit -m "Fix Firebase initialization for Vercel deployment"
git push origin main
```

### What Was Fixed

The following changes were made to resolve the build error:

1. **Firebase Initialization**: Made conditional to prevent errors when env vars are missing
2. **API Routes**: Added checks to gracefully handle missing Firebase configuration
3. **Build-time Safety**: Firebase only initializes when valid configuration is present

### Testing Locally

To test with Firebase locally:

1. Copy `.env.example` to `.env.local`
2. Add your Firebase credentials
3. Run `npm run dev`

### Without Firebase

The application will still build successfully without Firebase credentials, but Firebase-dependent features will return a 503 error with a helpful message.

## Troubleshooting

### Build still failing?

1. Verify all environment variables are set correctly in Vercel
2. Make sure there are no typos in variable names
3. Check that values don't have extra spaces or quotes
4. Redeploy after making changes

### Need to disable Firebase temporarily?

Simply don't set the Firebase environment variables, and the app will build but those features will be unavailable.
