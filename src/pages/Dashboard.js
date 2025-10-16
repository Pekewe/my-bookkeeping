// src/pages/Dashboard.js
import React from 'react';
import ExpenseFilter from '../components/ExpenseFilter';
import ExpenseSummary from '../components/ExpenseSummary';
import ExpenseList from '../components/ExpenseList';

const Dashboard = ({ 
  expenses, 
  filters, 
  onFilterChange, 
  onDeleteExpense,
  filteredExpenses 
}) => {
  return (
    <div className="dashboard">
      <ExpenseFilter 
        filters={filters} 
        onFilterChange={onFilterChange} 
      />
      <ExpenseSummary expenses={filteredExpenses} />
      <ExpenseList 
        expenses={filteredExpenses} 
        onDeleteExpense={onDeleteExpense} 
      />
    </div>
  );
};

export default Dashboard;