💰 BudgetWiseAI – AI-Powered Personal Finance Tracker

Comprehensive Project Documentation

1. Project Overview

BudgetWiseAI is a full-stack, AI-powered personal finance management system designed to help users track expenses, manage budgets, plan savings goals, and receive intelligent financial insights.

The system combines secure backend architecture, modern frontend UI, and machine learning-driven analytics to deliver a real-world, production-ready financial platform.

This project focuses on data security, ownership validation, scalability, and explainable AI, making it suitable for enterprise-grade applications.

2. Problem Statement

Managing personal finances is often fragmented across multiple apps, spreadsheets, and manual tracking methods.
Most existing tools:

Lack intelligent insights

Provide limited forecasting

Do not focus on secure data ownership

Offer minimal proactive alerts

BudgetWiseAI addresses these challenges by providing a single, intelligent, and secure platform for complete personal financial management.

3. Project Objectives

Provide a secure and scalable personal finance system

Enable real-time expense and budget tracking

Introduce AI-driven financial health scoring

Predict future expenses using time-series forecasting

Detect unusual spending patterns using anomaly detection

Deliver smart alerts to guide better financial decisions

Design the system for future multi-channel notifications

 4. System Architecture Overview
Frontend (React.js)
 ├── Secure Routes (ProtectedRoute)
 ├── Axios API Services
 ├── AI Dashboards & Charts
 └── Toast & UI Alerts

Backend (Spring Boot)
 ├── Controllers
 ├── Services
 ├── DTOs & Mappers
 ├── Security (JWT)
 ├── Repositories
 └── AI Service (Python / Flask – optional microservice)

Database (MySQL)
 ├── Users
 ├── Transactions
 ├── Budgets
 ├── Goals
 ├── Accounts
 └── Reminders

5. Authentication & Security Implemented Security Measures

JWT-based stateless authentication

Secure login and signup

Protected frontend routes

Ownership validation on all finance entities

Role-based access control

Secure API access via Axios interceptors

Proper CORS configuration

6. Expense Management
Features

Add, edit, delete expenses

Category-based tracking

Date-range filtering

Monthly summaries

Secure ownership validation

7. Budget Management Features

Category-wise budgets

Real-time spent calculation

Visual progress indicators

Budget exceeded detection

Monthly budget trend visualization

Edit and delete budgets

8. Savings Goals Features

Create and manage savings goals

Track progress with percentage bars

Transfer funds from accounts to goals

Transaction-safe operations

Balance validation before transfer

Goal completion animation

Modal-based UI interactions

9. Account Management Features

Multiple financial accounts

Balance tracking

Ownership validation

Used as source for goal funding

Secure transactional updates

10. AI Insights Dashboard AI Capabilities

Financial Health Score

Category-wise spending trends

Monthly expense forecasting

Peak spending day analysis

Advanced analytics insights

AI Techniques Used

Rule-based scoring logic

Statistical trend analysis

Time-series forecasting (Prophet)

Anomaly detection (Isolation Forest)

Explainable score breakdowns

11. Alerts & Notifications System Currently Implemented

In-app toast notifications

Dashboard warning banners

Overspending smart alerts

Threshold-based triggers

One-time alert logic to prevent spam

Designed for Future Expansion

Email notifications

WhatsApp / SMS alerts

Push notifications (PWA / Mobile)

Event-driven notification service

12. Technical Implementation Highlights

AI health score evaluation engine

Threshold-based alert rules

Safe numeric normalization on frontend

Backend-driven analytics responses

Modular and extensible design

Clean separation of concerns

Production-ready folder structure

13. Technology Stack Frontend

React.js

React Router

Axios

Tailwind CSS

Recharts / Chart.js

React Toastify

Backend

Java 17

Spring Boot

Spring Security (JWT)

Hibernate / JPA

MySQL

Swagger (OpenAPI)

AI / Analytics

Python

Flask (AI microservice)

Prophet (Forecasting)

Isolation Forest (Anomaly Detection)

Pandas / NumPy

14. API Modules
Module	Description
Auth	Login, Signup, Reset
Transactions	Expense CRUD
Categories	Expense categories
Budgets	Budget tracking
Goals	Savings goals
Accounts	Account balances
Reminders	Bill reminders
AI	Insights & forecasting

15. Setup Instructions
Backend
mvn clean install
mvn spring-boot:run

Frontend
npm install
npm start

16. Application URLs

Frontend: http://localhost:3000

Backend: http://localhost:8080

Swagger API Docs:
http://localhost:8080/swagger-ui/index.html

17. Future Scope & AI Roadmap

AI-based savings goal prediction

Personalized spending recommendations

Conversational AI financial assistant

Automatic budget adjustments

Behavioral spending analysis

Multi-channel notifications (Email, SMS, WhatsApp)

PDF / CSV financial reports

Cloud deployment (Docker, AWS)

Unit & integration testing

18. Contributors
Backend Development

Koushik

Hemprasath
Java | Spring Boot | Security | Database Design

Frontend Development

Abdul Sameer

Aditi Tare
React | UI/UX | API Integration | AI Dashboards

Database & AI Integration

Jameel

Shubham

Abdul Sameer
MySQL | Forecasting | Anomaly Detection

19. Project Highlights

Real-world full-stack architecture

Secure financial data handling

AI-powered decision support

Transaction-safe money operations

Clean and modern UI/UX

Scalable and extensible design

Production-ready backend structure

Conclusion

BudgetWiseAI is a complete demonstration of how modern full-stack systems can integrate AI, security, and usability to solve real-world problems.
The project lays a strong foundation for future intelligent financial platforms and enterprise-grade deployment.
