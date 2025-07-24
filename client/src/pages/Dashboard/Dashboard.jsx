import React from "react";
import NavBar from "../../components/layout/NavBar";
import Footer from "../../components/layout/Footer";
import SideBar from "../../components/layout/SideBar";
import AccountsCard from "../../components/UI/AccountsCard";
import BudgetingCard from "../../components/UI/BudgetingCard";
import DebtCard from "../../components/UI/DebtCard";
import SavingsCard from "../../components/UI/SavingsCard";
import "./Dashboard.css";
import {Link} from "react-router-dom";

export default function Dashboard() {
    return (
        <div>
            <header>
                <NavBar />
            </header>
            <div className="dashboard-container">
                <SideBar />
                <div className="content">
                    <Link to="/cardManagement">
                        <div className="card">
                            <AccountsCard />
                        </div>
                    </Link>
                    <Link to="/budgeting">
                        <div className="card">
                            <BudgetingCard />
                        </div>
                    </Link>
                    <Link to="/debt">
                        <div className="card">
                            <DebtCard />
                        </div>
                    </Link>
                    <Link to="/savings">
                        <div className="card">
                            <SavingsCard />
                        </div>
                    </Link>

                </div>
            </div>
            <footer>
                <Footer />
            </footer>
        </div>

    )
}