// src/components/PlaidLinkButton.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import 'normalize.css';
import './App.css';
import Home from "./pages/Home/Home";
import Plaid from "./components/layout/PlaidLinkButton.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Debt from "./pages/Debt/Debt.jsx";
import CardManagement from './pages/CardManagement/CardManagement.jsx';
import Expenses from './pages/Expenses/Expenses.jsx';
import Savings from './pages/Savings/Savings.jsx';
import Goals from './pages/Goals/Goals.jsx';
import Signup from './pages/Signup/Signup.jsx';
import Login from './pages/Login/Login.jsx';
import Settings from './pages/Settings/Settings.jsx';
import Transactions from './pages/Transactions/Transactions.jsx';
import Budgeting from './pages/Budgeting/Budgeting.jsx';


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
          <Route path="/dashboard/cardManagement" element= {<CardManagement />}/>
          <Route path="/dashboard/transactions" element={<Transactions />}/>
          <Route path="/dashboard/budgeting" element={<Budgeting />} />
        </Routes>
      </div>
    </Router>
  );
}
