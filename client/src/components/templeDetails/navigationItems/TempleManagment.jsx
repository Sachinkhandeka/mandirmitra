import EmptyState from "../../EmptyState";

export default function TempleManagement({ management }) {
    return (
        <section className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            {management && management.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {management.map((member, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                            <img
                                src={member.profile}
                                alt={member.name}
                                className="w-full h-60 object-fill rounded-t-lg"
                            />
                            <div className="p-4">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {member.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {member.role}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState message={'No Management details available for this temple!'} />
            )}
        </section>
    );
}
