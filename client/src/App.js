// src/components/PlaidLinkButton.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from "./pages/Home/Home";
import Plaid from "./components/layout/PlaidLinkButton.jsx";

// const Home = () => <div>Homepage</div>
const Signup = () => <div>Signup</div>
const Login = () => <div>Login</div>
const Dashboard = () => <div>Dashboard Page</div>;
const Expenses = () => <div>Expenses Page</div>;
const Debt = () => <div>Debt Page</div>;
const Savings = () => <div>Savings Page</div>;
const Goals = () => <div>Goals Page</div>;
const Settings = () => <div>Settings Page</div>;


export default function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plaid" element={<Plaid />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/expenses" element={<Expenses />} />
          <Route path="/dashboard/debt" element={<Debt />} />
          <Route path="/dashboard/savings" element={<Savings />} />
          <Route path="/dashboard/goals" element={<Goals />} />
          <Route path="/dashboard/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}
