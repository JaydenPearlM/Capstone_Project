# Cache Budgeting App

A MERN‐stack financial budgeting application using MongoDB/Mongoose, Express.js, React, and Node.js.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Environment Variables](#environment-variables)
4. [Installation & Setup](#installation--setup)

   * [Backend](#backend)
   * [Frontend](#frontend)
5. [Plaid Integration](#plaid-integration)
6. [Running the App](#running-the-app)
7. [Troubleshooting](#troubleshooting)
8. [🛠️ Next Development Tasks](#next-development-tasks)
9. [Contributing](#contributing)
10. [License](#license)

---

## 🚀 Prerequisites

* **Node.js** v16+ & **npm** (or Yarn)
* **MongoDB** (local or [Atlas](https://www.mongodb.com/atlas))
* **Plaid** account for banking integration (sandbox or development)

---

## 🗂 Project Structure

```
/ (project root)
├── client/               # React frontend
│   ├── public/           # static assets
│   └── src/              # React source files
├── server/               # Express backend
│   ├── config/           # app configuration (logger, etc.)
│   ├── controllers/      # request handlers
│   ├── middleware/       # auth, validation, rate limiting
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   ├── swaggerOptions.js # Swagger/OpenAPI setup
│   └── server.js         # app entrypoint
├── logs/                 # application log files (winston)
├── package.json          # root-level scripts (if any)
└── README.md             # ← this file
```

---

## 🛠 Environment Variables

Create a `.env` file in the `/server` folder (copy from `.env.example` if provided) and add:

```env
MONGODB_URI=<your MongoDB connection string>

# JWT for auth (if implemented)
JWT_SECRET=<your_jwt_secret>

# Frontend URL for CORS\ nFRONTEND_URL=http://localhost:3000

# Plaid credentials\ nPLAID_CLIENT_ID=<your_plaid_client_id>
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
4. Start the development server (with live reload via nodemon):

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

1. Sign in to [Plaid Dashboard](https://dashboard.plaid.com).
2. Create a Sandbox (or Development) application to get your **Client ID** and **Secret**.
3. Copy those values into your `/server/.env` under `PLAID_CLIENT_ID` and `PLAID_SECRET`.
4. Set `PLAID_ENV=sandbox`.
5. Your backend has routes in `server/routes/plaidRoutes.js` to:

   * Generate a link token
   * Exchange a public token for an `access_token` & `item_id`
6. Tokens are persisted to your `User` model for later use.

---

## ▶️ Running the App

* **Backend**:

  ```bash
  cd server
  npm run dev
  ```

  API endpoints are available at `http://localhost:5000/api/v1`

* **Frontend**:

  ```bash
  cd client
  npm start
  ```

  UI is available at `http://localhost:3000`

---

## ❓ Troubleshooting

* **MongoDB connection errors**:

  * Verify `MONGODB_URI` in `/server/.env`.
  * If local, ensure `mongod` is running.
* **CORS issues**:

  * Check `FRONTEND_URL` matches your React origin.
* **Plaid errors**:

  * Confirm `PLAID_ENV` matches your Dashboard environment.
* **Port conflicts**:

  * Default ports: `5000` (backend), `3000` (frontend). Adjust in `.env` or scripts if needed.

---

## 🛠️ Next Development Tasks

Below are the remaining backend work items. Follow the links to file locations and the step-by-step guides in our docs.

1. **Data Models**
   Create Mongoose schemas in `server/models/` for:

   * `User.js` (email, passwordHash, plaidAccessToken, plaidItemId)
   * `SavingsGoal.js` (user ref, name, targetAmount, currentAmount, dueDate)
   * `Debt.js` (user ref, creditor, balance, minimumPayment, dueDate)

2. **Transaction CRUD**
   Implement in `server/controllers/transactionController.js`:

   * `getAll`, `getById`, `create`, `update`, `remove` methods, mirroring your category handlers.

3. **Complete Category Update**
   In `server/controllers/categoryController.js`, add and export the `update` method matching the PUT route in `server/routes/categoryRoutes.js`.

4. **Centralized Error Handling & Logging**

   * Install and configure Winston (`server/config/logger.js`).
   * Replace `console.log` with `logger.info` / `logger.error` in all controllers.
   * Add error middleware at the end of `server/server.js`:

     ```js
     app.use((err, req, res, next) => {
       logger.error(err.stack);
       res.status(err.status || 500).json({ error: { message: err.message }});
     });
     ```

5. **Fetch Transactions Endpoint**

   * Add route `GET /api/v1/transactions/fetch` in `server/routes/transactionRoutes.js`
   * In `transactionController`, call `plaidClient.getTransactions(user.plaidAccessToken, ...)` and return the data.

6. **Persist Plaid Tokens**

   * After public-token exchange in `server/controllers/plaidController.js`, save `access_token` & `item_id` to the `User` model:

     ```js
     await User.findByIdAndUpdate(req.user.id, { plaidAccessToken, plaidItemId });
     ```

7. **Request Validation**

   * Install `express-validator`.
   * Add validation middleware in your POST/PUT routes (e.g., check required fields in categories and transactions).
   * Return 400 with validation errors when checks fail.

8. **Authentication & Security Middleware**

   * Install `jsonwebtoken` and `bcrypt`.
   * Implement signup/login to hash passwords and issue JWT.
   * Create auth middleware to verify JWT on protected routes (create/update/delete).
   * Ensure `helmet()` and rate limiting remain in place.

9. **Testing & Verification**

   * Finish your Postman collection to manually test all endpoints.
   * (Optional) Set up automated tests with Jest & Supertest under `tests/`.

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
