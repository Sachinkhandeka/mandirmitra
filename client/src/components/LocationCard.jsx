import { TextInput } from "flowbite-react";
import { useState } from "react";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import { MdWrongLocation } from "react-icons/md";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import Alert from "./Alert";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../utilityFunx";

export default function LocationCard({ label, data, getLocation }) {
    const navigate = useNavigate();
    const { currUser } = useSelector((state) => state.user);
    const [selectedLetter, setSelectedLetter] = useState("");
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");
    const [alert, setAlert] = useState({ type : "", message : "" });
    const [loading, setLoading] = useState(false);

    const editLocation = async (id) => {
        setAlert({ type : "", message : "" });
        try {
            const data = await fetchWithAuth(
                `/api/location/edit/${id}/${currUser.templeId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        entityType: label.toLowerCase(),
                        data: { name: editName.toLowerCase() },
                    }),
                },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate
            );
            
            if (data) {
                getLocation(); // Refresh data after edit
                setEditId(null);
                setEditName("");
                setAlert({ type : "success", message : "Address updated successfully" });
            } else {
                setAlert({ type : "", message :  data.message });
            }
        } catch (err) {
            setAlert({ type : "", message :  err.message });
        }
    };

    const deleteLocation = async (id) => {
        setAlert({ type : "", message : "" });
        try {
            const data = await fetchWithAuth(
                `/api/location/delete/${id}/${currUser.templeId}`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ entityType: label.toLowerCase() }),
                },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate
            );
            if (data) {
                getLocation(); // Refresh data after delete
                setAlert({ type : "success", message :  "Address deleted successfully" });
            } else {
                setAlert({ type : "error", message : data.message });
            }
        } catch (err) {
            setAlert({ type : "error", message : err.message });
        }
    };

    // Filter the data based on the selected letter
    const filteredData = selectedLetter
        ? data.filter((item) => item.name.startsWith(selectedLetter))
        : data;

    const sortedData = filteredData.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    });

    // Generate alphabet buttons
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toLowerCase().split("");

    const hasPermission = (action) => {
        return (
            currUser && currUser.isAdmin ||
            (currUser.roles && currUser.roles.some(role => 
                role.permissions.some(p => p.actions.includes(action))
            ))
        );
    };

    const canEditOrDelete = hasPermission("update") || hasPermission("delete");

    return (
        <>
        <Helmet>
            <title>{label} Management</title>
            <meta name="description" content={`Manage ${label.toLowerCase()} efficiently.`} />
        </Helmet>
        <div className="overflow-x-auto scrollbar-hidden max-h-72 overflow-y-auto">
            <h2 className="text-lg font-serif uppercase mb-2 z-10 text-center">
                {label}
            </h2>
            <div className="flex justify-center mb-2 w-auto overflow-x-auto scrollbar-hidden sticky top-0 z-20 bg-white dark:bg-slate-900">
                <div className="flex w-full">
                    {alphabet.map((letter) => (
                        <button
                            key={letter}
                            className={`w-8 h-8 px-4 py-2 rounded-full border flex items-center justify-center mx-1 
                                ${
                                    selectedLetter === letter
                                    ? "bg-gradient-to-r from-green-400 to-blue-500 text-white"
                                    : "bg-white text-black dark:bg-slate-800 dark:text-white"
                                } hover:bg-blue-300`}
                            onClick={() => setSelectedLetter(letter)}
                        >
                            {letter.toUpperCase() }
                        </button>
                    ))}
                </div>
            </div>
            {sortedData.length === 0 ? (
                <div className="py-20 flex items-center justify-center animate-pulse">
                    <MdWrongLocation className="text-2xl text-red-500" />
                </div>
            ) : (
                <>
                    <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                        {alert.message && (
                            <Alert 
                                type={alert.type}
                                message={alert.message}
                                autoDismiss
                                duration={6000}
                                onClose={()=> setAlert({ type : "", message : "" })}
                            />
                        )}
                    </div>
                    <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-700 sticky top-8 z-10">
                            <tr>
                                <th
                                    scope="col"
                                    className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Sr No.
                                </th>
                                <th
                                    scope="col"
                                    className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Name
                                </th>
                                { canEditOrDelete && (
                                    <th
                                        scope="col"
                                        className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Actions
                                    </th>
                                ) }
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                            {sortedData.map((item, index) => (
                                <tr key={item._id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <td className="p-4 text-sm font-normal text-gray-900 dark:text-white">
                                        {index + 1}
                                    </td>
                                    <td className="p-4 text-sm font-normal text-gray-900 dark:text-white">
                                        {editId === item._id ? (
                                            <TextInput type="text" value={editName} onChange={(e) =>
                                                    setEditName(e.target.value)
                                                }
                                                className="w-[100%]"
                                            />
                                        ) : (
                                            item.name
                                        )}
                                    </td>
                                    {canEditOrDelete && (
                                        <td className="p-4 text-sm font-normal text-gray-900 dark:text-white">
                                            <div className="flex gap-2">
                                                {editId === item._id ? (
                                                    <>
                                                        {hasPermission("update") && (
                                                            <>
                                                                <FaSave onClick={() => editLocation(item._id)} className="text-green-500 cursor-pointer mr-2" />
                                                                <FaTimes onClick={()=> { setEditId(null); setEditName(""); }} className="text-red-500 cursor-pointer" />
                                                            </>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        {hasPermission("update") && (
                                                            <FaEdit
                                                                onClick={() => {
                                                                    setEditId(item._id);
                                                                    setEditName(item.name);
                                                                }}
                                                                className="text-blue-500 cursor-pointer mr-2"
                                                            />
                                                        )}
                                                        {hasPermission("delete") && (
                                                            <FaTrash
                                                                onClick={() => deleteLocation(item._id)}
                                                                className="text-red-500 cursor-pointer"
                                                            />
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
        </>
    );
}
