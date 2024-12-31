
export default function TempleVideosSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, index) => (
                <div
                    key={index}
                    className="relative overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-800 animate-pulse"
                >
                    {/* Video Thumbnail */}
                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
                    
                    <div className="p-4">
                        {/* Title */}
                        <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded mb-4 w-3/4"></div>
                        
                        {/* Description */}
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center px-4 py-2 mt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
