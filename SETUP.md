# PasteAnywhere Setup Guide

## 🚀 Quick Start

### 1. Set up Upstash Redis (Free)

1. Go to [https://console.upstash.com/](https://console.upstash.com/)
2. Sign up for a free account (no credit card required)
3. Click "Create Database"
4. Choose:
   - **Name**: pasteanywhere
   - **Type**: Regional
   - **Region**: Choose closest to you
   - **Primary Region**: Auto-selected
5. Click "Create"
6. On the database page, scroll down to "REST API" section
7. Copy:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### 2. Configure Environment Variables

1. Create a `.env.local` file in the project root:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Upstash credentials:
   ```env
   UPSTASH_REDIS_REST_URL=https://your-url.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your-token-here
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Test the Application

1. **On your computer**:
   - Paste some text in the textarea
   - Click "Generate QR Code"
   
2. **On your phone**:
   - Scan the QR code with your camera
   - The content will open in your browser
   - Click "Copy to Clipboard"
   - Paste anywhere!

## 📱 Testing Cross-Device

- Make sure both devices are on the same network OR
- Use a tool like [ngrok](https://ngrok.com/) to expose your local server:
  ```bash
  npx ngrok http 3000
  ```
  Then update `NEXT_PUBLIC_BASE_URL` in `.env.local` to the ngrok URL.

## 🚀 Deploy to Production

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add environment variables:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `NEXT_PUBLIC_BASE_URL` (your Vercel URL)
6. Click "Deploy"

Your app will be live at `https://your-app.vercel.app`!

## 🔧 Troubleshooting

### QR Code not generating?
- Check browser console for errors
- Verify Redis credentials in `.env.local`

### Content not loading on mobile?
- Ensure `NEXT_PUBLIC_BASE_URL` is set correctly
- For local testing, use ngrok or ensure devices are on same network

### "Content not found" error?
- Content expires after 5 minutes
- Content is deleted after first access
- Check Redis connection
