
export default function TempleGodSkeleton() {
    return (
        <section className="p-1 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4"
                    >
                        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
                        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-md mb-2"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-md mb-4"></div>
                        <div className="flex justify-between items-center">
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-md w-20"></div>
                            <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
