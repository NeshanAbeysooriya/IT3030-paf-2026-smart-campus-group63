# 📚 Campus Core Hub – Smart Campus Operations System

## 📌 Project Overview

**Campus Core Hub** is a web-based Smart Campus Operations System developed to streamline university resource management. The system provides a centralized platform for managing facilities, assets, bookings, incident handling, and user administration.

The platform reduces manual processes, prevents scheduling conflicts, improves resource utilization, and enhances communication between users, technicians, and administrators through a real-time notification system.

---

# 🎯 Real-World Problems Solved

### Traditional Campus Management Problems

* Manual facility booking processes.
* Scheduling conflicts for rooms and resources.
* Difficulty tracking maintenance issues.
* Poor communication between users and administrators.
* Lack of centralized resource management.
* Time-consuming user administration.

### Campus Core Hub Solution

* Online facility and asset management.
* Automated booking approval workflow.
* Conflict-free scheduling system.
* Digital incident and ticket management.
* Real-time notifications.
* Centralized user and role management.
* Administrative reporting and monitoring.

---

# 🚀 Features

## 🔐 Authentication & Security

* Google OAuth 2.0 Login
* JWT-Based Authentication
* Spring Security Integration
* Role-Based Access Control (User, Admin, Technician)

## 👥 User Management

* User Registration & Login
* Profile Management
* Update Profile Information
* Change Password
* Upload Profile Image
* Role Management
* User Blocking & Unblocking
* User Report Generation

## 🏢 Facilities & Assets Management

* View Available Facilities
* View Available Assets
* Search Resources
* Filter Resources
* Manage Equipment Availability

## 📅 Booking Management

* Create Booking Requests
* Booking Approval & Rejection Workflow
* Prevent Scheduling Conflicts
* Booking Status Tracking

## 🛠 Incident / Ticket Management

* Create Tickets
* Assign Technicians
* Track Ticket Progress
* Update Ticket Status

### Ticket Workflow

```text
OPEN → IN_PROGRESS → RESOLVED → CLOSED
```

## 🔔 Notification System

* Booking Created Notifications
* Booking Approval Notifications
* Booking Rejection Notifications
* Ticket Status Updates
* Read / Unread Notification Management

---

# 🛠 Technologies Used

## Frontend

* React.js
* React Router DOM
* Axios
* Bootstrap / CSS

## Backend

* Spring Boot
* Spring Security
* Spring Data JPA

## Database

* MySQL

## Authentication & Security

* Google OAuth 2.0
* JWT Authentication
* Role-Based Authorization

## Testing

* Postman
* Manual Testing

## Version Control

* Git
* GitHub

---

# ⚙️ System Architecture

```text
React Frontend
      │
      ▼
REST APIs (Axios)
      │
      ▼
Spring Boot Backend
      │
      ▼
MySQL Database
```

---

# 🚀 Installation Guide

## Clone Repository

```bash
git clone <repository-url>
```

---

## Backend Setup

### Navigate

```bash
cd backend
```

### Configure Database

Update the following in:

```text
src/main/resources/application.properties
```

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/campus_core_db
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
```

### Configure Google OAuth

```properties
spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID

spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET
```

### Run Backend

```bash
./mvnw spring-boot:run
```

Windows:

```bash
.\mvnw.cmd spring-boot:run
```

Server runs on:

```text
http://localhost:8081
```

---

## Frontend Setup

### Navigate

```bash
cd frontend
```

### Install Dependencies

```bash
npm install
```

### Run Frontend

```bash
npm run dev
```

Application runs on:

```text
http://localhost:5173
```

---

# 🔗 API Base URL

```text
http://localhost:8081/api
```

---

# 🧪 Testing

### Tools Used

* Postman
* Manual Testing
* API Endpoint Validation

### Validations Tested

* Missing Required Fields
* Invalid Login Credentials
* Unauthorized Access
* Blocked User Access
* Booking Conflict Handling
* Server Error Handling

---

# 🎨 Client Web Application

## Available Pages

* Home Page
* About Us Page
* Login Page
* Register Page
* User Dashboard
* Admin Dashboard
* Technician Dashboard
* Assets Page
* Booking Page
* Ticket Page
* Notification Panel
* Profile Page

## UI Features

* Responsive Design
* User-Friendly Interface
* Role-Based Navigation
* Modern Dashboard Layout

---

# 🔄 Version Control

## Branch Strategy

```text
main → Production Branch

dev → Development Branch
```

## Git Practices

* Feature Branch Development
* Pull Requests
* Meaningful Commit Messages
* Contribution Tracking

---

# 👨‍💻 Team Contributions

| Member          | Contribution                                                                    |
| --------------- | ------------------------------------------------------------------------------- |
| Dayani De Silva | Notification System, Role Management, OAuth 2.0 Integration, JWT Authentication |
| Jayamini        | Booking Management                                                              |
| Dasuni          | Incident / Ticket Management                                                    |
| Neshan          | Facilities & Assets Management                                                  |

---

# 👨‍💻 Developed For

**IT3030 – Programming Applications and Frameworks**

**Project Name:** Campus Core Hub – Smart Campus Operations System

---

# 🤖 AI Usage Disclosure

AI tools such as ChatGPT were used for learning, debugging, documentation support, and development guidance.

---

# 📜 License

This project was developed for academic purposes as part of the **BSc (Hons) Information Technology Degree Program – SLIIT**.
