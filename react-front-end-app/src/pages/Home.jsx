import QuickAdd from "../components/QuickAdd";
import "./Home.css";
import SpotPrices from "../components/SpotPrices";
/* Import for test functions 
import { calculateTotalValue, calculateTotalWeight } from "../utils/utils";*/

function Home({ stack, onAdd }) {
    const totalWeight = stack.reduce((sum, i) => sum + i.weight, 0);
    const totalValue = stack.reduce((sum, i) => sum + i.price, 0);
    /* For testing
    const totalWeight = calculateTotalWeight(stack);
    const totalValue = calculateTotalValue(stack);*/

    return (
        <div className="dashboard-container">
            <div className="dashboard">
                <h2>Dashboard</h2>

                <div className="summary-cards">
                    <div className="card">
                        <h3>Total Weight</h3>
                        <p>{totalWeight.toFixed(2)} oz</p>
                    </div>
                    <div className="card">
                        <h3>Total Value</h3>
                        <p>${totalValue.toFixed(2)}</p>
                    </div>
                </div>


                <QuickAdd onAdd={onAdd} />
                <SpotPrices />
            </div>
        </div>
    );
}

export default Home;