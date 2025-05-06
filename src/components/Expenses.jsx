import React, { useState } from 'react';

const Expenses = () => {
  // Initialize the expenses state with test data
  const [expenses, setExpenses] = useState([
    {
      date: '2024-09-15',
      userId: 'U001',
      category: 'A',
      amount: 500,
      approved: false,
      attachment: null,
    },
    {
      date: '2024-09-25',
      userId: 'U002',
      category: 'B',
      amount: 1000,
      approved: false,
      attachment: null,
    },
    // More test data...
  ]);

  const [date, setDate] = useState('');
  const [userId, setUserId] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [attachment, setAttachment] = useState(null); // State for file attachment
  const [fromDate, setFromDate] = useState(''); // State for From Date
  const [toDate, setToDate] = useState(''); // State for To Date
  const [showData, setShowData] = useState(false); // State to control "Show Data" button

  // Add new expense
  const addExpense = (e) => {
    e.preventDefault();

    const newExpense = {
      date,
      userId,
      category,
      amount,
      approved: false,
      attachment: attachment ? URL.createObjectURL(attachment) : null, // Store the file URL
    };

    setExpenses([...expenses, newExpense]);
    setDate('');
    setUserId('');
    setCategory('');
    setAmount('');
    setAttachment(null); // Reset attachment after submission
  };

  // Approve expense and disable the button
  const approveExpense = (index) => {
    const updatedExpenses = [...expenses];
    updatedExpenses[index].approved = true;
    setExpenses(updatedExpenses);
    alert('approved')
  };

  // Filter expenses between the selected dates
  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : new Date(); // Use current date if To Date is not selected

    return (!from || expenseDate >= from) && (!to || expenseDate <= to);
  });

  return (
    <div className="container mx-auto p-4 mt-8">
      {/* Expense Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-1/3">
        <h2 className="text-lg font-semibold mb-4">Add New Expense</h2>
        <form onSubmit={addExpense} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">User ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
              required
            >
              <option value="">Select a category</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Attachment</label>
            <input
              type="file"
              onChange={(e) => setAttachment(e.target.files[0])}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Add Expense
          </button>
        </form>
      </div>

      {/* Date Filter Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-1/3">
        <h2 className="text-lg font-semibold mb-4">Filter Expenses by Date</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setShowData(true); // Show the "Show Data" button when "From Date" is selected
              }}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
            />
          </div>
          {showData && (
            <button
              onClick={() => setShowData(false)} // Hide the button after showing data
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Show Data
            </button>
          )}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Filtered Expenses</h2>
        {filteredExpenses.length > 0 ? (
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">User ID</th>
                <th className="px-4 py-2 border">Category</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Approved</th>
                <th className="px-4 py-2 border">Attachment</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border">{expense.date}</td>
                  <td className="px-4 py-2 border">{expense.userId}</td>
                  <td className="px-4 py-2 border">{expense.category}</td>
                  <td className="px-4 py-2 border">{expense.amount}</td>
                  <td className="px-4 py-2 border">
                    {expense.approved ? 'Yes' : 'No'}
                  </td>
                  <td className="px-4 py-2 border">
                    {expense.attachment ? (
                      <a
                        href={expense.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        View File
                      </a>
                    ) : (
                      'No File'
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => approveExpense(index)}
                      className={`${
                        expense.approved
                          ? 'bg-gray-500 text-white cursor-not-allowed'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      } px-4 py-2 rounded-lg`}
                      disabled={expense.approved}
                    >
                      {expense.approved ? 'Approved' : 'Approve'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No expenses to display</p>
        )}
      </div>
    </div>
  );
};

export default Expenses;
