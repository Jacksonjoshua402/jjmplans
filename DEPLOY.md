# Deploying to Netlify via GitHub

## 1. Push to GitHub

From the project root:

```
git init
git add .
git commit -m "Add Firebase auth"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## 2. Connect Netlify

- Netlify dashboard → "Add new site" → "Import an existing project" → GitHub → select the repo
- Build settings are already defined in `netlify.toml` (build command `npm run build`, publish dir `dist`), so Netlify should auto-detect them
- Deploy

## 3. Set the site name

In Netlify: Site settings → Domain management → change the site name so the URL is `jjmplans.netlify.app`.

## 4. Firebase authorized domains

`jjmplans.netlify.app` is already on the Authorized domains list in Firebase Auth, so no action needed there. If you ever change the Netlify URL, add the new one at:
Firebase Console → Authentication → Settings → Authorized domains.

## 5. Test

Visit `https://jjmplans.netlify.app`, try signing up with email/password and with Google, and confirm login persists on refresh.
