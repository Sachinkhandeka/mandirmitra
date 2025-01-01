import { useState } from "react";
import EmptyState from "../../EmptyState";
import Alert from "../../Alert";
import EntityLikeButton from "../EntityLikeButton";
import { Helmet } from "react-helmet-async";

export default function TemplePujaris({ pujaris, templeId, templeName }) {
    const [ alert, setAlert ] = useState({ type : "", message : "" });
    return (
        <section className="p-1 min-h-screen">
            <Helmet>
                <title>{`${templeName} - Temple Pujaris | MandirMitra`}</title>
                <meta
                    name="description"
                    content="Meet the dedicated Pujaris of this temple. Explore their expertise, experience, and contact details."
                />
                <meta
                    name="keywords"
                    content="temple pujari, temple priests, MandirMitra, temple services"
                />
                <meta
                    property="og:title"
                    content={`${templeName} - Temple Pujaris | MandirMitra`}
                />
                <meta
                    property="og:description"
                    content="Meet the dedicated Pujaris of this temple. Explore their expertise, experience, and contact details."
                />
                <meta property="og:url" content={window.location.href} />
            </Helmet>

            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                {alert && alert.message && (
                    <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                )}
            </div>
            {pujaris && pujaris.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pujaris.map((pujari, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                            <img
                                src={pujari.profile}
                                alt={pujari.name}
                                className="w-full h-60 object-fill rounded-t-lg"
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
                            <div className="flex justify-between items-center px-4 py-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-4">
                                    {/* Likes */}
                                    <EntityLikeButton 
                                        templeId={templeId} 
                                        entityType={"pujaris"} 
                                        entityId={pujari._id} 
                                        setAlert={setAlert}
                                        initialLikes={pujari.likes} 
                                    />
                                </div>           
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
