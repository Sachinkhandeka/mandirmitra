
export default function TempleCardSkeleton () {
    return (
        <div className="max-w-sm w-full mx-auto md:mx-3 h-96 overflow-hidden animate-pulse">
            {/* Thumbnail Skeleton */}
            <div className="relative w-full h-44 bg-gray-300 dark:bg-gray-700 rounded-md"></div>

            {/* Temple Information Skeleton */}
            <div className="flex p-4">
                {/* Profile Picture Skeleton */}
                <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 flex-shrink-0"></div>

                {/* Temple Info Skeleton */}
                <div className="ml-3 flex-1">
                    {/* Temple Name Skeleton */}
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>

                    {/* Location and Founded Year Skeleton */}
                    <div className="flex items-center space-x-2 text-gray-300 dark:text-gray-700">
                        <div className="h-3 w-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        <div className="h-3 w-1/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        <div className="h-3 w-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        <div className="h-3 w-1/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </div>

                    {/* Description Skeleton */}
                    <div className="space-y-2 mt-3">
                        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}