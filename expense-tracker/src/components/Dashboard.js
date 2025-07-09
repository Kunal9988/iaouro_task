import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [comments, setComments] = useState('');
  const [editId, setEditId] = useState(null); // ID of the row being edited
  const [editData, setEditData] = useState({ category: '', amount: '', comments: '' });

  const token = localStorage.getItem('token');
  const API_BASE = 'http://localhost:5000/api/expenses';

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${API_BASE}/my-expenses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setExpenses(data);
      } else {
        alert(data.message || 'Failed to fetch expenses');
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
      alert('Error fetching data');
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!category.trim() || !amount) return alert('Category and amount required');

    try {
      const response = await fetch(`${API_BASE}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ category, amount: parseFloat(amount), comments }),
      });

      if (response.ok) {
        setCategory('');
        setAmount('');
        setComments('');
        fetchExpenses();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to add expense');
      }
    } catch (err) {
      console.error(err);
      alert('Error adding expense');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      const res = await fetch(`${API_BASE}/delete/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchExpenses();
      else alert('Failed to delete expense');
    } catch (err) {
      console.error(err);
      alert('Error deleting');
    }
  };

  const handleEditClick = (expense) => {
    setEditId(expense.id);
    setEditData({ category: expense.category, amount: expense.amount, comments: expense.comments || '' });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditData({ category: '', amount: '', comments: '' });
  };

  const handleSaveEdit = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/edit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: editData.category,
          amount: parseFloat(editData.amount),
          comments: editData.comments,
        }),
      });

      if (res.ok) {
        setEditId(null);
        fetchExpenses();
      } else {
        const data = await res.json();
        alert(data.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Expense Dashboard</h2>

      {/* Add Expense Form */}
      <form onSubmit={handleAddExpense} className="mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Comments (optional)"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>
          <div className="col-md-1 d-grid">
            <button type="submit" className="btn btn-success">
              Add
            </button>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>
                {editId === expense.id ? (
                  <input
                    type="text"
                    value={editData.category}
                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                    className="form-control"
                  />
                ) : (
                  expense.category
                )}
              </td>
              <td>
                {editId === expense.id ? (
                  <input
                    type="number"
                    value={editData.amount}
                    onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                    className="form-control"
                  />
                ) : (
                  `₹ ${parseFloat(expense.amount).toFixed(2)}`
                )}
              </td>
              <td>
                {editId === expense.id ? (
                  <input
                    type="text"
                    value={editData.comments}
                    onChange={(e) => setEditData({ ...editData, comments: e.target.value })}
                    className="form-control"
                  />
                ) : (
                  expense.comments || '-'
                )}
              </td>
              <td>{new Date(expense.created_at).toLocaleString()}</td>
              <td>
                {editId === expense.id ? (
                  <>
                    <button className="btn btn-success btn-sm me-1" onClick={() => handleSaveEdit(expense.id)}>
                      Save
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-primary btn-sm me-1" onClick={() => handleEditClick(expense)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(expense.id)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
