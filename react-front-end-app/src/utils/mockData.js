export const mockUsers = [
  {
    id: 1,
    email: "demo@trackmystack.com",
    passwordHash: "demo123" 
  }
];

export const mockStacks = [
  {
    id: 1,
    userId: 1,
    metal: "GOLD",
    weightOtz: 10.5,
    quantity: 2,
    pricePaidPerUnitUsd: 2200,
    notes: "Stacking since 2022"
  },
  {
    id: 2,
    userId: 1,
    metal: "SILVER",
    weightOtz: 100,
    quantity: 10,
    pricePaidPerUnitUsd: 27,
    notes: "Local dealer"
  }
];

export const mockActivities = [
  {
    id: 1,
    userId: 1,
    type: "BUY",
    metal: "GOLD",
    quantityOtz: 2,
    unitPriceUsd: 4050,
    feesUsd: 20,
    executedAt: "2025-10-25T15:00:00Z"
  },
  {
    id: 2,
    userId: 1,
    type: "SELL",
    metal: "SILVER",
    quantityOtz: 50,
    unitPriceUsd: 30,
    feesUsd: 15,
    executedAt: "2025-10-26T11:30:00Z"
  }
];