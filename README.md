<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=26&pause=1000&color=0B57D0&center=true&vCenter=true&width=700&lines=WorkSpace+HR+%F0%9F%9A%80;AI-Powered+Employee+Onboarding+Portal;Static+HTML+%E2%86%92+Production+Full-Stack+App" alt="Typing SVG" />

<br/>

![GitHub repo size](https://img.shields.io/github/repo-size/Nilesh-C-01/WorkSpace-HR?style=for-the-badge&color=0b57d0&logo=github)
![GitHub stars](https://img.shields.io/github/stars/Nilesh-C-01/WorkSpace-HR?style=for-the-badge&color=FFD700)
![GitHub forks](https://img.shields.io/github/forks/Nilesh-C-01/WorkSpace-HR?style=for-the-badge&color=ff8c00)
![Python](https://img.shields.io/badge/Python-3.13-blue?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini_2.5_Flash-8E44AD?style=for-the-badge&logo=google&logoColor=white)



<br/>

> **The complete evolution of [Employee-Portal](https://github.com/Nilesh-C-01/Employee-Portal) — from a static HTML page with hardcoded data into a production-grade full-stack HR system powered by a real Gemini 2.5 Flash AI Agent, JWT authentication, and a persistent SQLite database.**

<br/>

[![🔴 Live Demo](https://img.shields.io/badge/🔴%20Live%20Demo-Open%20App-red?style=for-the-badge)](https://Nilesh-C-01.github.io/WorkSpace-HR/)
[![🐛 Report Bug](https://img.shields.io/badge/🐛%20Report-Bug-orange?style=for-the-badge)](https://github.com/Nilesh-C-01/WorkSpace-HR/issues)
[![v1 Legacy](https://img.shields.io/badge/v1.0-Employee--Portal-grey?style=for-the-badge)](https://github.com/Nilesh-C-01/Employee-Portal)

</div>

---

## 🧬 The Evolution Story

This project has a history. Here's where it came from and how far it's come:

| | **v1.0 — Employee Portal** | **v2.0 — WorkSpace HR** |
|---|---|---|
| **Architecture** | Single static `index.html` | Full-stack (FastAPI + Frontend) |
| **Database** | Hardcoded HTML table | SQLite via SQLAlchemy ORM |
| **Authentication** | None | JWT (HS256, 2hr expiry, bcrypt) |
| **AI** | None | Gemini 2.5 Flash — live resume parsing |
| **Styling** | Raw CSS, Cambria font | Material Design 3, Tailwind CSS, Dark Mode |
| **Employee Ops** | Static display only | Full CRUD — Create, Read, Delete |
| **Search** | None | Client-side real-time filtering |
| **Deployment** | GitHub Pages | GitHub Pages + Render (FastAPI) |

---

## ✨ Feature Highlights

| Feature | Details |
|---|---|
| 🤖 **Gemini 2.5 Flash AI Agent** | Paste any raw resume/bio — AI extracts `name`, `email`, `role` as structured JSON and auto-fills the form |
| 🔐 **JWT Authentication** | Login via `/api/login/`, token stored in `localStorage`, sent as `Bearer` header on every protected API call |
| 🌙 **Auto Dark Mode** | Detects `prefers-color-scheme` and switches theme automatically — no toggle needed |
| 🗑️ **Animated Delete Modal** | Custom confirmation modal with scale + opacity CSS transition before deleting an employee |
| 🔍 **Live Search** | Client-side filtering by employee name or role — no extra API calls |
| 👤 **User Avatar** | Initials auto-generated from logged-in HR Admin's name, shown in header |
| 🔄 **401 Auto-Logout** | If JWT expires, any API call automatically redirects user to `login.html` |
| 🛡️ **Duplicate Guard** | Backend catches `IntegrityError` on duplicate email — returns clean `400` error |

---

## 🎯 Live Demo

No setup needed. Test the full stack right now:

### 👉 [Click to Open Live Application](https://Nilesh-C-01.github.io/WorkSpace-HR/)

> ⚠️ **Cold Start Warning:** Backend is on Render's free tier. If idle for 15+ minutes, the first login may take **30–50 seconds** to wake up. Subsequent requests are instant. ⚡

**Demo Admin Credentials:**
```
Email    :  admin@company.com
Password :  admin123
```

> These credentials are seeded by hitting `POST /api/setup-admin/` — which auto-creates the admin user in the SQLite DB with a bcrypt-hashed password.

---

## 🧠 How the AI Agent Works (End-to-End)

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  1. HR clicks "Auto-Fill with AI" button                             │
│     └─ Reveals textarea (purple panel in dashboard)                  │
│                                                                      │
│  2. HR pastes raw resume / bio text → clicks "Extract & Fill Form"   │
│     └─ frontend/JS/app.js → POST /api/parse-resume/                 │
│        Headers: { Authorization: Bearer <JWT> }                      │
│                                                                      │
│  3. backend/main.py receives request                                 │
│     └─ Validates JWT via get_current_user()                          │
│     └─ Builds structured prompt:                                     │
│        "Return ONLY valid JSON: {name, email, role}"                 │
│     └─ Calls Gemini 2.5 Flash via google-genai SDK                  │
│                                                                      │
│  4. Gemini returns JSON → backend strips markdown fences → parses    │
│                                                                      │
│  5. Frontend receives { name, email, role }                          │
│     └─ Auto-fills form fields                                        │
│     └─ Maps role to correct <select> dropdown option                 │
│     └─ Sets joining date to today automatically                      │
│                                                                      │
│  6. HR reviews & hits Submit → employee saved to hr_database.db ✅   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | HTML5, Vanilla JS, Tailwind CSS | Dashboard UI, login page, AI form |
| **Styling** | Material Symbols (Google Icons), Roboto font | Icons & typography |
| **Backend** | Python 3.13, FastAPI | REST API, business logic |
| **ORM** | SQLAlchemy | Database models & queries |
| **Database** | SQLite (`hr_database.db`) | Persistent employee & user storage |
| **AI** | Google Gemini 2.5 Flash (`google-genai` SDK) | Resume parsing agent |
| **Auth** | PyJWT + passlib[bcrypt] | Token generation & password hashing |
| **Hosting** | GitHub Pages + Render (free tier) | Frontend + backend deployment |

</div>

---

## 📁 Project Structure

```
WorkSpace-HR/
│
├── index.html                   # Root redirect → sends to frontend/login.html
│                                  (GitHub Pages entry point)
│
├── backend/
│   ├── main.py                  # Entire FastAPI app:
│   │                            #   - DB setup (SQLAlchemy + SQLite)
│   │                            #   - Pydantic schemas
│   │                            #   - JWT auth (login, token, guard)
│   │                            #   - Gemini AI agent endpoint
│   │                            #   - Employee CRUD endpoints
│   ├── hr_database.db           # SQLite DB (auto-created on first run)
│   └── requirements.txt         # fastapi, uvicorn, sqlalchemy, passlib,
│                                #   bcrypt==3.2.0, PyJWT, google-genai
│
└── frontend/
    ├── login.html               # Google-style sign-in page
    │                            #   → calls POST /api/login/
    │                            #   → stores JWT + user in localStorage
    ├── index.html               # Main dashboard:
    │                            #   - Sidebar (Google Workspace style)
    │                            #   - Onboarding form
    │                            #   - AI auto-fill panel (purple)
    │                            #   - Employee directory table
    │                            #   - Animated delete modal
    ├── CSS/
    │   └── style.css            # Google-style input focus states,
    │                            #   dark mode borders, Roboto font config
    └── JS/
        └── app.js               # All frontend logic:
                                 #   - Auth guard (redirects if no token)
                                 #   - fetchEmployees(), renderTable()
                                 #   - parseResume() AI workflow
                                 #   - openDeleteModal() with CSS transition
                                 #   - Live search filtering
```

---

## 🚀 Quick Start — Run Locally

### Prerequisites
- Python 3.10+
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey) (free tier works)

### 1. Clone the Repository
```bash
git clone https://github.com/Nilesh-C-01/WorkSpace-HR.git
cd WorkSpace-HR
```

### 2. Set Up the Backend
```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # macOS / Linux
venv\Scripts\activate           # Windows

# Install all dependencies
pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the server:
```bash
uvicorn main:app --reload
```
> ✅ API live at `http://127.0.0.1:8000`

### 3. Seed the Admin User (First Time Only)
Hit this endpoint once to create the default admin in the database:
```bash
curl -X POST http://127.0.0.1:8000/api/setup-admin/
```

### 4. Start the Frontend
- Open `frontend/JS/app.js` — update `API_URL` to `http://127.0.0.1:8000/api/employees/`
- Do the same in `frontend/login.html` — update the fetch URL to `http://127.0.0.1:8000`
- Open `frontend/login.html` with **VS Code Live Server**

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/setup-admin/` | ❌ | Seeds default admin user (run once) |
| `POST` | `/api/login/` | ❌ | Returns JWT token + user info |
| `POST` | `/api/parse-resume/` | ✅ JWT | AI parses resume → returns `{name, email, role}` |
| `GET` | `/api/employees/` | ✅ JWT | Fetch all employees |
| `POST` | `/api/employees/` | ✅ JWT | Add new employee |
| `DELETE` | `/api/employees/{id}` | ✅ JWT | Remove employee by ID |

---

## 🔮 Changelog

### v2.0 — WorkSpace HR *(Current)*
- ✅ Full FastAPI backend — all in `main.py` (clean, single-file architecture)
- ✅ SQLite database with SQLAlchemy ORM (two tables: `employees`, `users`)
- ✅ Google Gemini 2.5 Flash AI agent via new `google-genai` SDK
- ✅ JWT auth with bcrypt password hashing (2-hour token expiry)
- ✅ Google Workspace-inspired dark mode UI (Tailwind CSS + Material Symbols)
- ✅ Animated delete confirmation modal
- ✅ Client-side live search
- ✅ Removed hardcoded API key — now uses `os.getenv("GEMINI_API_KEY")`
- ✅ Fixed auth guard: clean redirect to `login.html` on missing/expired token

### v1.0 — Employee Portal *(Legacy)*
- Static single `index.html`, raw CSS, Cambria font
- Hardcoded employee table (3 rows, no JS)
- No backend, no database, no auth, no AI

---

## 🤝 Contributing

Issues and PRs are welcome!

1. Fork the repo
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m 'Add your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

If this project helped or impressed you, a ⭐ goes a long way!

---

<div align="center">

**Built with ❤️ by [Nilesh Choudhury](https://github.com/Nilesh-C-01)**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-nilesh01-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/nilesh01/)

*Recruiters — the AI actually works, the auth is real, and the database persists. Go ahead and test it.* 😄

</div>
