# Mukoyisana App

**Hausa Learning Platform – Video + Admin Analytics**

## 🧾 Project Structure
- `src/pages/AdminShareAnalytics.jsx`: Admin page to track shares
- `src/components/`: Placeholder for UI components
- `firebase.js`: Firebase config (replace with your actual keys)
- `package.json`: React project dependencies

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Visit: `http://localhost:5173` (or your Vite base)

## 🔐 Firebase Setup
Update `firebase.js` with your Firebase project configuration

## 📊 Admin Analytics
- View chart of shares by platform
- Filter: today, this week, all time
- Export share logs as CSV
- Embed code and QR sharing

## 🌍 Deployment (Netlify)
1. Push this folder to GitHub
2. Go to [https://netlify.com](https://netlify.com)
3. “Import project from GitHub”
4. Set build: `npm run build` and publish dir: `dist`

Happy Learning ✨
