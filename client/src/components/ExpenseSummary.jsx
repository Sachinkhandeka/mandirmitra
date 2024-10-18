import React from "react";
import { FaMoneyBillWave, FaChartLine, FaTrophy, FaMedal, FaCalendar, FaUsers } from "react-icons/fa";

export default function ExpenseSummary({ expenses }) {
  // Calculations
  const totalAmount = expenses.reduce((acc, expense) => acc + expense.amount, 0);
  const averageAmount = totalAmount / expenses.length || 0;
  const largestExpense = Math.max(...expenses.map(expense => expense.amount));
  const smallestExpense = Math.min(...expenses.map(expense => expense.amount));

  // Category-wise breakdown
  const categoryBreakdown = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) acc[expense.category] = { count: 0, totalAmount: 0 };
    acc[expense.category].count += 1;
    acc[expense.category].totalAmount += expense.amount;
    return acc;
  }, {});

  // Status-wise breakdown
  const statusBreakdown = expenses.reduce((acc, expense) => {
    if (!acc[expense.status]) acc[expense.status] = { count: 0, totalAmount: 0 };
    acc[expense.status].count += 1;
    acc[expense.status].totalAmount += expense.amount;
    return acc;
  }, {});

  // Event-wise breakdown
  const eventBreakdown = expenses.reduce((acc, expense) => {
    if (expense.event && expense.event.name) {
      if (!acc[expense.event.name]) acc[expense.event.name] = { count: 0, totalAmount: 0 };
      acc[expense.event.name].count += 1;
      acc[expense.event.name].totalAmount += expense.amount;
    }
    return acc;
  }, {});

  const mostFrequentCategory = Object.entries(categoryBreakdown).reduce((max, curr) => {
    return curr[1].count > max[1].count ? curr : max;
  }, [null, { count: 0 }])[0];

  // Top 3 Categories by Expense Count
  const topCategories = Object.entries(categoryBreakdown)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 3);

  return (
    <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md w-full mx-auto mt-10 space-y-8">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">Expense Summary</h2>

      {/* General Summary */}
      <div>
        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">General Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
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
        </div>
      </div>

      {/* Category-wise Breakdown */}
      <div>
        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">Category-wise Breakdown</h3>
        <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-lg">
          <ul className="text-sm font-semibold text-gray-800 dark:text-gray-100 space-y-2">
            {Object.entries(categoryBreakdown).map(([category, data]) => (
              <li key={category}>
                {category}: {data.count} expenses, {data.totalAmount.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                  style: "currency",
                  currency: "INR",
                })}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Status-wise Breakdown */}
      <div>
        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">Status-wise Breakdown</h3>
        <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-lg">
          <ul className="text-sm font-semibold text-gray-800 dark:text-gray-100 space-y-2">
            {Object.entries(statusBreakdown).map(([status, data]) => (
              <li key={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}: {data.count} expenses, {data.totalAmount.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                  style: "currency",
                  currency: "INR",
                })}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Event-wise Breakdown */}
      <div>
        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">Event-wise Breakdown</h3>
        <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-lg">
          <ul className="text-sm font-semibold text-gray-800 dark:text-gray-100 space-y-2">
            {Object.entries(eventBreakdown).map(([eventName, data]) => (
              <li key={eventName}>
                {eventName}: {data.count} expenses, {data.totalAmount.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                  style: "currency",
                  currency: "INR",
                })}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
