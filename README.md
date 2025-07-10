🧾 Expense Tracker API
This is a simple backend project built using Node.js and Express.js. It allows users to add, view, edit, and delete expenses.

🛠 Tech Used
Node.js

Express.js

MongoDB (or your DB)

dotenv

📁 How to Run
Install dependencies

nginx
Copy
Edit
npm install
Add .env file

ini
Copy
Edit
PORT=5000
MONGO_URI=your_database_url
Start the server

nginx
Copy
Edit
node server.js
📌 API Endpoints
GET /api/expenses – Get all expenses

POST /api/expenses – Add a new expense

PUT /api/expenses/:id – Update an expense

DELETE /api/expenses/:id – Delete an expense

