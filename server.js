const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'https://playful-dolphin-cf64a0.netlify.app', // Your React app URL
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Route to generate token
app.get('/api/token', async (req, res) => {
  try {
    const orgId = process.env.ORG_ID;
    const privateKey = process.env.PRIVATE_API_KEY;
    const assistantId = process.env.ASSISTANT_ID;

    if (!orgId || !privateKey || !assistantId) {
      return res.status(500).json({
        error: 'Missing required environment variables'
      });
    }

    // Create JWT payload
    const payload = {
      orgId: orgId,
      token: {
        tag: "public",
        restrictions: {
          enabled: true,
          allowedOrigins: ["https://playful-dolphin-cf64a0.netlify.app"],
          allowedAssistantIds: [assistantId]
        }
      }
    };

    // Generate token
    const token = jwt.sign(payload, privateKey, { expiresIn: '1h' });
    res.json({ token });

  } catch (error) {
    console.error('Token generation error:', error);
    res.status(500).json({
      error: 'Error generating token',
      details: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error',
    details: err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
