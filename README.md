📚 Campus Core Hub – Smart Campus Operations System

📌 Project Overview
    Campus Core Hub is a web-based system developed under the Smart Campus Operations Hub concept. It provides a centralized platform to manage university resources such as facilities,       bookings, and incident handling.

The system improves operational efficiency by reducing manual processes, avoiding scheduling conflicts, and enhancing communication between users and administrators through notifications.

🚀 Features

🔐 Authentication & Security
--OAuth 2.0 (Google Login)
--JWT-based authentication
--Role-based access control (User, Admin, Technician)

👥 User Management
--User registration & login
--Profile update (name, image, password)
--Role management
--Admin can block/unblock users
--Admin can view all users and generate reports

🏢 Facilities & Assets
--View available resources (rooms, labs, equipment)
--Search and filter assets

📅 Booking Management
--Create booking requests
--Approval/rejection workflow
--Prevent scheduling conflicts

🛠️ Incident / Ticket System
--Create and manage tickets
--Track ticket status (OPEN → IN_PROGRESS → RESOLVED → CLOSED)
--Technician assignment

🔔 Notifications
--Booking updates (created, approved, rejected with reason)
--Ticket updates
--Notification panel with read/unread status

🛠️ Technologies Used
--Frontend: React
--Backend: Spring Boot
--Database: MySQL
--Authentication: OAuth 2.0 (Google Login), JWT
--API Testing: Postman
--Version Control: GitHub

⚙️ Setup & Installation Guide
📌 Prerequisites

Make sure you have installed:

-Java JDK 17+
-Node.js (v16 or higher)
-MySQL Server
-Git
-Postman

🔧 Backend Setup (Spring Boot)

1️⃣ Navigate to backend
cd backend

2️⃣ Configure Database

Open:
src/main/resources/application.properties

Update:

spring.datasource.url=jdbc:mysql://localhost:3306/campus_core_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update


3️⃣ Configure OAuth (Google Login)

spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET


4️⃣ Run Backend

.\mvnw.cmd spring-boot:run

✅ Backend URL
http://localhost:8081

💻 Frontend Setup (React)

1️⃣ Navigate to frontend
cd frontend

2️⃣ Install dependencies
npm install

3️⃣ Run frontend
npm run dev

✅ Frontend URL
http://localhost:5173


🔗 API Base URL
http://localhost:8081/api


🧪 Testing & Validation

**APIs tested using Postman
**Verified GET, POST, PUT requests
**Checked status codes (200, 400, 500)

Validation Examples
--Missing email → “Email is required”
--Invalid login → access denied
--Unauthorized access → restricted
--Blocked user → cannot login
--Server errors handled properly

🎨 Client Web Application
----------Pages--------------------

Home Page
About Us Page
Login & Register Page (Google Login included)
User Dashboard
Admin Dashboard
Technician Dashboard
Booking Page
Ticket Page
Notification Panel
Profile Page
Assets Page

---------UI Design-----------------

Clean and user-friendly interface
Role-based navigation
Responsive layout

----------API Integration-----------

Axios used for API calls
JSON-based communication
Secure requests using JWT

🔐 Authentication

--OAuth 2.0 Google Login
--JWT token-based authentication
--Role-based access (User / Admin / Technician)
--Secure endpoints using Spring Security

🔄 Version Control
Managed using GitHub
Branching: main & dev
Meaningful commit messages
Individual contributions tracked

👥 Team Contribution
Member	Contribution
Dayani De Silva	Notification System, Role Management, OAuth 2.0, JWT Authentication
Jayamini	Booking Management
Dasuni	Ticket System
Neshan	Facilities & Assets

⚠️ Notes
Developed for IT3030 – Programming Applications and Frameworks
AI tools such as ChatGPT were used for guidance and learning
