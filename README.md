# 🏥 Doctor Appointment Booking System

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?size=28&duration=4000&color=0A66C2&center=true&vCenter=true&width=900&lines=Doctor+Appointment+Booking+System;MERN+Stack+Full+Stack+Project;Admin+%7C+Doctor+%7C+User+Dashboard;Built+With+React+%2B+Tailwind+%2B+AntD" />
</p>
<p align="center">
  <a href="https://appointment.shwetakohad.in">
    <img src="https://img.shields.io/badge/🌐_Live_Demo-Open_Project-0A66C2?style=for-the-badge" />
  </a>
  <img src="https://img.shields.io/badge/Stack-MERN-13aa52?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Auth-JWT-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/UI-Tailwind+AntD-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Status-Production-success?style=for-the-badge" />
</p>

---

## 🚀 Live Application

👉 **https://appointment.shwetakohad.in**

---

# 📌 Project Overview

A full-stack **Doctor Appointment Booking Platform** built using the **MERN Stack**.

This application provides a complete role-based workflow system:

- 👤 **Users** can register and book appointments  
- 🩺 **Doctors** can approve or reject appointment requests  
- 🛠 **Admin** can verify and manage doctor applications  

The system ensures secure authentication, structured approval flows, and a modern responsive UI.

---

# 🛠 Tech Stack

## 💻 Frontend
- ⚛️ React.js  
- 🎨 Tailwind CSS  
- 🧩 Ant Design (AntD)  
- 🔄 Redux  
- 🔗 Axios  

## 🖥 Backend
- 🟢 Node.js  
- 🚂 Express.js  
- 🍃 MongoDB  
- 🔐 JWT Authentication  

---

# 👥 Role-Based Panels

## 👤 User Panel
- Register & Login  
- Book appointment with available doctors  
- Track appointment status  
- Apply as a Doctor  

---

## 🩺 Doctor Panel
- View appointment requests  
- Approve / Reject appointments  
- Manage profile information  
- Dashboard access  

---

## 🛠 Admin Panel
- View all users  
- Review doctor applications  
- Approve / Reject doctor requests  
- Manage platform data  

---

# 🔄 Application Workflow

```mermaid
flowchart LR
A[User Registers] --> B[Book Appointment]
B --> C[Doctor Receives Request]
C --> D{Approve?}
D -->|Yes| E[Appointment Confirmed]
D -->|No| F[Appointment Rejected]
A --> G[Apply as Doctor]
G --> H[Admin Reviews]
H --> I{Approve?}
I -->|Yes| J[Doctor Account Activated]
I -->|No| K[Application Rejected]
