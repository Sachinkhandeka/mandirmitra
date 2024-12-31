
export default function TemplePujarisSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, index) => (
                <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden animate-pulse"
                >
                    {/* Profile Image */}
                    <div className="w-full h-60 bg-gray-200 dark:bg-gray-700"></div>
                    
                    <div className="p-4 space-y-4">
                        {/* Name */}
                        <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>

                        {/* Designation & Experience */}
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                        
                        {/* Specialization */}
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                        
                        {/* Contact Info */}
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                    </div>

                    <div className="flex justify-between items-center px-4 py-2 mt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
