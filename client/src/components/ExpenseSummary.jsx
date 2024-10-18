import React from "react";
import { FaMoneyBillWave, FaChartLine, FaTrophy, FaMedal } from "react-icons/fa";
import { Popover } from "flowbite-react";

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

  // Helper to format currency
  const formatCurrency = (amount) =>
    amount.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      style: "currency",
      currency: "INR",
    });

    const PopoverContent = ({ breakdown }) => (
      <div className="w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-sm text-gray-500 dark:text-gray-400 z-50">
        <div className="p-4 space-y-4">
          {Object.entries(breakdown).map(([key, data]) => (
            <div
              key={key}
              className="flex justify-between items-center p-2 border-b last:border-none border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all"
            >
              <div className="flex flex-col">
                <strong className="text-gray-900 dark:text-gray-100 font-medium">{key}</strong>
                <span className="text-xs text-gray-500 dark:text-gray-400">{data.count} expenses</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-gray-800 dark:text-gray-100">{formatCurrency(data.totalAmount)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );    
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
                {formatCurrency(totalAmount)}
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-lg flex items-center">
            <FaChartLine className="text-purple-500 w-6 h-6 mr-4" />
            <div>
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Average Expense</h3>
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                {formatCurrency(averageAmount)}
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-lg flex items-center">
            <FaTrophy className="text-yellow-500 w-6 h-6 mr-4" />
            <div>
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Largest Expense</h3>
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                {formatCurrency(largestExpense)}
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-lg flex items-center">
            <FaMedal className="text-pink-500 w-6 h-6 mr-4" />
            <div>
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Smallest Expense</h3>
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                {formatCurrency(smallestExpense)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2" >
        {/* Category-wise Breakdown with Popover */}
        <Popover content={<PopoverContent breakdown={categoryBreakdown} />} trigger="hover" placement="top">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4 cursor-pointer">Category</h3>
        </Popover>
        {/* Status-wise Breakdown with Popover */}
        <Popover content={<PopoverContent breakdown={statusBreakdown} />} trigger="hover" placement="top">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4 cursor-pointer">Status</h3>
        </Popover>
        {/* Event-wise Breakdown with Popover */}
        <Popover content={<PopoverContent breakdown={eventBreakdown} />} trigger="hover" placement="top">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4 cursor-pointer">Event</h3>
        </Popover>
      </div>
    </div>
  );
}
