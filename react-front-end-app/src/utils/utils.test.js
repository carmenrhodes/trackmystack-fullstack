import { calculateTotalValue, calculateTotalWeight, convertSpotRates, isValidStackItem } from '../utils/utils';

// Test that total weight is claculating properly
describe('calculateTotalWeight', () => {
    it('returns the total weight of all items', () => {
        const stack = [{ weight: 2 }, { weight: 3.5 }, { weight: 4 }];
        expect(calculateTotalWeight(stack)).toBe(9.5);
    });

    it('returns 0 for an empty stack', () => {
        expect(calculateTotalWeight([])).toBe(0);
    });
});

// Tests that total value is calculating properly
describe('calculateTotalValue', () => {
    it('returns the total value of all items', () => {
        const stack = [{ price: 100 }, { price: 205.25 }, { price: 575.75 }];
        expect(calculateTotalValue(stack)).toBe(881);
    });

    it('returns 0 for an empty stack', () => {
        expect(calculateTotalValue([])).toBe(0);
    });
});


describe('convertSpotRates', () => {
    it('converts XAU and XAG rates to spot prices', () => {
        const rates = { XAU: 0.000298, XAG: 0.03278 };
        const converted = convertSpotRates(rates);

        expect(converted.XAU).toBeCloseTo(3355.7047, 2);
        expect(converted.XAG).toBeCloseTo(30.5052, 2);
    });

    it('returns NaN for missing rate values', () => {
        const rates = { XAU: undefined, XAG: null };
        const converted = convertSpotRates(rates);

        expect(Number.isNaN(converted.XAU)).toBe(true);
        expect(Number.isNaN(converted.XAG)).toBe(true);
    });
});


describe('isValidStackItem', () => {
    it('returns true for valid stack item', () => {
        const item = { metal: 'Gold', weight: 2.5, price: 5000 };
        expect(isValidStackItem(item)).toBe(true);
    });

    it('returns false for missing metal', () => {
        const item = { metal: '', weight: 2.5, price: 5000 };
        expect(isValidStackItem(item)).toBe(false);
    });

    it('returns false for invalid weight or price', () => {
        expect(isValidStackItem({ metal: 'Silver', weight: 0, price: 20 })).toBe(false);
        expect(isValidStackItem({ metal: 'Silver', weight: 1, price: -20 })).toBe(false);
    });
});