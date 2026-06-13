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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
