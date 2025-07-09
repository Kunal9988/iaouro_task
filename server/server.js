const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth'); 

dotenv.config(); 

const app = express();


app.use(cors());           
app.use(express.json());    

app.use('/api/auth', authRoutes); 


app.get('/', (req, res) => {
  res.send('🚀 Expense Tracker Backend Running!');
});

//  Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

const expenseRoutes = require('./routes/expenses');
app.use('/api/expenses', expenseRoutes);

