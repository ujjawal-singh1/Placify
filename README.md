# 🚀 Placify — Campus Placement Management System (Full Stack)

## 📘 Overview
**Placify** is a full-stack placement management system built with **React (frontend)**, **Spring Boot (backend)**, and **MongoDB (database)**.  
It helps **students, recruiters, and admins** efficiently manage the campus placement process from registration to selection, including a **Quiz Module** to assess student skills.

---

## 🎯 Objectives
- Digitize and automate campus placement workflows.  
- Provide dashboards for students, recruiters, and admins.  
- Use MongoDB for scalable, flexible data storage.  
- Enable a modern, responsive, and interactive UI with React.  
- Assess students’ technical and aptitude skills through quizzes.

---

## 🧩 Key Features

### 👨‍🎓 Student Module
- Register, log in, and manage profiles.  
- Browse placement drives and apply for jobs.  
- Track application status and placement results.  
- Attempt quizzes to evaluate technical and aptitude skills.

### 🏢 Company Module
- Post job openings with eligibility filters.  
- View eligible students and shortlist candidates.  
- Manage interviews and selection results.

### 🧑‍💼 Admin Module
- Approve or reject student & company registrations.  
- Manage placement schedules and announcements.  
- Generate reports and analytics dashboards.  
- Create and manage quizzes for students.

### 📝 Quiz Module
- Admin can create quizzes with multiple-choice questions.  
- Students can attempt quizzes and get instant results.  
- Quiz results can be used for shortlisting candidates.  
- Supports technical, aptitude, and domain-specific quizzes.

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js, HTML5, CSS3, JavaScript, Bootstrap / Tailwind CSS |
| Backend Framework | Spring Boot (Java 17+) |
| Database | MongoDB |
| ORM/ODM Tool | Spring Data MongoDB |
| Security | Spring Security & JWT Authentication |
| REST APIs | Spring Web |
| Server | Embedded Tomcat |
| Version Control | Git & GitHub |

---

## 🏗️ Project Structure

Placify/
├── backend/
│ ├── src/main/java/com/placify/
│ │ ├── controller/
│ │ ├── service/
│ │ ├── repository/ <-- MongoDB repositories
│ │ ├── model/ <-- @Document classes (includes Quiz models)
│ │ └── PlacifyApplication.java
│ └── src/main/resources/
│ └── application.properties
├── frontend/
│ ├── public/
│ └── src/
│ ├── components/
│ ├── pages/
│ │ ├── Quiz/
│ │ └── Placement/
│ ├── services/ <-- API calls to backend
│ └── App.js
└── README.md

## 🛠️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/ujjawal-singh1/Placify.git
cd Placify

2️⃣ Backend (Spring Boot + MongoDB)
cd backend


Configure MongoDB in application.properties:

spring.data.mongodb.uri=mongodb://localhost:27017/placify_db
spring.data.mongodb.database=placify_db


Build & run the backend:

mvn spring-boot:run

3️⃣ Frontend (React)
cd ../frontend
npm install
npm start


Open in browser: http://localhost:3000

🧠 Future Enhancements

Email/SMS notifications for students and recruiters.

AI-based resume screening & job recommendation.

Advanced analytics dashboards for admins.

Mobile app or PWA for real-time updates.

Timed quizzes with leaderboard for student assessment.

👨‍💻 Team Members
Name	Role
Ujjawal Kumar	Full Stack Lead (React + Spring Boot + MongoDB)
Mana Panda	Frontend Developer (React + UI/UX)
Rohit Soni	Backend & Database (MongoDB)
Shubham Sharma	UI/UX & Testing
🧑‍🏫 Guided By

Tapas Pal Sir
Department of Information Technology,
Asansol Engineering College
