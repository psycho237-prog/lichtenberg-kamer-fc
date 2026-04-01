# 🦁 Lichtenberg-Kamer e.V Website

A professional football club website for the Cameroonian community in Berlin. A fully dynamic site with a custom CMS to manage players, matches, news, statistics, and sponsors.

- **Official Domain**: [https://lichtenbergkamer.page](https://lichtenbergkamer.page)
- **Admin Panel**: `/lkev-admin/login`

## ✨ Key Features
- **Dynamic Content Management**: Custom CMS to manage News, Matches, Players, Top Scorers, and Galleries.
- **Automated Statistics**: Real-time display of matches played, articles published, subscribers, and club trophies on the homepage.
- **Engagement**: Newsletter subscription system and anonymous "Likes" functionality for news articles.
- **Mobile First**: Ultra-compressed tables, horizontal scrolling carousels, and responsive design tailored for mobile users.
- **Multilingual Support**: Integrated Google Translate widget for instant language switching without manual translation management.
- **SEO Optimized**: Dynamic OpenGraph tags and Meta descriptions strictly generated for every page and article.

## 🛠 Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Axios, React Router
- **Backend**: Node.js, Express 5
- **Database**: Firebase (Firestore)
- **Media Storage**: Cloudinary (Images & Videos)
- **Emails & Newsletter**: Resend API

---

## 🔐 Environment Variables

### Global Backend (`/.env` or Vercel Config)
These variables are required for the server to run and connect to the database/storage.

| Variable | Description |
| :--- | :--- |
| `PORT` | Server port (e.g., 5000) |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase admin SDK JSON string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary name |
| `CLOUDINARY_API_KEY` | Cloudinary key |
| `CLOUDINARY_API_SECRET` | Cloudinary secret |
| `RESEND_API_KEY` | API key from Resend for Newsletter/Emails |
| `JWT_SECRET` | Secret key for login tokens |
| `ADMIN_EMAIL` | Email for CMS login |
| `ADMIN_PASSWORD` | Password for CMS login |
| `NODE_ENV` | `production` or `development` |

### Frontend (`/frontend/.env`)
Used for local development to point to the backend.

| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Backend URL for development | `http://localhost:5000` |

---

## 📦 Deployment (Vercel)

The application is configured to run flawlessly on Vercel leveraging Serverless Functions.

1. **Connect your GitHub** to Vercel.
2. **Framework Preset**: Vite (for frontend builds).
3. **Build Command**: `npm run build`
4. **Output Directory**: `frontend/dist`
5. **Add Environment Variables**: Add all Backend variables listed above to your Vercel Project Environment.
6. The `vercel.json` file handles all API routing seamlessly mapping `/api/*` to the Node.js backend controllers.

---

## 💻 Local Development

1. **Install Dependencies**:
   Navigate to both `frontend` and `backend` directories and run `npm install`.

2. **Expose on Local Network (Mobile Testing)**:
   - Start backend: `cd backend && npm run dev`
   - Run frontend: `cd frontend && npm run dev -- --host`

3. **Database Seed**:
   Fill the database with initial standard pages data (requires Firebase credentials):
   ```bash
   cd backend && npm run seed
   ```
