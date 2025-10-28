export async function fetchSpotPrices() {
    try {
        const response = await fetch(
            "https://api.metalpriceapi.com/v1/latest?api_key=9ccbec31c1e9619f2f6069a33da0618a&base=USD&currencies=XAU,XAG"
        );
        const data = await response.json();

        if (data.success && data.rates) {
            return {
                gold: 1 / data.rates.XAU,
                silver: 1 / data.rates.XAG,
            };
        } else {
            throw new Error("Invalid response");
        }
    } catch (err) {
        throw new Error("Failed to fetch");
    }
}