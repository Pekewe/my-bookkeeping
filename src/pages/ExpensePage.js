// src/pages/ExpensePage.js
import React from 'react';
import ExpenseForm from '../components/ExpenseForm';

const ExpensePage = ({ onAddExpense }) => {
  return (
    <div className="expense-page">
      <ExpenseForm onAddExpense={onAddExpense} />
    </div>
  );
};

export default ExpensePage;