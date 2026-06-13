require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is missing in .env file");
  // We don't exit in development, but you should add it!
} else {
  mongoose.connect(MONGODB_URI).then(() => {
    console.log("Connected to MongoDB.");
  }).catch(err => {
    console.error("Failed to connect to MongoDB", err);
  });
}

let embedder;

async function loadEmbedder() {
  const { pipeline } = await import('@xenova/transformers');
  embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
    quantized: true,
  });
  console.log("AI Embedder ready.");
}

// Start loading embedder in background
loadEmbedder().catch(console.error);

app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: "Query parameter 'q' is required." });
    }

    if (!embedder) {
      return res.status(503).json({ error: "AI Model is still loading, please try again in a few seconds." });
    }

    // Embed the search query
    const output = await embedder(q, { pooling: 'mean', normalize: true });
    const queryEmbedding = Array.from(output.data);

    // Perform Vector Search on MongoDB Atlas
    // Note: You must create an Atlas Vector Search index named "vector_index" on the "hscodes" collection
    const results = await mongoose.connection.collection('hscodes').aggregate([
      {
        "$vectorSearch": {
          "index": "vector_index",
          "path": "embedding",
          "queryVector": queryEmbedding,
          "numCandidates": 100,
          "limit": 10
        }
      },
      {
        "$project": {
          "_id": 0,
          "hsn4Digit": 1,
          "hsn8Digit": 1,
          "productName": 1,
          "gstRate": 1,
          "score": { "$meta": "vectorSearchScore" }
        }
      }
    ]).toArray();

    // If vector search is not set up, or the user hasn't created the index yet,
    // this will silently return an empty array instead of throwing an error in some MongoDB versions.
    if (results.length === 0) {
      throw new Error("Vector search returned 0 results, index might be missing or building.");
    }

    res.json({ results });
  } catch (error) {
    console.error("Vector search failed:", error);
    
    // Fallback to basic text search if Vector Search isn't configured yet
    try {
        const { q } = req.query;
        const HSCode = require('./models/HSCode');
        
        // Split the query into words for better fallback matching
        const words = q.split(' ').filter(w => w.length > 2);
        const searchRegexes = words.length > 0 ? words.map(w => new RegExp(w, 'i')) : [new RegExp(q, 'i')];
        
        const fallbackResults = await HSCode.find({
            productName: { $in: searchRegexes }
        }).limit(10).lean();
        
        // Remove embeddings from response to keep it light
        const cleanedResults = fallbackResults.map(r => {
            delete r.embedding;
            delete r._id;
            delete r.__v;
            delete r.createdAt;
            delete r.updatedAt;
            return r;
        });
        
        return res.json({ results: cleanedResults, fallback: true });
    } catch(err) {
        res.status(500).json({ error: "Internal server error." });
    }
  }
});

// --- TRADE INTELLIGENCE PLATFORM ENDPOINTS ---

const { CountryTax, ComplianceRule, DocumentRule } = require('./models/TradeIntelligence');
const { calculateFreightCost } = require('./services/freightEngine');
const { startFuelIntelligenceCron } = require('./services/fuelIntelligence');

// Start the background cron job for fuel prices
startFuelIntelligenceCron();

// Get Product Details + Trade Intelligence based on Destination
app.get('/api/product/:hsCode/intelligence', async (req, res) => {
  try {
    const { hsCode } = req.params;
    const { destination, weight = 100 } = req.query; // Default 100kg if not provided

    // 1. Get Product Details from HSCode Collection
    const HSCode = require('./models/HSCode');
    const product = await HSCode.findOne({ hsn8Digit: hsCode }).lean();
    
    if (!product) {
      return res.status(404).json({ error: "Product HS Code not found" });
    }

    // Ensure we don't send massive embeddings to the frontend
    delete product.embedding;

    // If no destination is selected yet, just return the product info
    if (!destination) {
      return res.json({ product });
    }

    // 2. Fetch Compliance Rules & Taxes for Destination
    // For demo purposes, if they don't exist in DB, we'll generate deterministic mock ones
    let countryTax = await CountryTax.findOne({ hsnCode: hsCode, destinationCountry: destination }).lean();
    let compRule = await ComplianceRule.findOne({ hsnCode: hsCode, destinationCountry: destination }).lean();
    let docRule = await DocumentRule.findOne({ hsnCode: hsCode, destinationCountry: destination }).lean();

    // --- Dynamic Mock Rule Generator (for demonstration) ---
    if (!countryTax) {
      // Deterministic generation based on character code
      const hash = hsCode.charCodeAt(0) + destination.charCodeAt(0);
      
      countryTax = {
        importDuty: (hash % 15) + 5, // 5% to 20%
        vatGst: destination === 'India' ? 18 : (destination === 'UAE' ? 5 : 20)
      };
      
      compRule = {
        isDangerousGood: hash % 10 === 0, // 10% chance
        restrictions: hash % 3 === 0 ? ['Import License Required'] : [],
        dgWarnings: hash % 10 === 0 ? ['Class 9 Miscellaneous Dangerous Goods'] : []
      };
      
      docRule = {
        requiredDocuments: ['Commercial Invoice', 'Packing List', 'Bill of Lading', 'Certificate of Origin']
      };
      if (hash % 2 === 0) docRule.requiredDocuments.push('Phytosanitary Certificate');
    }
    // -------------------------------------------------------

    // 3. Calculate Freight Cost
    const origin = 'United States'; // Hardcoded for demo
    const freightCost = await calculateFreightCost({
      origin,
      destination,
      weightKg: parseFloat(weight)
    });

    // 4. Send combined Trade Intelligence Payload
    res.json({
      product,
      taxes: countryTax,
      compliance: compRule,
      documents: docRule,
      freight: freightCost
    });

  } catch (error) {
    console.error("Intelligence endpoint error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
