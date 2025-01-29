import EmptyState from "../../EmptyState";
import { Helmet } from "react-helmet-async";

export default function TempleAbout({ description, images, templeName }) {
    return (
        <div className="mt-4 p-4 min-h-screen">
            {/* Helmet for SEO */}
            <Helmet>
                <title>Explore {templeName}: History, Significance & More | MandirMitra</title>
                <meta
                    name="description"
                    content={`Uncover the rich history, significance, and unique architectural features of ${templeName} on MandirMitra. Learn about its legends, festivals, and find captivating images.`}
                />
                <meta
                    name="keywords"
                    content={`${templeName}, ${templeName} history, ${templeName} significance, ${templeName} architecture, ${templeName} legends, ${templeName} festivals, hindu temples in india, ancient temples india`}
                />
                <meta
                    property="og:title"
                    content={`Explore ${templeName}: History, Significance & More | MandirMitra`}
                />
                <meta
                    property="og:description"
                    content={`Uncover the rich history, significance, and unique architectural features of ${templeName} on MandirMitra. Learn about its legends, festivals, and find captivating images.`}
                />
                <meta
                    property="og:image"
                    content={
                        images?.[0] ||
                        "https://www.mandirmitra.co.in/images/default-temple.jpg"
                    }
                />
                <meta property="og:url" content={window.location.href} />
            </Helmet>
            {description ? (
                <>
                    {/* Temple Description */}
                    <section className="mb-8">
                        <div className="text-lg leading-loose text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{__html: description}}></div>
                    </section>

                    {/* Images Section */}
                    <section className="my-8">
                        {images && images.length > 0 ? (
                            <>
                                <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                                    Related Images
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
                                    {images.map((url, indx) => (
                                        <div
                                            key={indx}
                                            className="relative overflow-hidden group"
                                            style={{
                                                gridRowEnd: `span ${Math.floor(Math.random() * 2) + 2}`, // Dynamic grid row span effect
                                            }}
                                        >
                                            <img
                                                src={url}
                                                alt={`temple_history_image_${indx}`}
                                                className="h-full w-full object-cover rounded-lg transition-transform duration-300 ease-in-out transform group-hover:scale-105 shadow-lg group-hover:shadow-2xl"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <span className="text-white text-lg font-semibold">
                                                    Temple History
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <EmptyState message={"No related images available!"} />
                        )}
                    </section>
                </>
            ) : (
                <EmptyState message={"Description not available yet!"} />
            )}
        </div>
    );
}
