const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// 5. AGGREGATIONS TO OUTPUT ANALYTICS

// 1. Total Revenue Analytics
router.get('/total-revenue', async (req, res) => {
    try {
        const revenue = await Order.aggregate([
            {
                // Filter only successful orders (Not Cancelled)
                $match: { status: { $ne: 'Cancelled' } }
            },
            {
                // Group all documents to calculate total
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' },
                    averageOrderValue: { $avg: '$totalAmount' },
                    totalOrders: { $sum: 1 }
                }
            },
            {
                // Format output
                $project: {
                    _id: 0,
                    totalRevenue: { $round: ['$totalRevenue', 2] },
                    averageOrderValue: { $round: ['$averageOrderValue', 2] },
                    totalOrders: 1
                }
            }
        ]);
        
        // If no orders match the aggregate returns empty array
        res.status(200).json(revenue.length > 0 ? revenue[0] : { totalRevenue: 0, averageOrderValue: 0, totalOrders: 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Sales by Category
router.get('/sales-by-category', async (req, res) => {
    try {
        const salesByCategory = await Order.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } },
            // Unwind the items array so we can process each item separately
            { $unwind: '$items' },
            // Lookup product details to get the category
            {
                $lookup: {
                    from: 'products', // matches MongoDB collection name (lowercase, plural)
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' },
            // Group by category
            {
                $group: {
                    _id: '$productDetails.category',
                    totalQuantitySold: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
                }
            },
            { $sort: { totalRevenue: -1 } } // Sort by highest revenue
        ]);

        res.status(200).json(salesByCategory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Top Spending Users
router.get('/top-users', async (req, res) => {
    try {
        const topUsers = await Order.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } },
            {
                $group: {
                    _id: '$user',
                    totalSpent: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 5 }, // Top 5
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: '$userDetails' },
            {
                $project: {
                    _id: 0,
                    userId: '$_id',
                    userName: '$userDetails.name',
                    userEmail: '$userDetails.email',
                    totalSpent: { $round: ['$totalSpent', 2] },
                    orderCount: 1
                }
            }
        ]);
        res.status(200).json(topUsers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
