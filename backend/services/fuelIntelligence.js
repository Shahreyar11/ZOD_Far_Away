const { FuelRate } = require('../models/TradeIntelligence');

// In a real application, this would fetch from Fixer.io, OpenExchangeRates, and a commodity API
async function fetchAndStoreFuelRates() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Mock API Fetching
    const mockFuelIndex = 1.05 + (Math.random() * 0.05); // Between 1.05 and 1.10
    const mockExchangeRates = {
      'USD': 1.0,
      'EUR': 0.92,
      'INR': 83.5,
      'AED': 3.67,
    };

    await FuelRate.findOneAndUpdate(
      { date: today },
      { 
        fuelIndex: mockFuelIndex,
        exchangeRates: mockExchangeRates
      },
      { upsert: true, new: true }
    );
    console.log(`[FuelIntelligence] Updated fuel rates for ${today.toISOString().split('T')[0]}`);
  } catch (error) {
    console.error('[FuelIntelligence] Error updating fuel rates:', error);
  }
}

function startFuelIntelligenceCron() {
  // Run once immediately
  fetchAndStoreFuelRates();
  // Run every 12 hours
  setInterval(fetchAndStoreFuelRates, 12 * 60 * 60 * 1000);
}

module.exports = {
  startFuelIntelligenceCron,
  fetchAndStoreFuelRates
};
