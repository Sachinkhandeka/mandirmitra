export default function TemplePostsSkeleton() {
    // Array to simulate 6 skeleton posts
    const skeletonPosts = Array.from({ length: 6 });

    return (
        <section className="p-1 my-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {skeletonPosts.map((_, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse"
                    >
                        {/* Header Skeleton */}
                        <div className="flex items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                            <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                            <div className="ml-3 w-2/3 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        </div>

                        {/* Image Carousel Skeleton */}
                        <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>

                        {/* Post Details Skeleton */}
                        <div className="p-4">
                            <div className="h-6 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                            <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                            <div className="h-4 w-4/5 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        </div>

                        {/* Footer Skeleton */}
                        <div className="flex justify-between items-center px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-4">
                                <div className="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                                <div className="h-4 w-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            </div>
                            <div className="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
