import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/expenses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setExpenses(data);
      } else {
        alert('Failed to fetch expenses');
      }
    };

    fetchExpenses();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Your Expenses</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.category}</td>
              <td>{expense.amount}</td>
              <td>{new Date(expense.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
