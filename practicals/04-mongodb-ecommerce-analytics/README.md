# MongoDB eCommerce Analytics Practical

This project serves as a practical implementation of fundamental MongoDB concepts using Node.js and Mongoose. It covers the following key learning objectives in a simulated eCommerce environment.

## 1. MongoDB Connectivity through Node Code

In `server.js`, we establish a connection using the `mongoose` library, which provides a straightforward Object Data Modeling (ODM) environment.
- **Concept:** We use `mongoose.connect()` pointing to our local or remote MongoDB instance and catch connection errors using `.catch()`.

## 2. Setup of Database for eCommerce Business

In the `models` directory, three schemas model an eCommerce domain:
- **`User.js`**: Stores customer names, emails, and signup dates.
- **`Product.js`**: Contains items for sale including name, price, category, and available stock.
- **`Order.js`**: Tracks user purchases. It references the `User` schema and embeds an array of ordered products using references to `Product` ids and current prices.

## 3. Replication of MongoDB

**What is it?**
MongoDB replication is the process of synchronizing data across multiple servers. A Replica Set in MongoDB ensures high availability, redundancy, and fault tolerance against localized server crashes.

**Replication in Node Code:**
- **Connection String:** A replica set connection URL specifies multiple hosts:  
  `mongodb://host1:27017,host2:27017,host3:27017/ecommerce?replicaSet=rs0`
- **Transactions:** In `routes/crudRoutes.js`, there's a reference to how transactions run. Multi-document ACID transactions *require* a replica set to function in MongoDB. When placing an order, typically a session is started to deduct product stock and create an order atomically. If a failure occurs, the session aborts, rolling back any partial changes.

## 4. CRUD Operations

Implemented inside `routes/crudRoutes.js`, you can perform basic operations through REST API endpoints:
- **Create**: Setup standard POST endpoints `POST /api/products` and `POST /api/users` allowing inserting documents.
- **Read**: Fetch endpoints `GET /api/products` and single fetches `GET /api/products/:id`. By using `populate()`, linked documents (like User referencing within Order) are expanded automatically.
- **Update**: `PUT /api/products/:id` uses `$set` semantics under the hood with Mongoose's `findByIdAndUpdate()`.
- **Delete**: `DELETE /api/products/:id`.

## 5. Aggregations to Output Analytics

Aggregations allow processing data records and returning computed results. In `routes/analyticsRoutes.js`, several pipelines demonstrate powerful analytics:
- **`GET /api/analytics/total-revenue`**: Employs `$match` to exclude cancelled orders, and `$group` to sum the total sales volume across the application, outputting `totalRevenue` and `averageOrderValue`.
- **`GET /api/analytics/sales-by-category`**: Uses `$unwind` to break down order items, looks up the product schema to infer category via `$lookup`, then `$group`s by category and `$sort`s the resultant array to find the best performing store sector.
- **`GET /api/analytics/top-users`**: Aggregates the highest-spending users and joins (`$lookup`) the User collection to present human-readable profiles of top application whales.

---

### How to Run

1. Make sure MongoDB is running locally (or modify the MONGO_URI in `server.js`).
2. Run `npm install` inside this practical folder.
3. Start the server using `npm run dev` or `npm start`.
4. Test endpoints using Postman or cURL.

