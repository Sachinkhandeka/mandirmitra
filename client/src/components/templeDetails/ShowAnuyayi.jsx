import { Avatar, Modal } from "flowbite-react";

export default function ShowAnuyayi({ anuyayiList, showAnuyayi, setShowAnuyayi }) {
    return (
        <Modal show={showAnuyayi} dismissible onClose={() => setShowAnuyayi(false)} className="max-w-lg mx-auto">
            <Modal.Header className="text-xl font-semibold text-gray-800 dark:text-white">
                {`Anuyayi List (${anuyayiList?.length || 0})`}
            </Modal.Header>
            <Modal.Body>
                {anuyayiList && anuyayiList.length > 0 ? (
                    <div className="space-y-4">
                        {anuyayiList.map((anuyayi) => (
                            <div
                                key={anuyayi._id}
                                className="flex items-center gap-4 p-3 rounded-md bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-150 ease-in-out shadow-sm"
                            >
                                {/* Display profile picture */}
                                <Avatar
                                    img={anuyayi.photoURL}
                                    placeholderInitials={anuyayi.displayName[0]}
                                    alt={`${anuyayi.displayName}'s profile`}
                                    rounded
                                />

                                {/* Display devotee's name */}
                                <div className="text-md font-medium text-gray-800 dark:text-gray-200">
                                    {anuyayi.displayName}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600 dark:text-gray-400 py-4">
                        No anuyayi yet. Be the first to anuyayi this temple!
                    </p>
                )}
            </Modal.Body>
        </Modal>
    );
}
