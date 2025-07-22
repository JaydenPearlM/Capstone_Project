# Cache Budgeting App

A MERN‐stack financial budgeting application using MongoDB/Mongoose, Express.js, React, and Node.js.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)  
2. [Project Structure](#project-structure)  
3. [Environment Variables](#environment-variables)  
4. [Installation & Setup](#installation--setup)  
   - [Backend](#backend)  
   - [Frontend](#frontend)  
5. [Plaid Integration](#plaid-integration)  
6. [Running the App](#running-the-app)  
7. [Troubleshooting](#troubleshooting)  
8. [Contributing](#contributing)  
9. [License](#license)

---

## 🚀 Prerequisites

- **Node.js** v16+ & **npm** (or Yarn)  
- **MongoDB** (local or [Atlas](https://www.mongodb.com/atlas))  
- **Plaid** account for banking integration (sandbox or development)

---

## 🗂 Project Structure

```
/ (project root)
├── client/               # React frontend
│   ├── public/           # static assets
│   └── src/              # React source files
│       └── App.js
├── server/               # Express backend
│   ├── controllers/      # request handlers
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   ├── middleware/       # auth, validation, rate limiting
│   ├── swaggerOptions.js # Swagger/OpenAPI setup
│   └── server.js         # app entrypoint
├── Jayden_Updates.mb      # meeting notes / updates
├── package.json          # root-level scripts (if any)
└── README.md             # ← you are here
```

---

## 🛠 Environment Variables

Create a `.env` file in the `/server` folder (copy from `.env` example if provided) and add:

```env
MONGODB_URI=<your MongoDB connection string>

# JWT for auth (if implemented)
JWT_SECRET=<your_jwt_secret>

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# Plaid (get these from https://dashboard.plaid.com)
PLAID_CLIENT_ID=<your_plaid_client_id>
PLAID_SECRET=<your_plaid_secret>
PLAID_ENV=sandbox
```

If your React app needs to talk to the API, you can also add to `/client/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api/v1
```

---

## 🔧 Installation & Setup

### Backend

1. Open a terminal and navigate to the `server` folder:  
   ```bash
   cd server
   ```
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Ensure your `.env` is populated as above.  
4. Start the development server (with live reload):  
   ```bash
   npm run dev
   ```

### Frontend

1. In a new terminal, navigate to the `client` folder:  
   ```bash
   cd client
   ```
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Start React in development mode:  
   ```bash
   npm start
   ```

---

## 💳 Plaid Integration

1. Sign up / log in to [Plaid Dashboard](https://dashboard.plaid.com).  
2. Create a Sandbox (or Development) application to get your **Client ID** and **Secret**.  
3. Copy those values into your `/server/.env` under `PLAID_CLIENT_ID` and `PLAID_SECRET`.  
4. Set `PLAID_ENV=sandbox`.  
5. Your backend has routes in `server/routes/Plaidroutes.js` to:
   - Generate a link token  
   - Exchange a public token for an `access_token` & `item_id`  
6. The exchanged tokens are persisted in your database for later API calls.

---

## ▶️ Running the App

- **Backend**:  
  ```bash
  cd server
  npm run dev
  ```
  API is available at `http://localhost:5000/api/v1`.

- **Frontend**:  
  ```bash
  cd client
  npm start
  ```
  UI is available at `http://localhost:3000`.

---

## ❓ Troubleshooting

- **MongoDB connection errors**:  
  - Verify `MONGODB_URI` in `/server/.env`.  
  - If local, ensure `mongod` is running.  
- **CORS issues**:  
  - Check `FRONTEND_URL` matches your React origin.  
- **Plaid errors**:  
  - Confirm `PLAID_ENV` matches your Dashboard environment (sandbox vs development).  
- **Port conflicts**:  
  - Default ports: `5000` (backend), `3000` (frontend). Adjust in `.env` or scripts if needed.

---

## 🤝 Contributing

1. Fork the repo  
2. Create a feature branch (`git checkout -b feature/YourFeature`)  
3. Commit your changes (`git commit -m "Add awesome feature"`)  
4. Push (`git push origin feature/YourFeature`)  
5. Open a Pull Request

---

## 📜 License

MIT License — see `LICENSE` file for details.
