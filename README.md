# 🛒 ShopPilot AI

> AI-powered inventory & sales management SaaS for Indian retail shops. Autonomous reorder agents, Gemini AI insights, WhatsApp invoices, Razorpay billing, and real-time low-stock alerts.

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=flat&logo=google&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat&logo=amazonaws)
![Razorpay](https://img.shields.io/badge/Razorpay-02042B?style=flat&logo=razorpay)

---

## 🚀 What is ShopPilot AI?

ShopPilot AI helps small retail shop owners in India — kiranas, medical stores, electronics shops — run their business like the big chains do. It replaces manual stock tracking, paper invoices, and guesswork with AI-powered automation.

**The problem:** India has 45M+ small retail shops. Most still track inventory in notebooks, lose revenue from stockouts, and have no visibility into their business performance.

**The solution:** A full-stack SaaS with autonomous AI agents that work 24/7 — monitoring stock, drafting supplier emails, generating invoices, and sending real-time business insights.

---

## ✨ Features

### 📦 Inventory Management
- Add, edit, delete products with categories, units, buy/sell prices
- Low stock threshold alerts with automatic detection
- Real-time stock updates after every sale

### 🧾 Sales & Invoices
- Point-of-Sale style sales recording
- Auto-generated invoices after every sale
- Print invoices or send directly via WhatsApp
- Customer phone number capture for WhatsApp delivery

### 🤖 Autonomous AI Agents
- **Reorder Agent** — runs daily, detects low stock, drafts professional supplier emails using Gemini AI, emails shop owner automatically
- **Inventory Agent** — monitors stock continuously, creates in-app notifications and sends email alerts for every low-stock product
- All agent actions logged to an Agent Activity Log with timestamps

### 💡 AI Business Insights
- Powered by Google Gemini API
- Daily analysis of sales data — top sellers, slow movers, restock suggestions, profit tips
- Falls back to local computed insights if API quota is exceeded

### 💳 Billing & Subscriptions
- Three-tier plans: Starter (free), Growth (₹299/mo), Business (₹999/mo)
- Razorpay payment integration with signature verification
- Plan-based feature gating — AI Copilot and WhatsApp invoices locked to Growth+
- Auto-downgrade after 30 days if not renewed

### 🔔 Notifications
- Real-time notification bell in the header on every page
- AI agent alerts appear instantly as unread notifications
- Mark as read, delete, mark all as read

### 🔐 Authentication
- JWT-based auth with bcrypt password hashing
- Token persists across page refreshes
- Protected routes with loading state during token verification

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| AI | Google Gemini API (`@google/genai`) |
| Payments | Razorpay |
| Email | Nodemailer + Gmail SMTP |
| Scheduling | node-cron |
| Auth | JWT + bcrypt |
| Deployment | AWS App Runner (backend), Vercel (frontend) |

---

## 📁 Project Structure

```
shoppilot-ai/
├── frontend/                  # React + Vite app
│   ├── src/
│   │   ├── api/               # Axios API clients
│   │   ├── components/        # Shared UI components
│   │   ├── hooks/             # useAuth, custom hooks
│   │   ├── lib/               # Utilities, store
│   │   ├── pages/             # All page components
│   │   └── types/             # TypeScript interfaces
│   └── index.html
│
└── backend/                   # Node.js + Express API
    ├── config/                # DB, Gemini config
    ├── controllers/           # Route handlers
    ├── jobs/                  # Cron job schedulers
    ├── middleware/            # Auth, plan limits
    ├── models/                # Mongoose schemas
    ├── routes/                # Express routers
    ├── services/              # AI agent logic
    └── server.js
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Google Gemini API key
- Razorpay account (test keys)
- Gmail account with App Password enabled

### Backend

```bash
cd backend
npm install
```

Create `.env`:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_gmail_app_password
PORT=5000
```

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Create `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

```bash
npm run dev
```

---

## 🐳 Docker (Backend)

```bash
cd backend
docker build -t shoppilot-backend .
docker run -p 8080:8080 --env-file .env shoppilot-backend
```

---

## 🌐 Deployment

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend | AWS App Runner |
| Database | MongoDB Atlas |
| Container Registry | AWS ECR |

---

## 🤖 AI Agent Architecture

```
Every day at 9:00 AM
        ↓
Reorder Agent (node-cron)
        ↓
Scans all users' products for qty <= threshold
        ↓
Calls Gemini API → drafts supplier email
        ↓
Saves to AgentLog + creates Notification
        ↓
Emails shop owner with AI-drafted reorder letter

Every hour
        ↓
Inventory Agent (node-cron)
        ↓
Detects new low-stock products
        ↓
Calls Gemini API → generates alert message
        ↓
Creates in-app notification + emails owner
```

---

## 📊 Business Model

| Plan | Price | Features |
|---|---|---|
| Starter | Free | 50 products, basic insights, invoices |
| Growth | ₹299/mo | Unlimited products, AI Copilot, WhatsApp invoices |
| Business | ₹999/mo | Multi-user, custom reports, tax exports |

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">Built with ❤️ for Indian small businesses</p>
