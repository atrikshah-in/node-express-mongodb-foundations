# backend node practicals

## 1. file streaming
code using `fs.createReadStream` vs `fs.readFile` to show memory differences when serving large files.
- generate dummy file: `node 01-file-streaming-server/generate-file.js`
- run server: `node 01-file-streaming-server/server.js` (visit http://localhost:3000)

## 2. cluster app
using the native `cluster` module to fork processes across cpu cores for heavy tasks.
- start: `node 02-multi-core-cluster/server.js`
- test blocking: hit http://localhost:3001/heavy in a few tabs

## 3. mini framework
a tiny express-like router built from scratch with http server, routes, and middleware.
- run: `node 03-mini-backend-framework/app.js`
- test: http://localhost:3002 or POST to /data

## 4. mongodb ecommerce analytics
a practical ecommerce backend with mongoose covering schemas, crud operations, and complex aggregations.
- run: `cd 04-mongodb-ecommerce-analytics && npm run dev`
- endpoints: `/api/products`, `/api/orders`, `/api/analytics/total-revenue`, etc.
