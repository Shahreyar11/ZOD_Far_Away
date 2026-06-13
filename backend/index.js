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

// --- AI ASSISTANT PARSING ENDPOINT ---

const SUPPORTED_COUNTRIES = [
  'United States', 'United Kingdom', 'Germany', 'France', 'Japan',
  'China', 'India', 'UAE', 'Saudi Arabia', 'Australia', 'Canada',
  'Brazil', 'South Korea', 'Singapore', 'Netherlands', 'Italy',
  'Spain', 'Mexico', 'Indonesia', 'South Africa'
];

function fallbackLocalParse(query) {
  const lowercaseQuery = query.toLowerCase();
  
  let destination = null;
  let origin = null;
  
  for (const country of SUPPORTED_COUNTRIES) {
    const countryLower = country.toLowerCase();
    
    const fromIndex = lowercaseQuery.indexOf(`from ${countryLower}`);
    if (fromIndex !== -1) {
      origin = country;
    }
    
    const toIndex = lowercaseQuery.indexOf(`to ${countryLower}`);
    if (toIndex !== -1) {
      destination = country;
    }
    
    if (lowercaseQuery.includes(countryLower)) {
      if (!destination && origin !== country) {
        destination = country;
      } else if (!origin && destination !== country) {
        origin = country;
      }
    }
  }
  
  let weight = null;
  const weightRegex = /(\d+(?:\.\d+)?)\s*(?:kg|kilograms?|kilo?s?)\b/i;
  const match = lowercaseQuery.match(weightRegex);
  if (match) {
    weight = parseFloat(match[1]);
  }
  
  let product = query;
  
  for (const country of SUPPORTED_COUNTRIES) {
    const reg = new RegExp(`\\b${country}\\b`, 'gi');
    product = product.replace(reg, '');
  }
  
  const noisePhrases = [
    /i want to export/gi,
    /i want to import/gi,
    /i want to ship/gi,
    /i want to send/gi,
    /please export/gi,
    /please ship/gi,
    /please send/gi,
    /how to export/gi,
    /exporting/gi,
    /importing/gi,
    /export/gi,
    /import/gi,
    /shipment/gi,
    /shipping/gi,
    /ship/gi,
    /send/gi,
    /\bto\b/gi,
    /\bfrom\b/gi,
    /\bof\b/gi,
    /\ba\b/gi,
    /\ban\b/gi,
    /\bthe\b/gi,
    /\bwith\b/gi,
    /\bweighing\b/gi,
    /\bweight\b/gi,
    /\d+(?:\.\d+)?\s*(?:kg|kilograms?|kilo?s?)\b/gi,
    /\b\d+\b/gi
  ];
  
  for (const phrase of noisePhrases) {
    product = product.replace(phrase, '');
  }
  
  product = product.replace(/\s+/g, ' ').trim();
  
  if (!product) {
    product = query;
    for (const country of SUPPORTED_COUNTRIES) {
      const reg = new RegExp(`\\b${country}\\b`, 'gi');
      product = product.replace(reg, '');
    }
    product = product.trim();
  }

  let quantity = 1;
  const qtyRegex = /(\d+)\s*(?:units|pcs|pieces|items|qty|quantity)\b/i;
  const qtyMatch = lowercaseQuery.match(qtyRegex);
  if (qtyMatch) {
    quantity = parseInt(qtyMatch[1], 10);
  } else {
    // Check for "a [product]" or "an [product]" or "single [product]" which implies 1
    if (/\b(?:a|an|single|one)\b/i.test(lowercaseQuery)) {
      quantity = 1;
    }
  }
  
  return {
    product: product || "goods",
    destination,
    origin,
    weight,
    quantity,
    isFallback: true
  };
}

app.get('/api/assistant/status', (req, res) => {
  res.json({
    geminiAvailable: !!process.env.GEMINI_API_KEY
  });
});

app.post('/api/assistant/parse', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query parameter 'query' is required." });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      console.log("[Assistant] GEMINI_API_KEY is missing. Using local fallback parser.");
      const parsed = fallbackLocalParse(query);
      return res.json(parsed);
    }

    try {
      console.log("[Assistant] Calling Gemini API...");
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Analyze the user's shipping query and extract key logistics details. Match countries to our supported list.
Supported Countries: United States, United Kingdom, Germany, France, Japan, China, India, UAE, Saudi Arabia, Australia, Canada, Brazil, South Korea, Singapore, Netherlands, Italy, Spain, Mexico, Indonesia, South Africa.

User Query: "${query}"`
                  }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: {
                type: "object",
                properties: {
                  product: {
                    type: "string",
                    description: "The primary product/commodity name being shipped, e.g. 'leather wallets', 'laptop', 'ceramic tiles'."
                  },
                  destination: {
                    type: "string",
                    description: "The destination country name, matching exactly one of the supported countries list (Capitalized), or null if not mentioned or not supported."
                  },
                  origin: {
                    type: "string",
                    description: "The origin country name, matching exactly one of the supported countries list (Capitalized), or null if not mentioned or not supported."
                  },
                  weight: {
                    type: "number",
                    description: "The total gross weight of the shipment in kilograms (numeric only), or null if not specified."
                  },
                  quantity: {
                    type: "number",
                    description: "The number of units or quantity of items being shipped. Defaults to 1 if not explicitly mentioned otherwise."
                  }
                },
                required: ["product"]
              }
            }
          })
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API error status ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!textContent) {
        throw new Error("Empty response from Gemini API");
      }

      const parsedResult = JSON.parse(textContent);
      
      if (parsedResult.destination && !SUPPORTED_COUNTRIES.includes(parsedResult.destination)) {
        parsedResult.destination = null;
      }
      if (parsedResult.origin && !SUPPORTED_COUNTRIES.includes(parsedResult.origin)) {
        parsedResult.origin = null;
      }

      res.json({
        product: parsedResult.product || "goods",
        destination: parsedResult.destination || null,
        origin: parsedResult.origin || null,
        weight: parsedResult.weight || null,
        quantity: parsedResult.quantity || 1,
        isFallback: false
      });

    } catch (apiError) {
      console.error("[Assistant] Gemini API call failed, running local fallback parser:", apiError);
      const parsed = fallbackLocalParse(query);
      res.json(parsed);
    }

  } catch (error) {
    console.error("[Assistant] Handler error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

