
export default function TemplePhotosSkeleton() {
    return (
        <section className="p-2 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div
                        key={index}
                        className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md h-40 md:h-60"
                    ></div>
                ))}
            </div>
        </section>
    );
}
