
export default function TempleFestivalsSkeleton() {
    return (
        <div className="w-full p-1 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array(6)
                    .fill(0)
                    .map((_, index) => (
                        <div
                            key={index}
                            className="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse"
                        >
                            {/* Skeleton Header */}
                            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mx-6 my-3"></div>

                            {/* Skeleton Image Carousel */}
                            <div className="h-56 bg-gray-300 dark:bg-gray-700"></div>

                            {/* Skeleton Description */}
                            <div className="px-6 py-4">
                                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                            </div>

                            {/* Skeleton Actions */}
                            <div className="flex justify-between items-center px-4 py-3 bg-gray-100 dark:bg-gray-700">
                                <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                                <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
