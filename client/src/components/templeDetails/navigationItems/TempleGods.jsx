
import EmptyState from "../../EmptyState";

export default function TempleGods({ gods }) {
    return (
        <section className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            {gods && gods.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gods.map((god, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                            <img
                                src={god.image}
                                alt={god.name}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <div className="p-4">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {god.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {god.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState message={'No Gods and Goddesses information available for this temple!'} />
            )}
        </section>
    );
}
