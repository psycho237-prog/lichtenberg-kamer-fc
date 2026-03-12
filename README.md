# 🦁 Lichtenberg-Kamer e.V Website

A professional football club website for the Cameroonian community in Berlin. A fully dynamic site with a custom CMS to manage players, matches, news, and sponsors.

- **Official Domain**: [https://lichtenbergkamer.page](https://lichtenbergkamer.page)
- **Admin Panel**: `/lkev-admin/login`

## 🛠 Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Axios
- **Backend**: Node.js, Express (Express 5)
- **Database**: Firebase (Firestore)
- **Media Storage**: Cloudinary (Images & Videos)
- **CMS**: Custom Administration Dashboard with Google Translate integration

---

## 🔐 Environment Variables

### Backend (`/backend/.env`)
These variables are required for the server to run and connect to the database/storage.

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Server port | `5000` |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase admin SDK JSON string | `{"type": "service_account", ...}` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary name | `your_name` |
| `CLOUDINARY_API_KEY` | Cloudinary key | `your_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary secret | `your_secret` |
| `JWT_SECRET` | Secret key for login tokens | `any_long_random_string` |
| `ADMIN_EMAIL` | Email for CMS login | `admin@lichtenberg-kamer.de` |
| `ADMIN_PASSWORD` | Password for CMS login | `your_secure_password` |
| `NODE_ENV` | Environment mode | `production` or `development` |
| `RENDER_EXTERNAL_URL` | Your site URL (for auto-ping) | `https://lichtenbergkamer.page` |

### Frontend (`/frontend/.env`)
Used for local development to point to the backend.

| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Backend URL for development | `http://localhost:5000` |

---

## 📦 Deployment on Render (Recommended)

Render is perfect for this project. Since we use a Node.js monorepo structure:

1. **Connect your GitHub** to Render.
2. **Environment**: Select `Node`.
3. **Build Command**: `cd frontend && npm install && npm run build && cd ../backend && npm install`
4. **Start Command**: `node backend/server.js` (or use the root `npm start` if configured)
5. **Add Environment Variables**: Copy the variables from the "Backend" table above into the Render "Environment" tab.

---

## 💻 Local Development

1. **Install everything**:
   ```bash
   npm run install-all
   ```

2. **Expose on Local Network**:
   To view the site on your phone or other device on the same Wifi:
   - Backend will listen on `0.0.0.0:5000`.
   - Run frontend with: `cd frontend && npm run dev -- --host`

3. **Database Seed**:
   Fill the database with initial data (requires Firebase credentials):
   ```bash
   cd backend && npm run seed
   ```

4. **Launch**:
   ```bash
   npm start
   ```
