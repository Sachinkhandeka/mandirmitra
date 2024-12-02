import { Carousel } from "flowbite-react";
import EmptyState from "../../EmptyState";

export default function TempleFestivals({ festivals }) {
    return (
        <div className="w-full p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            {festivals && festivals.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {festivals.map((fest, indx) => (
                        <div key={indx} className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                    {fest.festivalName}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                                    {fest.festivalImportance}
                                </p>
                                <div className="relative h-64 sm:h-72 lg:h-80 xl:h-96 my-4">
                                    {fest.festivalImages && fest.festivalImages.length > 0 && (
                                        <>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Festival Images
                                            </h3>
                                            <Carousel slide={false} className="rounded-lg overflow-hidden">
                                                {fest.festivalImages.map((url, indx) => (
                                                    <img
                                                        src={url}
                                                        alt={`temple_festival_image_${indx}`}
                                                        key={indx}
                                                        className="w-full h-60 object-fill rounded-lg"
                                                    />
                                                ))}
                                            </Carousel>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState message={'Festivals not available yet for this temple!'} />
            )}
        </div>
    );
}
