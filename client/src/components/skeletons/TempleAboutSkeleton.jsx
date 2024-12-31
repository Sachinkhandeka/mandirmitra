export default function TempleAboutSkeleton() {
    return (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
            {/* Skeleton Header */}
            <div className="h-8 w-2/3 bg-gray-300 dark:bg-gray-700 rounded mb-6 animate-pulse"></div>

            {/* Skeleton Description */}
            <div className="space-y-4 mb-8">
                <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-4/5 animate-pulse"></div>
                <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/5 animate-pulse"></div>
            </div>

            {/* Skeleton Images Section */}
            <div>
                <div className="h-6 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array(8)
                        .fill(0)
                        .map((_, index) => (
                            <div
                                key={index}
                                className="h-40 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"
                            ></div>
                        ))}
                </div>
            </div>
        </div>
    );
}
