import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TextInput, Button, Toast, Spinner } from 'flowbite-react';
import { FaSave, FaTimes, FaTrash } from 'react-icons/fa';
import { MdModeEdit } from "react-icons/md";
import { HiCheck, HiX } from "react-icons/hi";
import { TbFaceIdError } from "react-icons/tb";
import { Helmet } from "react-helmet-async";

export default function DashSeva() {
    const { currUser } = useSelector(state => state.user);
    const [seva, setSeva] = useState([]);
    const [editSevaId, setEditSevaId] = useState(null);
    const [editSevaName, setEditSevaName] = useState("");
    const [loading, setLoading] = useState(false);
    const [delLoading, setDelLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const getSeva = useCallback(async () => {
        try {
            const response = await fetch(`/api/seva/get/${currUser.templeId}`);
            const data = await response.json();

            if (!response.ok) {
                return;
            }
            setSeva(data.seva);
        } catch (err) {
            console.error(err);
        }
    }, [currUser.templeId]);

    const handleEditSeva = async (sevaId) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await fetch(`/api/seva/edit/${sevaId}/${currUser.templeId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ sevaName: editSevaName })
            });

            if (!response.ok) {
                setLoading(false);
                setError("Failed to edit Seva");
                return;
            }
            setSuccess("Seva edited successfully");
            setLoading(false);
            getSeva();
            setEditSevaId(null);
        } catch (err) {
            setLoading(false);
            console.error(err.message);
        }
    };

    const handleDeleteSeva = async (sevaId) => {
        setDelLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await fetch(`/api/seva/delete/${sevaId}/${currUser.templeId}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                setDelLoading(false);
                setError("Failed to delete Seva.");
                return;
            }
            getSeva();
            setSuccess("Seva deleted successfully");
            setDelLoading(false);
        } catch (err) {
            setDelLoading(false);
            setError(err.message);
        }
    };

    useEffect(() => {
        getSeva();
    }, [getSeva]);

    const hasPermission = (action) => {
        return (
            currUser && currUser.isAdmin ||
            (currUser.roles && currUser.roles.some(role => 
                role.permissions.some(p => p.actions.includes(action))
            ))
        );
    };

    return (
        <>
        <Helmet>
            <title>Seva Management - Dashboard</title>
            <meta name="description" content="Manage Seva offerings efficiently. View, edit, and delete Seva offerings at your temple." />
        </Helmet>
        <div className="min-h-screen py-8 px-4 relative">
            <div className="container mx-auto max-w-4xl rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold mb-4 text-center">Seva Management</h1>
                {seva.length > 0 ? (
                    seva.map((sevaItem, index) => (
                        <div key={sevaItem._id} className="mb-4 border-b pb-4">
                            {editSevaId === sevaItem._id ? (
                                <div className="flex items-center gap-2 flex-col md:flex-row">
                                    <label className="block text-sm font-medium mr-2">Edit Seva Name:</label>
                                    <TextInput
                                        type="text"
                                        value={editSevaName}
                                        onChange={(e) => setEditSevaName(e.target.value)}
                                        placeholder="Enter new seva name"
                                        className="flex-grow"
                                    />
                                    <div className="flex items-center gap-2 p-2">
                                        <Button onClick={() => handleEditSeva(sevaItem._id)} color={"success"} size="xs" disabled={loading}>
                                            {loading ? <Spinner color={"success"} size={"xs"} /> : <FaSave />}
                                        </Button>
                                        <Button onClick={() => setEditSevaId(null)} className="ml-2" color="failure" size="xs" disabled={loading}>
                                            <FaTimes />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-4 items-center" >
                                        <span className="text-xl font-bold" >{ index + 1 }.</span>
                                        <h2 className="text-md font-semibold">{sevaItem.sevaName}</h2>
                                    </div>
                                    <div className="flex flex-col gap-2 items-center">
                                        {hasPermission("update") && (
                                            <Button onClick={() => {
                                                setEditSevaId(sevaItem._id);
                                                setEditSevaName(sevaItem.sevaName);
                                            }}
                                                gradientMonochrome={"success"}
                                                size={"xs"}
                                                pill
                                            >
                                                <MdModeEdit />
                                            </Button>
                                        )}
                                        {hasPermission("delete") && (
                                            <Button 
                                                onClick={() => handleDeleteSeva(sevaItem._id)} 
                                                gradientMonochrome={"failure"} 
                                                size={"xs"} 
                                                pill
                                                disabled={delLoading}
                                            >
                                                {delLoading ? <Spinner color={"failure"} size={"xs"} /> : <FaTrash />} 
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="flex justify-center items-center h-screen">
                        <div className="text-center flex flex-col items-center justify-center">
                            <TbFaceIdError size={50} className="animate-bounce" />
                            <p>No Seva Added Yet!</p>
                        </div>
                    </div>
                )}
            </div>
            {success && (
                <Toast className="absolute bottom-4 right-4 z-50">
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                        <HiCheck className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm font-normal">{success}</div>
                    <Toast.Toggle />
                </Toast>
            )}
            {error && (
                <Toast className="absolute bottom-4 right-4 z-40">
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                        <HiX className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm font-normal">{error}</div>
                    <Toast.Toggle />
                </Toast>
            )}
        </div>
        </>
    );
}
