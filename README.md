# Hope Somalia Foundation — Full-Stack NGO Management System

![Hope Somalia Foundation Banner](https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80)

**Hope Somalia Foundation** is a production-ready, full-stack NGO Management System featuring a **Public Website** for donors, partners, and volunteers, seamlessly connected to a protected **Admin Management Dashboard** via a Node.js/Express REST API and Prisma ORM database.

---

## 🌟 Key Architecture & Data Flow

```text
ADMIN MANAGEMENT DASHBOARD ──(JWT Authenticated REST API)──> NODE.JS / EXPRESS BACKEND ──> PRISMA ORM / POSTGRESQL / SQLITE
                                                                                               │
PUBLIC WEBSITE VISITORS    <──(Dynamic Content / Stats)────── REST API CONTROLLERS ────────────┘
```

Everything displayed on the public website (Hero headline, Impact Statistics, Key Programs, Projects progress, News articles, Beneficiary Stories, Documents, and Settings) is fully dynamic and editable in real-time from the Admin Dashboard.

---

## 🛠️ Technology Stack

### Frontend (`/client`)
- **React 18** + **Vite**
- **Tailwind CSS** (Trust Navy, Vibrant Teal, Warm Amber design system)
- **React Router v6**
- **Lucide React** (Modern iconography)
- **Axios** (API client with JWT Interceptors)
- **React Hook Form** + **Zod** (Form validation)
- **TanStack Query**

### Backend (`/server`)
- **Node.js** + **Express.js** (RESTful API architecture)
- **Prisma ORM** (Configured with SQLite for zero-setup local execution & swappable to PostgreSQL)
- **JWT** + **bcryptjs** (Password hashing & role-based authentication)
- **Multer** (File upload validation & security checks)
- **Express Rate Limit** + **Helmet** (Security headers & rate limiting)

---

## 📁 Directory Structure

```text
ngo/
├── client/                     # Frontend Application
│   ├── public/                 # Static assets, sitemap.xml, robots.txt
│   ├── src/
│   │   ├── api/                # Axios instance & interceptors
│   │   ├── components/         # Common UI, Header, Footer, Modals, MediaPicker
│   │   ├── context/            # AuthContext, ToastContext, SettingsContext
│   │   ├── layouts/            # PublicLayout, AdminLayout
│   │   ├── pages/              # Public pages & Admin CMS dashboards
│   │   ├── App.jsx             # Main Router configuration
│   │   └── main.jsx            # React root
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend API & Database
│   ├── src/
│   │   ├── config/             # Database & environment configuration
│   │   ├── controllers/        # Express REST controllers
│   │   ├── middleware/         # JWT Auth, RBAC Authorization, Upload, Errors
│   │   ├── routes/             # API route endpoints
│   │   ├── services/           # Storage & Payment abstractions
│   │   ├── utils/              # Audit logger & helpers
│   │   └── index.js            # Express app entrypoint
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema (19 models)
│   │   └── seed.js             # Realistic seed data script
│   ├── uploads/                # Local file storage (Abstracted)
│   └── package.json
└── README.md
```

---

## 🔑 Administrative Default Credentials

To log into the Admin Dashboard (`http://localhost:5173/admin/login`):

- **Email**: `admin@hopesomalia.org`
- **Password**: `Admin123!`
- **Role**: `SUPER_ADMIN`

*Secondary Staff Credentials*:
- **Editor**: `editor@hopesomalia.org` / `Staff123!` (`CONTENT_MANAGER`)
- **Finance**: `finance@hopesomalia.org` / `Staff123!` (`FINANCE_MANAGER`)

---

## 🚀 Quick Start Guide

### 1. Backend Setup (`/server`)

```bash
cd server
npm install

# Initialize Prisma Database & Run Migrations
npx prisma db push

# Seed Realistic NGO Data (Users, Programs, Projects, News, Donations)
node prisma/seed.js

# Start Express Server
npm run dev
```
The server will start on `http://localhost:5000`.

### 2. Frontend Setup (`/client`)

```bash
cd client
npm install

# Start Vite Development Server
npm run dev
```
The application will open on `http://localhost:5173`.

---

## 🌐 Public Website Routes

- `/` — Premium Homepage (Hero, Live Impact Stats, Programs, Projects, News, Stories)
- `/about` — Our Story, Mission, Vision, Leadership Team
- `/programs` & `/programs/:slug` — Program Directory & Details
- `/projects` & `/projects/:slug` — Live Field Projects & Progress
- `/impact` — Impact Statistics & Downloadable Audited Reports
- `/stories` — Beneficiary Human Stories
- `/news` & `/news/:slug` — News & Press Releases
- `/get-involved` — Ways to support
- `/volunteer` — Interactive Volunteer Application
- `/donate` — Donation Interface ($10, $25, $50, $100, $250, custom, payment abstraction)
- `/contact` — Contact Form & Address Info
- `/faq` — Accordion FAQ
- `/privacy-policy` & `/terms` — Legal disclosures

---

## 🔐 Admin Dashboard Routes (`/admin/*`)

- `/admin/login` — Staff Authentication
- `/admin/dashboard` — Live metrics, monthly donation bar charts, project status, activity logs
- `/admin/homepage` — Edit Hero headline, description, image, and dynamic counters
- `/admin/about` — Edit Story, Mission, Vision
- `/admin/programs` — Full CRUD for NGO programs
- `/admin/projects` — Full CRUD for projects, status selector, budget, progress bar
- `/admin/news` — Full CRUD for blog posts with status (Draft, Published, Archived)
- `/admin/stories` — CRUD for beneficiary stories
- `/admin/testimonials` & `/admin/partners` — Manage testimonials & partner logos
- `/admin/donations` — Manage real database donations & payment status
- `/admin/volunteers` — Search, filter, approve, or reject volunteer applications
- `/admin/messages` — Read, reply, or delete contact messages
- `/admin/documents` — Manage annual reports & financial statements
- `/admin/media` — Drag-and-drop media library uploader with folder filters & copy URL
- `/admin/users` — Role-Based User Management (Super Admin, Content, Project, Finance Manager, Moderator)
- `/admin/audit-logs` — System activity audit logger
- `/admin/settings` — Global organization contact details, social links, SEO defaults

---

## 📦 Production Deployment Guide

### Frontend (Vercel / Netlify)
1. Connect the `client/` folder to Vercel/Netlify.
2. Set Build Command: `npm run build` and Output Directory: `dist`.
3. Configure `VITE_API_URL` environment variable pointing to your deployed Express backend URL.

### Backend (Render / Railway / Fly.io)
1. Deploy the `server/` folder to Render/Railway.
2. Set Environment Variables:
   - `PORT=5000`
   - `NODE_ENV=production`
   - `DATABASE_URL=postgresql://user:pass@host:5432/dbname` (or SQLite URL)
   - `JWT_SECRET=your_production_secret_key`
   - `CLIENT_URL=https://your-frontend-domain.com`

---

## 🔒 Security & Best Practices
- Passwords stored with **bcryptjs** (10 salt rounds).
- JWT tokens with expiration & bearer authorization headers.
- Input validation via **Zod** on both client & server.
- Sanitized file uploads limiting file size (10MB) and mime-type checks.
- Audit logging recording every admin action (`CREATE_PROJECT`, `UPDATE_DONATION_STATUS`, `UPLOAD_MEDIA`).
