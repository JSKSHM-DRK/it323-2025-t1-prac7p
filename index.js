const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
const mongoURI = process.env.DB_URL || 'mongodb://saksham:admin1234@mongo-service:27017';
const client = new MongoClient(mongoURI);

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db('testdb'); // You can name this anything
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
  }
}

connectDB();

// Basic Test Route
app.get('/', (req, res) => {
  res.send("Hello from Saksham's Node.js app!");
});

// --- CRUD Routes ---

// Create user
app.post('/user', async (req, res) => {
  try {
    const result = await db.collection('users').insertOne(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to insert user', details: err.message });
  }
});

// Read all users
app.get('/users', async (req, res) => {
  try {
    const users = await db.collection('users').find().toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users', details: err.message });
  }
});

// Update user by name (example)
app.put('/user/:name', async (req, res) => {
  try {
    const result = await db.collection('users').updateOne(
      { name: req.params.name },
      { $set: req.body }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user', details: err.message });
  }
});

// Delete user by name
app.delete('/user/:name', async (req, res) => {
  try {
    const result = await db.collection('users').deleteOne({ name: req.params.name });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user', details: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
