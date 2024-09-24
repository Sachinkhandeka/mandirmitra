import React from "react";
import { FaMoneyBillWave, FaChartLine, FaTrophy, FaMedal, FaCalendar, FaUsers } from "react-icons/fa";

export default function ExpenseSummary({ expenses }) {
  // Calculations
  const totalAmount = expenses.reduce((acc, expense) => acc + expense.amount, 0);
  const averageAmount = totalAmount / expenses.length || 0;
  const largestExpense = Math.max(...expenses.map(expense => expense.amount));
  const smallestExpense = Math.min(...expenses.map(expense => expense.amount));
  const mostFrequentCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + 1;
    return acc;
  }, {});
  const topCategory = Object.entries(mostFrequentCategory).reduce((max, curr) => {
    return curr[1] > max[1] ? curr : max;
  }, [null, 0])[0];

  // Top 3 Categories by Expense
  const topCategories = Object.entries(mostFrequentCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md w-full mx-auto mt-10">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">Expense Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Total Expense Amount */}
        <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-lg flex items-center">
          <FaMoneyBillWave className="text-blue-500 w-6 h-6 mr-4" />
          <div>
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Total Expense</h3>
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
              {totalAmount.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
                style: "currency",
                currency: "INR",
              })}
            </p>
          </div>
        </div>
        {/* Average Expense Amount */}
        <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-lg flex items-center">
          <FaChartLine className="text-purple-500 w-6 h-6 mr-4" />
          <div>
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Average Expense</h3>
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
              {averageAmount.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
                style: "currency",
                currency: "INR",
              })}
            </p>
          </div>
        </div>
        {/* Total Number of Expenses */}
        <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-lg flex items-center">
          <FaUsers className="text-red-500 w-6 h-6 mr-4" />
          <div>
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Total Expenses Count</h3>
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">{expenses.length}</p>
          </div>
        </div>
        {/* Largest Expense */}
        <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-lg flex items-center">
          <FaTrophy className="text-yellow-500 w-6 h-6 mr-4" />
          <div>
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Largest Expense</h3>
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
              {largestExpense.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
                style: "currency",
                currency: "INR",
              })}
            </p>
          </div>
        </div>
        {/* Smallest Expense */}
        <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-lg flex items-center">
          <FaMedal className="text-pink-500 w-6 h-6 mr-4" />
          <div>
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Smallest Expense</h3>
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
              {smallestExpense.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
                style: "currency",
                currency: "INR",
              })}
            </p>
          </div>
        </div>
        {/* Most Frequent Category */}
        <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-lg flex items-center">
          <FaCalendar className="text-green-500 w-6 h-6 mr-4" />
          <div>
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Most Frequent Category</h3>
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">{topCategory}</p>
          </div>
        </div>
        {/* Top 3 Categories by Expense */}
        <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-lg flex items-center">
          <FaChartLine className="text-purple-500 w-6 h-6 mr-4" />
          <div>
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Top 3 Categories by Expense</h3>
            <ul className="text-xs font-semibold text-gray-800 dark:text-gray-100">
              {topCategories.map(([category, count]) => (
                <li key={category}>{category}: {count}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}