# Full-Stack Task Manager (Pro)

A production-ready Full-Stack Task Manager application built with a React/TypeScript frontend and a Node.js/Express/TypeScript backend. The application features multi-board support, responsive layouts, a real-time reactive task workflow dashboard, automated data streaming, and advanced board metrics via MongoDB aggregation pipelines.

---

## 🌐 Live Demo

The application is fully deployed and accessible at:
- **Frontend App**: [https://tasks-manager-frontend-iv2e.onrender.com](https://tasks-manager-frontend-iv2e.onrender.com)

---

## 🚀 Features

- **Dynamic Task Workflow**: Seamlessly move tasks across `To Do`, `In Progress`, and `Done` states with real-time UI state synchronization.
- **Robust Backend Architecture**: Production-grade REST API utilizing the Repository Pattern, strict Express validations, and MongoDB/Mongoose structures.
- **Advanced Dashboard Analytics**: Utilizes specialized MongoDB aggregation pipelines to track real-time board metrics (total tasks vs. completed tasks).
- **NDJSON Stream Engine**: High-performance streaming interface utilizing cursor-driven text decoding for responsive dataset management.
- **Secure Cross-Origin Sessions**: Advanced cookie-session and JWT integration with robust CORS configurations built for multi-domain cloud hosting.

---

## 🛠️ Tech Stack & Dependencies

### Frontend (`/client`)
- **Core**: React 19, TypeScript, Vite, Redux Toolkit (RTK Query)
- **UI Components**: Ant Design (antd), Ant Design Icons

### Backend (`/server`)
- **Framework**: Express, TypeScript, Mongoose, MongoDB
- **Security & Session**: JSONWebToken, Passport, Passport-Local, Cookie-Parser, Cors, Helmet
- **Utilities**: Winston Logger, Express-Validator, Dotenv, Axios, Multer
- **Testing Suite**: Jest, Ts-Jest, Supertest

---

## ⚙️ Installation & Local Setup

### 1. Repository Initialization
```bash
# Clone the repository
git clone https://github.com
cd task-manager-pro
```

### 2. Backend Environment Configuration
```bash
cd server

# Install essential production dependencies
npm i winston express express-validator multer axios dotenv passport passport-local jsonwebtoken cookie-parser cors helmet mongodb mongoose jest ts-jest supertest

# Install typescript typing environments
npm install --save-dev @types/node @types/express @types/express-session @types/cookie-parser @types/passport @types/passport-local @types/cors @types/mongodb @types/jest @types/supertest typescript

# Create local environmental configurations (.env)
cat <<EOT >> .env
PORT=3000
DB_URI=mongodb+srv://{{user}}:{{password}}@cluster0.rhfvxdp.mongodb.net
DB_NAME=tasks-manager
DB_USER=your_mongodb_user
DB_PASSWORD=your_mongodb_password
JWT_SECRET_KEY=your_secure_jwt_secret
COOKIE_SECRET_KEY=your_secure_cookie_secret
CLIENT_URLS=http://localhost:5173
NODE_ENV=development
EOT
```

### 3. Frontend Environment Configuration
```bash
cd ../client

# Install frontend libraries
npm install

# Setup local client connection string (.env)
echo "VITE_API_URL=http://localhost:3000" > .env
```

---

## 📦 Database Migrations

Compile your backend source structures and execute the initial data scripts to seed mock configurations into your MongoDB cluster:

```bash
cd ../server
npx tsc

# Populate core environments
node dist/migrations/initial_users_30_04_2026_1777551050777.js
node dist/migrations/initial_boards_30_04_2026_1777551050777.js
node dist/migrations/initial_tasks_30_04_2026_1777551050777.js
```

---

## 📊 Analytics & Aggregation Verification

The application employs specialized aggregation pipelines returning total task load alongside total completed tasks (`done`) for target boards. 

To verify engine compliance locally or via standard integration tools (Postman/cURL), execute an authenticated request against:
```text
GET http://localhost:3000/api/v1/boards/statistics
```

#### Sample Response Structure:
```json
{
  "data": [
    {
      "_id": "c0c827f4-05c6-4df0-893c-de3125089c2a",
      "boardName": "Production Roadmap",
      "totalTasks": 10,
      "completedTasks": 4
    }
  ],
  "error": {}
}
```

---

## 🐳 Containerization & Deployment

### Local Multi-Container Runtime
Ensure your localized configurations link cleanly, then package using production Docker containers:

```bash
cd ../server

# Compile and package Docker container instance
docker build -t dockeryaroslav/tasks-manager:latest .

# Launch background task space container
docker run -d --name task-manager-api -p 3000:3000 dockeryaroslav/tasks-manager:latest
```
