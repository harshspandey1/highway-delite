# 🚀 BookIt — Full-Stack Booking Monorepo

A modern full-stack booking platform built with **Next.js**, **Express**, and **MongoDB**, designed as a **monorepo** to demonstrate modular architecture, transactional consistency, and cloud-native deployment.  

This project simulates an end-to-end **experience booking system**, from listing experiences to creating and validating bookings — complete with promo code logic, slot availability, and concurrency-safe transactions.

---

**Live URL:** [https://highway-delite-eta-rose.vercel.app/](https://highway-delite-eta-rose.vercel.app/)  


## ✨ Features

| Category | Description |
|-----------|-------------|
| **🎯 Experience Browsing** | Browse and search for available experiences, dynamically fetched from MongoDB. Client-side filtering for quick discovery. |
| **⏰ Slot Availability Check** | Fetch available time slots for each experience. Backend ensures only **future, capacity-available** slots are returned. |
| **🧾 Booking Creation** | Secure booking process — select time slot, enter personal details, and confirm reservation. |
| **🧠 Promo Code Logic** | Supports **flat** and **percentage-based** promo codes with validation and server-side discount calculation. |
| **🧩 Data Integrity** | Built using **MongoDB Transactions** to safely handle concurrent bookings and promo code usage limits. |
| **🔒 Secure API Design** | Environment variables, schema validation, and transaction rollback logic protect system integrity. |

---

## 🏗️ Technology Stack

### Frontend (Client)
- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Language:** TypeScript
- **UI:** Tailwind CSS
- **State & Fetching:** React Hooks, Native Fetch API
- **Deployment:** [Vercel](https://vercel.com/)

### Backend (Server)
Live API Base URL: https://highway-delite-production-e4f3.up.railway.app
- **Runtime:** Node.js + Express
- **Language:** TypeScript
- **ORM:** Mongoose
- **Deployment:** [Railway](https://railway.app/)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas/database)

---

## 📂 Project Structure

```bash
bookit-assignment/
├── client/                 # Frontend: Next.js app
│   ├── app/                # App router pages & components
│   ├── public/             # Static assets (images, icons)
│   ├── package.json        # Frontend dependencies
│   └── vercel.json         # Deployment rewrites & environment config
│
├── server/                 # Backend: Express API
│   ├── src/
│   │   ├── controllers/    # Business logic (Booking, Slots, Promo)
│   │   ├── models/         # Mongoose Schemas (Experience, Slot, Booking)
│   │   ├── routes/         # Express routes definition
│   │   └── index.ts        # Main entry point
│   └── package.json        # Backend dependencies
│
└── package.json            # Root workspace configuration (npm workspaces)
```

---

## ☁️ Deployment Model

### 🖥️ Frontend — Vercel
- **Build Target:** `/client`
- **Auto-builds** from `main` branch on push.
- **Proxy Rules:** `vercel.json` handles API rewrites (e.g., `/api/* → https://bookit-api.up.railway.app/*`).
- **Optimized for performance** — ISR + Edge Caching.

### ⚙️ Backend — Railway
- **Build Target:** `/server`
- **Runtime:** Node.js (TypeScript compiled → `/dist`)
- **Environment Variables:**


**⚡ Getting Started (Local Setup)**

1️⃣ Clone Repository
git clone https://github.com/your-username/bookit-assignment.git
cd bookit-assignment

2️⃣ Install Dependencies
npm install

3️⃣ Setup Environment Variables
Frontend (/client/.env.local):
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
Backend (/server/.env):
PORT=5000
MONGO_URI=<your_mongodb_connection_uri>

4️⃣ Run Backend
cd server
npm run dev

5️⃣ Run Frontend
cd client
npm run dev

Visit 👉 http://localhost:3000

🧠 Key Highlights

Transactional Safety: Ensures consistent booking and promo code limits.
Decoupled Architecture: Clean separation between UI (Vercel) & API (Railway).
Scalable Monorepo: Managed with npm workspaces for efficient builds.
Production Ready: Uses TypeScript, Environment Variables, and modular design.

🧩 Future Enhancements
✅ JWT-based authentication for user accounts
✅ Admin dashboard for experience management
✅ Integration with Stripe for payments
✅ Real-time slot updates via WebSockets
✅ CI/CD workflows with GitHub Actions

🧑‍💻 Author
Harsh Vardhan Pandey
Full-Stack Developer | Java | MERN | Automation
