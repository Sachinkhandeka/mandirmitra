import EmptyState from "../../EmptyState";

export default function TemplePhotos({ photos }) {
    return (
        <section className="p-2 bg-gray-100 dark:bg-gray-900 min-h-screen">
            {photos && photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
                    {photos.map((photo, index) => (
                        <div 
                            key={index} 
                            className="relative overflow-hidden group"
                            style={{ gridRowEnd: `span ${Math.floor(Math.random() * 2) + 2}` }}  // Create dynamic grid row span effect
                        >
                            <img
                                className="h-full w-full object-cover rounded-lg transition-transform duration-300 ease-in-out transform group-hover:scale-105 shadow-lg group-hover:shadow-2xl"
                                src={photo}
                                alt={`temple_photo_${index}`}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-white text-lg font-bold">Temple View</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState message={'Photos not available yet for this temple!'} />
            )}
        </section>
    );
}
