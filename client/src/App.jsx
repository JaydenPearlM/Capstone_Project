// src/components/PlaidLinkButton.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
// import 'normalize.css';
import './App.css';
import Home from "./pages/Home/Home";
import Plaid from "./components/layout/PlaidLinkButton.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Debt from "./pages/Debt/Debt.jsx";
import CardManagement from './pages/CardManagement/CardManagement.jsx';
import Savings from './pages/Savings/Savings.jsx';
import Signup from './pages/Signup/Signup.jsx';
import Login from './pages/Login/Login.jsx';
import Settings from './pages/Settings/Settings.jsx';
import Budgeting from './pages/Budgeting/Budgeting.jsx';
import ContactUs from './pages/ContactUs/ContactUs.jsx'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword.jsx';
import Tutorial from './pages/Tutorial/Tutorial.jsx';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/contactUs" element={<ContactUs />}/>
            <Route path="/forgot-password" element={<ForgotPassword/>} />

            {/* Protected routes */}
            <Route path="/plaid" element={
              <ProtectedRoute>
                <Plaid />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/debt" element={
              <ProtectedRoute>
                <Debt />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/savings" element={
              <ProtectedRoute>
                <Savings />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/cardManagement" element={
              <ProtectedRoute>
                <CardManagement />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/budgeting" element={
              <ProtectedRoute>
                <Budgeting />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/tutorial" element={
              <ProtectedRoute>
                <Tutorial />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
