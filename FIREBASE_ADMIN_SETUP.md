# Firebase Admin SDK Setup for Server-Side File Uploads

## Overview
The application now uses Firebase Admin SDK for server-side file uploads to bypass client-side permission issues. This document explains how to set up the required environment variables.

## Required Environment Variables

You need to add the following environment variables to your Vercel deployment:

### Firebase Admin SDK Variables
- `FIREBASE_PROJECT_ID` - Your Firebase project ID
- `FIREBASE_CLIENT_EMAIL` - Service account email
- `FIREBASE_PRIVATE_KEY` - Service account private key
- `FIREBASE_STORAGE_BUCKET` - Your Firebase storage bucket

## How to Get Firebase Admin SDK Credentials

1. **Go to Firebase Console**
   - Visit https://console.firebase.google.com
   - Select your project

2. **Navigate to Service Accounts**
   - Click on the gear icon next to "Project Overview"
   - Select "Project settings"
   - Go to the "Service accounts" tab

3. **Generate Private Key**
   - Click "Generate new private key"
   - This will download a JSON file with your credentials

4. **Extract Required Values**
   - Open the downloaded JSON file
   - Copy the following values:
     - `project_id` → `FIREBASE_PROJECT_ID`
     - `client_email` → `FIREBASE_CLIENT_EMAIL`
     - `private_key` → `FIREBASE_PRIVATE_KEY`
   - For storage bucket, use the same value as `VITE_FIREBASE_STORAGE_BUCKET`

## Adding to Vercel

1. **Go to Vercel Dashboard**
   - Navigate to your project settings
   - Go to "Environment Variables"

2. **Add Each Variable**
   - Add `FIREBASE_PROJECT_ID`
   - Add `FIREBASE_CLIENT_EMAIL`
   - Add `FIREBASE_STORAGE_BUCKET`
   
3. **Add Private Key (Special Handling)**
   - For `FIREBASE_PRIVATE_KEY`, copy the entire private key including:
     - `-----BEGIN PRIVATE KEY-----`
     - All the key content
     - `-----END PRIVATE KEY-----`
   - Make sure to include the newline characters (`\n`)

## Important Notes

### Private Key Formatting
- The private key in the JSON file contains `\n` characters
- When adding to Vercel, paste the key exactly as it appears in the JSON file
- The API code handles converting `\\n` to actual newlines

### Security
- Never commit the service account JSON file to your repository
- Keep these credentials secure
- Only use them in server-side code (API routes)

### Storage Bucket
- Should be the same as your client-side storage bucket
- Format: `your-project-id.appspot.com`

## Testing

After adding the environment variables:

1. Redeploy your Vercel application
2. Test the file upload functionality
3. Check Vercel function logs for any errors

## Troubleshooting

If file uploads fail:

1. **Check Vercel Function Logs**
   - Go to Vercel dashboard → Functions tab
   - Look for errors in `/api/upload-files`

2. **Verify Environment Variables**
   - Ensure all 4 Firebase Admin variables are set
   - Check that the private key is properly formatted

3. **Firebase Storage Rules**
   - The Admin SDK bypasses security rules
   - But ensure your storage bucket exists and is properly configured

4. **Common Issues**
   - Missing environment variables
   - Incorrectly formatted private key
   - Wrong project ID or storage bucket name