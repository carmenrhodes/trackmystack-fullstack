import './FindCoinShops.css';
import FindCoinsMapImage from '../assets/findcoinshops.png';

function FindCoinShops() {
    return (
        <div className="shops-page">
            <h2>Find Coin Shops - Coming Soon!</h2>
            <p className="find-shops-message">We're mapping out the best local spots to grow your stack. Stay tuned!</p>
            <img src={FindCoinsMapImage} alt="Map showing coin shops with pins" className="map-image" />
        </div>
    );
}

export default FindCoinShops;