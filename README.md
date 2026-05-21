# 🎬 MovieMate

MovieMate is a modern full-stack **movie & TV show discovery platform** built using **React.js, Node.js, Express.js, MongoDB, PostgreSQL, Prisma, and Socket.io**.  
It provides a smooth and interactive experience for discovering movies, tracking watch activity, receiving personalized recommendations, and interacting with other users in real-time.

---

# ✨ Features

- 🔎 **Live Movie Search** – Dynamic search with instant filtering  
- ⭐ **Watchlist & Favorites System** – Save and manage favorite movies  
- 📜 **Recently Viewed Tracking** – Tracks user watch history automatically  
- 🎥 **Movie Details Page** – Detailed movie information with dynamic routing  
- 🎞️ **Spotlight Carousel** – Interactive hero banner slider  
- 🎬 **Browse Movies & TV Shows** – Dedicated sections for movies and series  
- 👤 **JWT Authentication System** – Secure login & registration using access and refresh tokens  
- 🔐 **Protected Routes** – Secure APIs using authentication middleware  
- 🍪 **Sessions & Cookies** – Session management using Express Sessions and Cookies  
- 💬 **Real-Time Comments System** – Live comments and replies using Socket.io  
- ❤️ **Like & Reply System** – Like and reply to comments instantly  
- 📊 **Analytics Dashboard** – Graphs and insights based on watch activity  
- 📝 **Movie Notes & Ratings** – Personal notes and ratings for movies  
- 🎯 **Personalized Recommendations** – Suggestions based on user activity and ratings  
- 📺 **Where to Watch Feature** – Shows OTT platform availability for movies and shows  
- 🔔 **Real-Time Notifications** – Live notifications using Socket.io  
- 🖼️ **Avatar Upload System** – Upload real profile photos with fallback cartoon avatars  
- ☁️ **Cloudinary Integration** – Cloud image storage for avatar uploads  
- 🧪 **Unit Testing** – API testing using Jest and Supertest  
- 🚀 **Deployment Ready** – Frontend and backend deployment support  
- 📱 **Fully Responsive UI** – Optimized for desktop, tablet, and mobile devices  

---

# 🧩 Tech Stack

| Technology | Purpose |
|---|---|
| **React.js (Vite)** | Frontend UI and component-based architecture |
| **Node.js** | Backend runtime environment |
| **Express.js** | REST API and backend framework |
| **MongoDB + Mongoose** | NoSQL database for users, library, sessions |
| **PostgreSQL + Prisma ORM** | Relational database for comments and reviews |
| **Socket.io** | Real-time communication and notifications |
| **JWT Authentication** | Secure authentication and protected routes |
| **bcrypt** | Password hashing and security |
| **Express Sessions & Cookies** | Session management |
| **Multer + Cloudinary** | Avatar image upload and cloud storage |
| **TMDB API** | Movie and TV show data provider |
| **Chart.js / Recharts** | Analytics graphs and visualizations |
| **Jest + Supertest** | Unit testing and API testing |
| **Render & Vercel** | Deployment platforms |
| **Postman** | API testing and debugging |

---

# 🧠 Learning Goals

This project demonstrates and applies:

- Full-stack application development  
- REST API architecture  
- Authentication & authorization using JWT  
- Middleware lifecycle in Express.js  
- Real-time communication using Socket.io  
- Session & cookie management  
- MongoDB and PostgreSQL database integration  
- Prisma ORM and Mongoose ODM  
- CRUD operations and protected APIs  
- File upload handling with Multer and Cloudinary  
- Responsive UI/UX design  
- Deployment and testing workflows  

---

# 🏗️ Project Architecture

```text
Frontend (React.js)
        ↓
Express.js Backend Server
        ↓
Middleware Layer
(Auth, Logger, Error Handler)
        ↓
MongoDB + PostgreSQL
        ↓
TMDB External API
        ↓
Socket.io Real-Time Layer