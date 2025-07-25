import "./BudgetSummary.css";

const BudgetSummary = ({ categories, transactions }) => {
    const getSpending = (catId) =>
        transactions
            .filter((tx) => tx.categoryId === catId)
            .reduce((sum, tx) => sum + tx.amount, 0);

    const totalBudget = categories.reduce((sum, cat) => sum + Number(cat.budget), 0);
    const totalSpent = categories.reduce((sum, cat) => sum + getSpending(cat.id), 0);
    const remaining = totalBudget - totalSpent;
    return (
        <div className="budgeting-section">
            <div className="total-budget-summary" >
                <p><strong>Total Budget:</strong> ${totalBudget.toFixed(2)}</p>
                <p><strong>Total Spent:</strong> ${totalSpent.toFixed(2)}</p>
                <p><strong>Remaining:</strong> ${remaining.toFixed(2)}</p>
            </div>

            <div className="budget-header budget-row" id="budget-header">
                <div className="category-name">Category</div>
                <div className="category-budget">Budget</div>
                <div className="category-spent">Spent</div>
                <div className="category-remaining">Remaining</div>
            </div>
            <ul className="category-list">
                {categories.map((cat) => {
                    const spent = getSpending(cat.id);
                    const remaining = cat.budget - spent;
                    return (

                        <div
                            key={cat.id}
                            className={`budget-item ${remaining < 0 ? 'over-budget' : ''}`}
                        >
                            <div className="budget-row">
                                <div className="category-name">{cat.name}</div>
                                <div className="category-budget">${Number(cat.budget).toFixed(2)}</div>
                                <div className="category-spent">${spent.toFixed(2)}</div>
                                <div className="category-remaining">${remaining.toFixed(2)}</div>
                            </div>
                        </div>
                    );
                })}
            </ul>

        </div>
    );
};

export default BudgetSummary;