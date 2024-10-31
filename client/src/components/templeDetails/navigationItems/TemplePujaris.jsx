import EmptyState from "../../EmptyState";

export default function TemplePujaris({ pujaris }) {
    return (
        <section className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            {pujaris && pujaris.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pujaris.map((pujari, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                            <img
                                src={pujari.profile}
                                alt={pujari.name}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <div className="p-4">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {pujari.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                    {pujari.designation} ({pujari.experience} years of experience)
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Specialization: {pujari.specialization}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Contact: {pujari.contactInfo}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState message={'No Pujaris available for this temple!'} />
            )}
        </section>
    );
}
