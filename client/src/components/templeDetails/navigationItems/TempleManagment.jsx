import EmptyState from "../../EmptyState";
import Alert from "../../Alert";
import EntityLikeButton from "../EntityLikeButton";
import { useState } from "react";
import { Helmet } from "react-helmet-async";

export default function TempleManagement({ management, templeId, templeName }) {
    const [ alert, setAlert ] = useState({ type : "", message : "" });
    return (
        <section className="p-1 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <Helmet>
                <title>{ templeName } - Management | MandirMitra</title>
                <meta 
                    name="description" 
                    content="Meet the people who manage and maintain the temple. Learn about their roles and responsibilities." 
                />
                <meta 
                    name="keywords" 
                    content="temple management, temple team, temple committee, Hindu temple leaders"
                />
                <meta 
                    property="og:title" 
                    content={`${ templeName } - Management | MandirMitra`} 
                />
                <meta 
                    property="og:description" 
                    content="Meet the people who manage and maintain the temple. Learn about their roles and responsibilities."
                />
                <meta 
                    property="og:image" 
                    content={management?.[0]?.profile}
                />
                <meta property="og:url" content={window.location.href} />
            </Helmet>

            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                {alert && alert.message && (
                    <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                )}
            </div>
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
                            <div className="flex justify-between items-center px-4 py-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-4">
                                    {/* Likes */}
                                    <EntityLikeButton 
                                        templeId={templeId} 
                                        entityType={"management"} 
                                        entityId={member._id} 
                                        setAlert={setAlert}
                                        initialLikes={member.likes} 
                                    />
                                </div>           
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
