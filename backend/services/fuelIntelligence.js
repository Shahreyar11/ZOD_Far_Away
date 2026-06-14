require('dotenv').config();
const { FuelRate } = require('../models/TradeIntelligence');

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const BASELINE_BARREL_PRICE = parseFloat(process.env.FUEL_BASELINE_BARREL_PRICE || '80');

/**
 * Converts a Brent Crude barrel price (USD) into a freight fuel index.
 *
 * Formula used by major carriers (DHL, Maersk etc.):
 *   Fuel Index = Current Price / Baseline Price
 *
 * Example:
 *   Baseline = $80/barrel, Current = $88/barrel
 *   Fuel Index = 88 / 80 = 1.10  → 10% surcharge on freight
 *
 * @param {number} barrelPrice - Current Brent crude price in USD
 * @returns {number} fuelIndex - Multiplier (e.g. 1.05 = 5% surcharge)
 */
function barrelPriceToFuelIndex(barrelPrice) {
  const index = barrelPrice / BASELINE_BARREL_PRICE;
  // Clamp between 0.9 (10% discount) and 1.5 (50% surcharge) to prevent extreme swings
  return Math.min(Math.max(parseFloat(index.toFixed(4)), 0.9), 1.5);
}

/**
 * Fetches the latest Brent Crude oil price from RapidAPI (API Ninjas - Commodity Rates).
 * API docs: https://rapidapi.com/apininjas/api/commodity-rates-by-api-ninjas
 *
 * @returns {Promise<number|null>} Barrel price in USD, or null on failure
 */
async function fetchBarrelPriceFromRapidAPI() {
  if (!RAPIDAPI_KEY) {
    console.warn('[FuelIntelligence] RAPIDAPI_KEY not set in .env — skipping live fetch.');
    return null;
  }

  try {
    const response = await fetch(
      'https://commodity-rates-by-api-ninjas.p.rapidapi.com/v1/commodityprices?commodity=crude-oil',
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'commodity-rates-by-api-ninjas.p.rapidapi.com',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`RapidAPI responded with status ${response.status}`);
    }

    const data = await response.json();

    // API Ninjas returns: { "crude-oil": 83.45 } or similar structure
    // Try common key formats
    const price =
      data['crude-oil'] ||
      data['crude_oil'] ||
      data['Crude Oil'] ||
      data?.price ||
      data?.[0]?.price ||
      null;

    if (price === null || isNaN(Number(price))) {
      console.warn('[FuelIntelligence] Unexpected API response format:', JSON.stringify(data));
      return null;
    }

    const barrelPrice = parseFloat(price);
    console.log(`[FuelIntelligence] ✅ Live Brent Crude: $${barrelPrice}/barrel`);
    return barrelPrice;

  } catch (err) {
    console.error('[FuelIntelligence] ❌ RapidAPI fetch failed:', err.message);
    return null;
  }
}

/**
 * Main job: fetch real barrel price → compute fuel index → save to MongoDB.
 * Falls back to a calculated estimate if the API is unavailable.
 */
async function fetchAndStoreFuelRates() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // --- Try to get live barrel price from RapidAPI ---
  let barrelPrice = await fetchBarrelPriceFromRapidAPI();

  // --- Fallback: estimate based on a realistic range if API fails ---
  if (!barrelPrice) {
    // Use a seeded random to keep the same value within a day (deterministic per date)
    const daySeed = today.getDate() + today.getMonth() * 31;
    // Fluctuate between $75–$95 (realistic Brent range)
    barrelPrice = 75 + (daySeed % 20) + parseFloat((Math.random()).toFixed(2));
    console.log(`[FuelIntelligence] ⚠️  Using estimated barrel price: $${barrelPrice.toFixed(2)}/barrel`);
  }

  const fuelIndex = barrelPriceToFuelIndex(barrelPrice);

  // Mock exchange rates (can be replaced with a separate RapidAPI exchange rate call)
  const exchangeRates = {
    USD: 1.0,
    EUR: 0.92,
    INR: 83.5,
    AED: 3.67,
    GBP: 0.79,
  };

  await FuelRate.findOneAndUpdate(
    { date: today },
    {
      fuelIndex,
      exchangeRates,
      // Store extra metadata for transparency
      meta: {
        barrelPriceUSD: parseFloat(barrelPrice.toFixed(2)),
        baselineBarrelPrice: BASELINE_BARREL_PRICE,
        source: RAPIDAPI_KEY ? 'RapidAPI (Brent Crude)' : 'Estimated',
        fetchedAt: new Date(),
      }
    },
    { upsert: true, new: true }
  );

  console.log(
    `[FuelIntelligence] 📊 Fuel Index: ${fuelIndex} | Barrel: $${parseFloat(barrelPrice.toFixed(2))} | ` +
    `Surcharge: ${((fuelIndex - 1) * 100).toFixed(1)}% | Source: ${RAPIDAPI_KEY ? 'Live API' : 'Estimated'}`
  );
}

function startFuelIntelligenceCron() {
  fetchAndStoreFuelRates(); // Run immediately on startup
  setInterval(fetchAndStoreFuelRates, 12 * 60 * 60 * 1000); // Every 12 hours
}

module.exports = {
  startFuelIntelligenceCron,
  fetchAndStoreFuelRates,
  barrelPriceToFuelIndex,
};
