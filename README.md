# Amplify — Training & Development

## Deploying this (no coding required)

### 1. Create a GitHub repository
1. Go to github.com and sign in (create a free account if you don't have one).
2. Click the **+** in the top right → **New repository**.
3. Name it anything (e.g. `amplify-training-app`), leave it Public or Private (either works), click **Create repository**.
4. On the new repo's page, click **"uploading an existing file"** (a link in the quick-setup box).
5. Drag every file and folder from this project into that upload box — including hidden structure like `src/`, `public/`, `.gitignore`, `package.json`, etc.
6. Scroll down, click **Commit changes**.

### 2. Deploy on Vercel
1. Go to vercel.com and sign in **using your GitHub account** (click "Continue with GitHub").
2. Click **"Add New..." → "Project"**.
3. Find and select the repository you just created, click **Import**.
4. Vercel auto-detects this as a Vite project — leave all settings as default.
5. Click **Deploy**.
6. Wait ~1 minute. You'll get a live URL like `amplify-training-app.vercel.app`.

### 3. Test it
- Open the URL on your laptop — everything should look and work the same as in the preview.
- Open the same URL on a phone browser → tap the browser's share/menu button → **"Add to Home Screen"**. It now behaves like an installed app.
- Check the small status line under the "Amplify" title — it should say **"Connected to live database"** in green. If it shows an error instead, copy the exact error text back to Claude to get it fixed.

### 4. Future updates
Whenever there's a code change:
1. Get the updated file(s) from Claude.
2. Go back to your GitHub repository → navigate to the file that changed → click the pencil (edit) icon → paste in the new content → **Commit changes**.
3. Vercel automatically redeploys within about a minute — no extra steps needed. Everyone using the link gets the update automatically.

## Local development (optional, only if you want to run it on your own machine)
```
npm install
npm run dev
```
Then open the local URL it prints (usually `http://localhost:5173`).
