# Lichtenberg-Kamer FC Website

A professional football club website for the Cameroonian community in Lichtenberg, Berlin (Germany).

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, i18next
- **Backend**: Node.js, Express, MongoDB
- **CMS**: Custom built admin panel with Rich Text Editor

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or a remote URI)

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd football-club-website
   ```

2. Install dependencies:
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

3. Environment Variables:
   Create a `.env` in the `backend/` folder:
   ```env
   PORT=5000
   MONGO_URI=your_mongo_uri
   JWT_SECRET=your_secret
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=admin123
   ```

4. Seed the database:
   ```bash
   cd backend
   npm run seed
   ```

5. Run the development servers:
   ```bash
   # Backend
   cd backend
   npm run dev
   
   # Frontend
   cd ../frontend
   npm run dev
   ```

## Admin Panel
Access the CMS at `http://localhost:5173/admin/login` using your admin credentials.
Note: The "Admin" button has been removed from the public navbar for security, but the route remains operational.

## Deployment
This project is containerized with Docker. Use `docker-compose up --build` for quick deployment.
