import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [comments, setComments] = useState('');

  const token = localStorage.getItem('token');

  const API_BASE = 'http://localhost:5000/api/expenses';

  //  all expenses
  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${API_BASE}/my-expenses`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.ok) {
        setExpenses(data);
      } else {
        console.error("❌ Fetch error:", data);
        alert(data.message || 'Failed to fetch expenses');
      }
    } catch (err) {
      console.error("❌ Network error:", err);
      alert('Error fetching data');
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Add a new expense
  const handleAddExpense = async (e) => {
    e.preventDefault();

    if (!category.trim() || !amount) {
      alert("Category and amount are required");
      return;
    }

    const newExpense = {
      category,
      amount: parseFloat(amount),
      comments
    };

    try {
      const response = await fetch(`${API_BASE}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newExpense)
      });

      const data = await response.json();

      if (response.ok) {
        alert(' Expense added!');
        setCategory('');
        setAmount('');
        setComments('');
        fetchExpenses();
      } else {
        console.error(" Add error:", data);
        alert(data.message || 'Failed to add expense');
      }
    } catch (err) {
      console.error(" Network error while adding:", err);
      alert('Error adding expense');
    }
  };

  // Delete expense
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this expense?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE}/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        alert(' Expense deleted!');
        fetchExpenses();
      } else {
        console.error(" Delete error:", data);
        alert(data.message || 'Failed to delete expense');
      }
    } catch (err) {
      console.error(" Network error while deleting:", err);
      alert('Error deleting expense');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4"> Expense Dashboard</h2>

      {/* Add Expense Form */}
      <form onSubmit={handleAddExpense} className="mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              step="0.01"
              className="form-control"
              placeholder="Amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Comments (optional)"
              value={comments}
              onChange={e => setComments(e.target.value)}
            />
          </div>
          <div className="col-md-1 d-grid">
            <button type="submit" className="btn btn-success">Add</button>
          </div>
        </div>
      </form>

      {/* Expenses Table */}
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Category</th>
            <th>Amount</th>
            <th>Comments</th>
            <th>Created At</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(expense => (
            <tr key={expense.id}>
              <td>{expense.category}</td>
              <td>₹ {parseFloat(expense.amount).toFixed(2)}</td>
              <td>{expense.comments || '-'}</td>
              <td>{new Date(expense.created_at).toLocaleString()}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(expense.id)}
                >Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
