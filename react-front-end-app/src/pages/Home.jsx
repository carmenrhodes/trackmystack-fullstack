import QuickAdd from "../components/QuickAdd";
import "./Home.css";
import SpotPrices from "../components/SpotPrices";
/* Import for test functions 
import { calculateTotalValue, calculateTotalWeight } from "../utils/utils";*/
import { useState, useEffect } from "react";
import { mockStacks } from "../utils/mockData";

function Home({ stack, onAdd }) {
    const useMockData = true; // change to false after testing
    const [totalWeight, setTotalWeight] = useState(0);
    const [totalValue, setTotalValue] = useState(0);
  //const totalWeight = stack.reduce((sum, i) => sum + i.weight, 0);
    //const totalValue = stack.reduce((sum, i) => sum + i.price, 0);
    /* For testing
    const totalWeight = calculateTotalWeight(stack);
    const totalValue = calculateTotalValue(stack);*/

    useEffect(() => {
        if (useMockData) {
            // pretend these totals are calculated from the backend
            // either hardcode OR calculate from mockStacks
            const weightFromMock = mockStacks.reduce(
                (sum, item) => sum + (item.weightOtz || item.weight || 0),
                0
            );

            
            const valueFromMock = 7842.0;

            setTotalWeight(weightFromMock);
            setTotalValue(valueFromMock);
        } else {
            
            const weightReal = stack.reduce((sum, i) => sum + i.weight, 0);
            const valueReal = stack.reduce((sum, i) => sum + i.price, 0);

            setTotalWeight(weightReal);
            setTotalValue(valueReal);

        
        }
    }, [useMockData, stack]);

    return (
        <div className="dashboard-container">
            <div className="dashboard">
                <h2>Dashboard</h2>

                <div className="summary-cards">
                    <div className="card">
                        <h3>Total Weight</h3>
                        <p>{totalWeight.toFixed(2)} otz</p>
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