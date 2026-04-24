📚 Campus Core Hub – Smart Campus Operations System

📌 Project Overview

Campus Core Hub is a web-based system developed under the Smart Campus Operations Hub concept. It provides a centralized platform to manage university resources such as facilities, bookings, and incident handling.

The system improves operational efficiency by reducing manual processes and enabling smooth communication between users and administrators.

🚀 Features

🔐 Authentication & Security
    OAuth 2.0 (Google Login)
    JWT-based authentication
    Role-based access (User, Admin, Technician)
    
👥 User Management
    Register & Login
    Profile update (name, image, password)
    Admin can block/unblock users
    Role management
    
🏢 Facilities & Assets
    View available resources (rooms, labs, equipment)
    Search and filter assets
    
📅 Booking Management
    Create booking requests
    Approval/rejection workflow
    Conflict handling
    
🛠️ Incident / Ticket System
    Create tickets
    Track status (OPEN → IN_PROGRESS → RESOLVED → CLOSED)
    Technician assignment
    
🔔 Notifications
    Booking updates (created, approved, rejected)
    Ticket updates
    Notification panel with read/unread status
    
🛠️ Technologies Used
    Frontend: React
    Backend: Spring Boot
    Database: MySQL
    Authentication: OAuth 2.0 (Google Login), JWT
    API Testing: Postman
    Version Control: GitHub
    
📂 Project Structure

--Backend (Spring Boot)
    Controller Layer
    Service Layer
    Repository Layer
    Security Configuration
    
--Frontend (React)
    Components
    Pages
    API Integration (Axios)

    
⚙️ Setup Instructions

🔧 Backend Setup
    Navigate to backend folder
    Configure application.properties (database, port)
    Run the application
        .\mvnw.cmd spring-boot:run
        
💻 Frontend Setup
    Navigate to frontend folder
    Install dependencies
        npm install
    Run the application
        npm run dev

        
🔗 API Base URL
http://localhost:8081/api


🧪 Testing
    APIs were tested using Postman
    Includes validation and error handling
    Example responses: 200 OK, 400 Bad Request, 500 Server Error

    
👥 Team Contribution

Member	                  Contribution

Dayani              Notification System, Role Management, OAuth 2.0, JWT Authentication
Jayamini	          Booking Management
Dasuni              Ticket System
Neshan              Assets & Facilities

⚠️ Notes
--This project was developed as part of the IT3030 – Programming Applications and Frameworks module.
--AI tools such as ChatGPT were used for learning and guidance purposes.

