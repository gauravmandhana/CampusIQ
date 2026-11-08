# CampusIQ — AI-Powered Student Assistance & Campus Analytics Platform

CampusIQ is a smart, role-based campus management and student assistance platform designed to simplify academic activities, improve student engagement, and provide data-driven insights through analytics and AI-powered assistance.

The platform provides separate dashboards and features for Students, Faculty, and Administrators.

## Key Features

### Student Module
- Personalized student dashboard
- Attendance tracking
- Marks and academic performance monitoring
- Assignment management
- Notes and study materials
- Examination timetable
- Notices and campus events
- AI-powered student assistant
- Academic analytics

### Faculty Module
- Faculty dashboard
- Student attendance management
- Marks management
- Assignment management
- Notes and study material management
- Notice management
- Academic analytics

### Admin Module
- Admin dashboard
- Student and faculty management
- Subject management
- Assignment management
- Notice management
- Campus analytics and performance monitoring

### AI & Analytics
- AI-powered student assistance using Ollama
- Qwen3 4B local language model
- Retrieval-Augmented Generation (RAG)
- FAISS-based document retrieval
- Student performance analysis
- Attendance and marks analytics
- ML-based student support indicators

## Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React.js, Vite, CSS |
| Backend | Python, FastAPI |
| Database | MySQL 8.0 |
| ORM | SQLAlchemy |
| Data Processing | Pandas, NumPy |
| Machine Learning | Scikit-learn |
| Visualization | Recharts |
| AI Model | Ollama, Qwen3 4B |
| Vector Search | FAISS |
| API Documentation | Swagger UI |

## Project Structure

```text
CampusIQ/
│
├── ai_documents/
├── app/
├── backend/
│   ├── app/
│   ├── data/
│   ├── ml_models/
│   ├── tests/
│   ├── uploads/
│   ├── requirements.txt
│   └── README.md
│
├── data/
├── database/
├── docs/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── ml_models/
├── .gitignore
├── LICENSE
└── README.md
```

## Installation & Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd CampusIQ
```

### 2. Backend Setup

```powershell
cd backend

python -m venv venv

.\venv\Scripts\activate

pip install -r requirements.txt
```

### 3. Environment Configuration

Create a `.env` file inside the `backend` directory.

Add your own database credentials and a securely generated secret key:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=campusiq

SECRET_KEY=your_secure_random_secret_key
```

Never upload your actual `.env` file or expose database credentials and secret keys publicly.

### 4. Database Setup

- Install and start MySQL 8.0.
- Create a database named `campusiq`.
- Configure the database credentials in `backend/.env`.
- Initialize the database using the project's database setup.

### 5. Start the Backend

From the backend directory:

```powershell
python -m uvicorn app.main:app --reload
```

Backend URL:

`http://127.0.0.1:8000`

API Documentation:

`http://127.0.0.1:8000/docs`

### 6. Frontend Setup

Open another terminal:

```powershell
cd frontend

npm install

npm run dev
```

Frontend URL:

`http://localhost:5173`

### 7. Local AI Setup

Install Ollama and download the required model:

```bash
ollama pull qwen3:4b
```

Ensure Ollama is running before using the AI assistant.

## Security Notes

- Keep environment variables and credentials private.
- Do not commit `.env` files.
- Do not upload virtual environments or dependency folders.
- Use secure secret keys for authentication.
- Avoid uploading personal student information.

## Future Enhancements

- Complete PDF analysis functionality.
- Improve automated academic recommendations.
- Expand student performance prediction.
- Enhance reporting and analytics.
- Improve testing and deployment support.

## Project Information

**Project Name:** CampusIQ

**Project Type:** Major College Project

**Domain:** Computer Science & Engineering — Data Science

**Designed & Developed by:** Gaurav Mandhana

**Degree:** B.Tech — Computer Science & Engineering

---

*CampusIQ — Making Campus Management Smarter with AI & Analytics.*
