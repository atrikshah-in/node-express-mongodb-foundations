const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const dotenv = require('dotenv');

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce-practical';

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
        console.log('Cleared existing data.');

        // 1. Create Users
        const users = await User.insertMany([
            { name: 'Alice Smith', email: 'alice@example.com' },
            { name: 'Bob Johnson', email: 'bob@example.com' },
            { name: 'Charlie Brown', email: 'charlie@example.com' }
        ]);
        console.log(`Inserted ${users.length} users.`);

        // 2. Create Products
        const products = await Product.insertMany([
            { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse', price: 25.99, category: 'Electronics', stock: 150 },
            { name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard', price: 89.99, category: 'Electronics', stock: 50 },
            { name: 'Atomic Habits', description: 'Self-help book', price: 15.00, category: 'Books', stock: 200 },
            { name: 'Coffee Mug', description: 'Ceramic coffee mug', price: 12.50, category: 'Home', stock: 100 },
            { name: 'Laptop Stand', description: 'Adjustable aluminum laptop stand', price: 34.99, category: 'Electronics', stock: 75 }
        ]);
        console.log(`Inserted ${products.length} products.`);

        // 3. Create Orders
        const orders = await Order.insertMany([
            {
                user: users[0]._id, // Alice
                items: [
                    { product: products[0]._id, quantity: 2, price: products[0].price }, // 2x Mouse
                    { product: products[1]._id, quantity: 1, price: products[1].price }  // 1x Keyboard
                ],
                totalAmount: (2 * products[0].price) + (1 * products[1].price),
                status: 'Delivered'
            },
            {
                user: users[1]._id, // Bob
                items: [
                    { product: products[2]._id, quantity: 1, price: products[2].price }  // 1x Book
                ],
                totalAmount: (1 * products[2].price),
                status: 'Processing'
            },
            {
                user: users[0]._id, // Alice again
                items: [
                    { product: products[3]._id, quantity: 4, price: products[3].price }  // 4x Mug
                ],
                totalAmount: (4 * products[3].price),
                status: 'Shipped'
            },
            {
                user: users[2]._id, // Charlie
                items: [
                    { product: products[4]._id, quantity: 1, price: products[4].price }, // 1x Laptop Stand
                    { product: products[0]._id, quantity: 1, price: products[0].price }  // 1x Mouse
                ],
                totalAmount: (1 * products[4].price) + (1 * products[0].price),
                status: 'Pending'
            }
        ]);
        console.log(`Inserted ${orders.length} orders.`);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDatabase();
