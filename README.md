# Mee — React + Vite + Supabase Auth

A minimal React/Vite starter with Google OAuth sign-in, a persistent Supabase session, an OAuth callback route, and a protected `/dashboard` route.

## 1. Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

The `.env.example` contains this project's Supabase URL and publishable key. These are browser-safe public values; never put a Supabase service-role key in a Vite variable.

## 2. Enable Google sign-in in Supabase

In the Supabase Dashboard for project `mee-auth`:

1. Open **Authentication → Sign In / Providers → Google** and enable Google.
2. Create a Google OAuth client in Google Cloud Console (OAuth client type: **Web application**).
3. Copy the Google **Client ID** and **Client Secret** into the Supabase Google provider settings and save.
4. Copy the Supabase callback URL shown in that provider panel (usually `https://gaahycucasqhhyxfsmjw.supabase.co/auth/v1/callback`) into the Google OAuth client's **Authorized redirect URIs**.
5. Under **Authentication → URL Configuration**, set your Site URL to your deployed app URL. Add the local and deployed callback URLs to Redirect URLs, for example:
   - `http://localhost:5173/auth/callback`
   - `https://YOUR-DOMAIN/auth/callback`

Do not use the app callback URL as the Google provider's authorized redirect URI; Google redirects to Supabase's callback, then Supabase returns the user to this app.

## 3. Routes

- `/login` — public Google sign-in page.
- `/auth/callback` — completes OAuth session handling.
- `/dashboard` — protected route; redirects unauthenticated users to `/login` and returns them to their intended route after login.

## 4. Environment variables

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Only the publishable key belongs in frontend code. Keep service-role keys and OAuth client secrets out of the repository and browser.
