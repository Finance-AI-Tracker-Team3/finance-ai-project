# 💰 BudgetWiseAI – AI-Powered Personal Finance Tracker

**BudgetWiseAI** is a full-stack personal finance management system that helps users track expenses, manage budgets, plan savings goals, and gain **AI-powered financial insights** — all with **secure authentication** and a **modern UI**.

---

## 🚀 Features

### 🔐 Authentication & Security
- JWT-based authentication  
- Secure protected routes (Frontend & Backend)  
- Role-based access control  
- Ownership validation for all finance data  

---

### 💸 Expense Management
- Add, edit, delete expenses  
- Category-based tracking  
- Date-range filtering  
- Monthly summaries  

---

### 📊 Budget Management
- Category-wise budgets  
- Real-time spent calculation  
- Progress bars with exceeded indicators  
- Budget exceeded alerts  
- Monthly budget trends visualization  
- Edit & delete budget support  

---

### 🎯 Savings Goals
- Create & manage savings goals  
- Track progress with percentage bars  
- Account → Goal transfer (transaction-safe)  
- Balance validation before transfer  
- Goal completion animation 🎉  
- Modern modal-based add & delete  

---

### 🏦 Accounts
- Multiple accounts  
- Balance tracking  
- Ownership validation  
- Used as source for goal funding  

---

### 🤖 AI Insights Dashboard
- Financial health score  
- Category trends  
- Monthly expense forecast  
- Peak spending days  
- Advanced analytics insights  

---

### 🔔 Reminders
- Upcoming bill reminders  
- Due-date based alerts  

---


🧩 Technical Implementation
- AI health score evaluation engine
- Threshold-based alert rules
- One-time notification logic to prevent spam
- Extensible notification service design
- Event-driven frontend alerts (React Toastify)

---

🔔 Alerts & Notifications System (Planned / In Progress)

BudgetWiseAI includes a scalable and extensible alerting architecture designed to deliver real-time financial notifications and future multi-channel alerts.

🔔 Alert Delivery Channels
- In-app toast notifications (real-time)
- Dashboard warning banners

Designed for future support of:
- 📧 Email alerts
- 📱 WhatsApp / SMS notifications
- 🔔 Push notifications (PWA / Mobile)

---
## 🧠 Tech Stack

### Frontend
- React.js  
- React Router  
- Axios  
- Tailwind CSS  
- Chart.js / Recharts  

### Backend
- Java 17  
- Spring Boot  
- Spring Security + JWT  
- Hibernate / JPA  
- MySQL  
- Swagger (OpenAPI)  

---

## 🏗️ Architecture Overview

Frontend (React)
└── Services (Axios)
└── Secure API Calls

Backend (Spring Boot)
├── Controllers
├── Services
├── DTOs & Mappers
├── Security (JWT)
├── Repositories
└── MySQL Database

## 🔑 API Modules

| Module | Description |
|------|------------|
| Auth | Login, Signup, Reset |
| Transactions | Expense CRUD |
| Categories | Expense categories |
| Budgets | Budget tracking |
| Goals | Savings goals |
| Accounts | Account balances |
| Reminders | Bill reminders |
| AI | Insights & forecasts |

---

## 🔐 Security Highlights
- Stateless JWT authentication  
- Axios request interceptor  
- Ownership validation on all entities  
- Protected API routes  
- Proper CORS configuration  

---

## ⚙️ Setup Instructions

### Backend

mvn clean install
mvn spring-boot:run

Frontend
npm install
npm start
---
🌐 Application URLs

Frontend: http://localhost:3000

Backend: http://localhost:8080
---
📄 Swagger API Documentation

http://localhost:8080/swagger-ui/index.html
---
🧪 Future Enhancements:

AI-based goal prediction

Email & push notifications

PDF / CSV exports

Docker & cloud deployment

Unit & integration testing
---
👥 Authors

### Backend Development
**Koushik and Hemprasath**
Java | Spring Boot | Security | Database Design

### Frontend Development
**Abdul sameer and Aditi tare**
React | UI/UX | API Integration | AI Dashboards

### Database & AI Integration Development
**Jameel, Shubham, Abdul Sameer**  
MySQL | Simple Regression | Prophet | Isolation Forest

---
⭐ Project Highlights

This project demonstrates:

Real-world full-stack architecture
Secure financial data handling
Transaction-safe money operations
Clean UI/UX
Production-ready backend design
markdown






