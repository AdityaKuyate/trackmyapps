# 📋 TrackMyApps — Job Application Tracker

A full-stack web app to track job applications through every stage — Applied, OA/Test, Interview, Offer, Rejected — with a live dashboard, filtering, and notes per application. Built while going through campus placements, to actually use.

![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Flask](https://img.shields.io/badge/-Flask-000000?style=flat-square&logo=flask&logoColor=white)
![SQLite](https://img.shields.io/badge/-SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white)

## ✨ Features

- Add, edit, and delete job applications
- Track status through a defined pipeline (Applied → OA/Test → Interview → Offer/Rejected)
- Dashboard with live counts per status
- Filter applications by status
- Store notes and job posting links per application

## 🛠️ Tech Stack

**Frontend:** React 18, Vite
**Backend:** Flask, Flask-SQLAlchemy, Flask-CORS
**Database:** SQLite

## 📁 Project Structure

```
trackmyapps/
├── backend/
│   ├── app.py            # Flask API + models
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── App.jsx        # main UI
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## 🚀 Getting Started

### Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```
Runs on `http://127.0.0.1:5001`

### Frontend

```bash
cd frontend
npm install
npm run dev
```
Runs on `http://127.0.0.1:5173` (proxies `/api` calls to the Flask backend)

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/applications` | List all applications (optional `?status=` filter) |
| POST | `/api/applications` | Create a new application |
| PUT | `/api/applications/<id>` | Update an application |
| DELETE | `/api/applications/<id>` | Delete an application |
| GET | `/api/stats` | Get counts by status |

## ☁️ Deploying to production

**Backend (Render/Railway):** connect this repo, set root directory to `backend`, build command `pip install -r requirements.txt`, start command `python app.py`.

**Frontend (Vercel/Netlify):** connect this repo, set root directory to `frontend`. Add an environment variable `VITE_API_URL` pointing to your deployed backend URL (see `.env.example`). Vercel auto-detects Vite.

Locally, leave `VITE_API_URL` unset — the Vite dev server proxy handles `/api` calls automatically.

## 🗺️ Roadmap

- [ ] Email reminders for pending applications
- [ ] Resume/JD matching using NLP
- [ ] Export to CSV
- [ ] Deploy on AWS (S3 + EC2 / Lambda)

## 📄 License

MIT
