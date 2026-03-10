# 🦁 Lichtenberg-Kamer FC Website

A professional football club website for the Cameroonian community in Berlin. A fully dynamic site with a custom CMS to manage players, matches, news, and sponsors.

## 🛠 Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Axios
- **Backend**: Node.js, Express, MongoDB
- **CMS**: Custom Administration Dashboard
- **I18n**: Support for French, English, and German

---

## 🔐 Environment Variables

### Backend (`/backend/.env`)
These variables are required for the server to run and connect to the database.

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for login tokens | `any_long_random_string` |
| `ADMIN_EMAIL` | Email for CMS login | `admin@lichtenberg-kamer.de` |
| `ADMIN_PASSWORD` | Password for CMS login | `your_secure_password` |
| `NODE_ENV` | Environment mode | `production` or `development` |
| `RENDER_EXTERNAL_URL` | Your site URL (for auto-ping) | `https://site.onrender.com` |

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
3. **Build Command**: `npm run install-all && npm run build-frontend`
4. **Start Command**: `npm start`
5. **Add Environment Variables**: Copy the variables from the "Backend" table above into the Render "Environment" tab.

### ⚠️ A note on Image Storage
Currently, images are stored in `backend/uploads/`.
- **Render Free Tier**: The disk is temporary. Uploaded images (players/news) will disappear after a restart.
- **Better Alternatives**:
    - **Cloudinary**: Highly recommended. Free, stable, and optimizes images.
    - **Firebase Storage**: Excellent choice for persistent file storage.
    - **MongoDB**: **DON'T USE** for images. It's not efficient for binary files.

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
   Fill the database with initial data:
   ```bash
   cd backend && npm run seed
   ```

4. **Launch**:
   ```bash
   npm start
   ```
