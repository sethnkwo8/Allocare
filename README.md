# 💰 Allocare

Allocare is a modern personal finance management application designed to help users track income, manage expenses, and optimize budget allocation using a structured approach.

It provides a clean dashboard, smart budgeting tools, and AI-powered insights to help users make better financial decisions.

---

## 🚀 Features

- 🔐 Authentication & Security
    - Secure user registration and login
    - Session-based authentication using HTTP-only cookies
    - Protected routes and user validation

- 📊 Dashboard
    - Overview of total income, spending, and remaining balance
    - Visual budget allocation (Needs, Wants, Savings)
    - Budget vs spending comparison charts

- 💸 Expese Tracking
    - Add and categorize expenses
	- Real-time updates to budget and remaining balance
	- Organized breakdown by categories

- 🎯 Budget Allocation System
    - Based on structured allocation (Needs, Wants, Savings)
	- Custom percentage distribution
	- Category-level breakdowns

- 🏁 Goals
	- Savings goals tracking
	- Progress visualization

- 🔔 Notifications
	- Overspending alerts
	- Budget usage warnings

- 🤖 AI Insights (Planned)
	- Personalized financial advice
	- Spending analysis and recommendations
	- Natural language queries (e.g. “Can I afford this?”)

---

## 🧰 Technologies Used

| Category | Tools |
|-----------|--------|
| **Frontend** | Next.js (App Router), TypeScript, Tailwind CSS, Shadcn UI |
| **Backend** | FastAPI (Python), SQLModel, Session-based authentication |
| **Database** | PostgreSQL |
| **Other Tools** | Charting library (for analytics), Fetch API for client-server communication |

---

## ⚙️ Architecture Overview

Allocare follows a separation of concerns approach:
- routers/ -> API endpoints
- services/ -> business logic
- schemas/ -> request/response validation
- models/ -> database structure

Frontend communicates with backend via REST APIs and uses cookies for session management.

---

## 🔑 Key Highlights

- Built with a real-world architecture (not a simple CRUD app)
- Implements secure session handling
- Designed with scalability in mind
- Focus on clean UI/UX and usability
- Structured to support AI-powered features

---

## 🛠 Installation & Setup

**Step 1 – Clone the Repository**
```bash
git clone https://github.com/sethnkwo8/Allocare.git
cd Allocare
```

---

**Step 2 – Backend setup (FastAPI)**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

**Step 3 – Frontend setup (Next.js)**
```bash
cd frontend
npm install
npm run dev       
```

---

## 🌍 Environment variable

Create a .env file in the frontend:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📌 Roadmap
- Authentication system
- Dashboard UI
- Expense tracking
- Goals system
- Notifications 
- AI financial assistant

---

## 📷 Screenshots


---

## 📖 Lessons Learned
- Designing scalable backend architecture
- Managing authentication with cookies and sessions
- Structuring full-stack applications
- Building real-world financial logic systems

---

## 📬 Contact
Feel free to reach out or connect:
- Portfolio: (coming soon...)
- LinkedIn: https://www.linkedin.com/in/seth-nkwo/
- GitHub: https://github.com/sethnkwo8

---

## ⭐️ Acknowledgements
This project was built as part of a full-stack development jorney, focusing on real-world application design and problem-solving.



