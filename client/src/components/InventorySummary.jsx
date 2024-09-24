import React from "react";
import { FaBoxes, FaChartLine, FaTrophy, FaMedal, FaClipboardList, FaCubes, FaExclamationTriangle } from "react-icons/fa";

export default function InventorySummary({ inventories }) {
  // Calculations
  const totalItems = inventories.length;
  const totalStockQuantity = inventories.reduce((acc, item) => acc + item.quantity, 0);
  const lowStockCount = inventories.filter(item => item.quantity < 10).length;  // Assuming 10 as the low-stock threshold
  const totalInventoryValue = inventories.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0).toFixed(2);

  // Most and least stocked items
  const mostStockedItem = inventories.reduce((max, item) => (item.quantity > max.quantity ? item : max), inventories[0] || {});
  const leastStockedItem = inventories.reduce((min, item) => (item.quantity > 0 && item.quantity < min.quantity ? item : min), inventories[0] || {});

  // Most frequent categories by stock count
  const categoryCount = inventories.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.quantity;
    return acc;
  }, {});
  const topCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md w-full mx-auto mt-10">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">Inventory Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Total Unique Items */}
            <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-lg flex items-center">
                <FaBoxes className="text-blue-500 w-6 h-6 mr-4" />
                <div>
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Total Unique Items</h3>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">{totalItems}</p>
                </div>
            </div>
            {/* Total Stock Quantity */}
            <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-lg flex items-center">
                <FaChartLine className="text-purple-500 w-6 h-6 mr-4" />
                <div>
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Total Stock Quantity</h3>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">{totalStockQuantity}</p>
                </div>
            </div>
            {/* Low Stock Count */}
            <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-lg flex items-center">
                <FaExclamationTriangle className="text-red-500 w-6 h-6 mr-4" />
                <div>
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Low Stock Items (Below 10)</h3>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">{lowStockCount}</p>
                </div>
            </div>
            {/* Total Inventory Value */}
            <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-lg flex items-center">
                <FaCubes className="text-green-500 w-6 h-6 mr-4" />
                <div>
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Total Inventory Value</h3>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">₹{totalInventoryValue}</p>
                </div>
            </div>
            {/* Most Stocked Item */}
            <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-lg flex items-center">
                <FaTrophy className="text-yellow-500 w-6 h-6 mr-4" />
                <div>
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Most Stocked Item</h3>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">{mostStockedItem.name || "N/A"} ({mostStockedItem.quantity || 0} units)</p>
                </div>
            </div>
            {/* Least Stocked Item */}
            <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-lg flex items-center">
                <FaMedal className="text-pink-500 w-6 h-6 mr-4" />
                <div>
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Least Stocked Item</h3>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">{leastStockedItem.name || "N/A"} ({leastStockedItem.quantity || 0} units)</p>
                </div>
            </div>
            {/* Top 3 Categories by Stock */}
            <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-lg flex items-center">
                <FaClipboardList className="text-purple-500 w-6 h-6 mr-4" />
                <div>
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Top 3 Categories by Stock</h3>
                    <ul className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                        {topCategories.map(([category, count]) => (
                            <li key={category}>{category}: {count} units</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </div>
);}