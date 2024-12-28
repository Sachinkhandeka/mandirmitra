import { Modal } from "flowbite-react";
import AddStory from "./AddStory";
import StoryDisplay from "./StoryDisplay";
import Alert from "../Alert";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function StoryModal({ storyModal, onClose, templeId, stories }) {
    const { currUser } = useSelector( state => state.user );
    const [showAddStory, setShowAddStory] = useState(false);

    return (
        <Modal show={storyModal} dismissible onClose={onClose} popup className="bg-black">
            <Modal.Header className="p-4 text-2xl font-bold italic">Story</Modal.Header>
            <Modal.Body>
                <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                    {alert && alert.message && (
                        <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                    )}
                </div>
                { currUser && currUser.isAdmin && showAddStory ? (
                    <AddStory onCancel={() => setShowAddStory(false)} templeId={templeId} stories={stories} />
                ) : (
                    <StoryDisplay
                        onAddNew={() => setShowAddStory(true)}
                        stories={stories}
                    />
                )}
            </Modal.Body>
        </Modal>
    );
}
