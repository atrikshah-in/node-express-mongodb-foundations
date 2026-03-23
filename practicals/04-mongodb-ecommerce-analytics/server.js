const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const crudRoutes = require('./routes/crudRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

dotenv.config();

const app = express();
app.use(express.json());

// 1. MONGODB CONNECTIVITY & 3. REPLICATION CONCEPT
// The connection string is usually stored in .env. 
// For replication, you would connect to a Replica Set via connection string like:
// mongodb://host1:27017,host2:27017,host3:27017/ecommerce?replicaSet=myReplicaSet
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce-practical';

mongoose.connect(MONGO_URI, {
    // These options are now default in newer Mongoose versions, but explicitly stating intent:
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
})
.then(() => console.log('Successfully connected to MongoDB.'))
.catch(err => console.error('MongoDB connection error:', err));

// Register Routes
app.use('/api', crudRoutes);
app.use('/api/analytics', analyticsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
