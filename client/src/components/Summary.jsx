import { FaDonate, FaMoneyBillWave, FaChartLine, FaTrophy, FaMedal } from "react-icons/fa";

export default function Summary({ donations }) {
  // Calculations
  const totalAmount = donations.reduce((acc, donation) => acc + (donation.donationAmount || 0), 0);
  const averageAmount = totalAmount / donations.length || 0;
  const largestDonation = Math.max(...donations.map(d => d.donationAmount || 0));
  const smallestDonation = Math.min(...donations.map(d => d.donationAmount || Infinity));
  const topDonor = donations.reduce((max, donation) => donation.donationAmount > (max.donationAmount || 0) ? donation : max, {});

  return (
    <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md w-full mx-auto mt-10">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">Donation Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
            {/* Total Donation Amount */}
            <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-lg flex items-center">
                <FaDonate className="text-teal-500 w-6 h-6 mr-4" />
                <div>
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Total Donations</h3>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                        {totalAmount.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                            style: "currency",
                            currency: "INR",
                        })}
                    </p>
                </div>
            </div>
            {/* Average Donation Amount */}
            <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-lg flex items-center">
                <FaMoneyBillWave className="text-blue-500 w-6 h-6 mr-4" />
                <div>
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Average Donation</h3>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                        {averageAmount.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                            style: "currency",
                            currency: "INR",
                        })}
                    </p>
                </div>
            </div>
            {/* Total Number of Donations */}
            <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-lg flex items-center">
                <FaChartLine className="text-purple-500 w-6 h-6 mr-4" />
                <div>
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Total Donations Count</h3>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">{donations.length}</p>
                </div>
            </div>
            {/* Largest Donation */}
            <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-lg flex items-center">
                <FaTrophy className="text-yellow-500 w-6 h-6 mr-4" />
                <div>
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Largest Donation</h3>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                        {largestDonation.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                            style: "currency",
                            currency: "INR",
                        })}
                    </p>
                </div>
            </div>
            {/* Smallest Donation */}
            <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-lg flex items-center">
                <FaMedal className="text-pink-500 w-6 h-6 mr-4" />
                <div>
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Smallest Donation</h3>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                        {smallestDonation.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                            style: "currency",
                            currency: "INR",
                        })}
                    </p>
                </div>
            </div>
            {/* Top Donor */}
            <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-lg flex items-center">
                <FaTrophy className="text-green-500 w-6 h-6 mr-4" />
                <div>
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Top Donor</h3>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">{topDonor.donorName || "N/A"}</p>
                </div>
            </div>
        </div>
    </div>
  );
}
