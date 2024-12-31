
export default function TempleManagementSkeleton() {
    return (
        <section className="p-1 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                    >
                        <div className="w-full h-40 bg-gray-200 dark:bg-gray-700"></div>
                        <div className="p-4">
                            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-md mb-2"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
                        </div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                ))}
            </div>
        </section>
    );
}
