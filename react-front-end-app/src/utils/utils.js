export function calculateTotalWeight(stack) {
    return stack.reduce((sum, item) => sum + item.weight, 0);
}

export function calculateTotalValue(stack) {
    return stack.reduce((sum, item) => sum + item.price, 0);
}

// Converts API exchange rates into spot prices
export function convertSpotRates(rates) {
    return {
        XAU: rates.XAU ? 1 / rates.XAU : NaN,
        XAG: rates.XAG ? 1 / rates.XAG : NaN,
    };
}

// Validates user input
export function isValidStackItem(item) {
    return (
        typeof item.metal === 'string' && item.metal.trim() !== '' &&
        typeof item.weight === 'number' && item.weight > 0 &&
        typeof item.price === 'number' && item.price > 0
    );
}
