import React, { useState, useEffect } from "react";
import { Alert, Avatar, Badge, Button, Checkbox, Label, Modal, Spinner, TextInput } from "flowbite-react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";

export default function EditUserModal({ showModalEdit, setShowModalEdit, userData, setUserData, setUserDataUpdated }) {
    const { currUser } = useSelector(state => state.user);
    const [viewPass, setViewPass] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        roles: [],
    });
    const [isFormUpdated, setIsFormUpdated] = useState(false);
    const [roles, setRoles] = useState([]);

    const getRolesData = async () => {
        try {
            setError(null);
            const response = await fetch(`/api/role/get/${currUser.templeId}`);
            const data = await response.json();

            if (!response.ok) {
                return setError(data.message);
            }
            setRoles(data.roles);
        } catch (err) {
            setError(err.message);
        }
    }

    useEffect(() => {
        getRolesData();
    }, [currUser]);

    const handleRoleSelection = (e, role) => {
        const { checked } = e.target;
        if (checked) {
            setFormData(prev => ({
                ...prev,
                roles: [...prev.roles, role]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                roles: prev.roles.filter(r => r._id !== role._id)
            }));
        }
        setIsFormUpdated(true);
    }

    useEffect(() => {
        if (userData && userData.username !== undefined && userData.email !== undefined) {
            setFormData(prevFormData => ({
                ...prevFormData,
                username: userData.username,
                email: userData.email,
                roles: userData.roles,
            }));
        }
    }, [userData]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
        setIsFormUpdated(true);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!isFormUpdated) {
            setLoading(false);
            return setError("No changes detected to update user");
        }

        try {
            setError(null);
            setSuccess(null);
            const response = await fetch(
                `/api/user/edit/${currUser.templeId}/${userData._id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );
            const data = await response.json();

            if (!response.ok) {
                setLoading(false);
                return setError(data.message);
            }
            setUserData(data.updatedUser);
            setLoading(false);
            setSuccess("User updated successfully.");
            setUserDataUpdated(true);
            setIsFormUpdated(false);
        } catch (err) {
            setLoading(false);
            setError(err.message);
        }
    }

    return (
        <>
            <Helmet>
                <title>Edit User Information</title>
                <meta name="description" content="Edit the details of the user including username, email, password, and roles." />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <Modal show={showModalEdit} dismissible onClose={() => setShowModalEdit(false)} position={"top-right"}>
                <Modal.Header>
                    <div className="flex flex-col md:flex-row justify-start items-start gap-8">
                        <Avatar
                            img={userData.profilePicture}
                            rounded
                            bordered
                            color={"pink"}
                            status="away"
                            statusPosition="bottom-right"
                            alt={`${userData.username}'s profile picture`}
                        />
                        <div>
                            <h3 className="text-2xl font-mono font-bold">{userData.username}</h3>
                            <p className="text-xs text-gray-700 uppercase mt-2">Created:
                                <span className="text-xs text-gray-500 ml-2">
                                    {new Date(userData.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {userData.roles && userData.roles.length > 0 &&
                                userData.roles.map((role) => (
                                    role.permissions.map((permission, index) => (
                                        <span key={index}>
                                            <Badge color={"info"} className="">
                                                {permission.permissionName}
                                            </Badge>
                                            {index !== role.permissions.length - 1 && ", "}
                                        </span>
                                    ))
                                ))
                            }
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    {error && (
                        <Alert color={"failure"} onDismiss={() => setError(null)} className="sticky top-0 z-10">{error}</Alert>
                    )}
                    {success && (
                        <Alert color={"success"} onDismiss={() => setSuccess(null)} className="sticky top-0 z-10">{success}</Alert>
                    )}
                    <form>
                        <div className="flex-1 flex flex-col gap-4 my-4">
                            <Label htmlFor="username">Username</Label>
                            <TextInput
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                aria-label="Username"
                            />
                        </div>
                        <div className="flex-1 flex flex-col gap-4 my-4">
                            <Label htmlFor="email">Email</Label>
                            <TextInput
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                aria-label="Email"
                            />
                        </div>
                        <div className="flex flex-col gap-4 my-4 relative">
                            <Label htmlFor="password">Password</Label>
                            <TextInput
                                type={viewPass ? 'text' : 'password'}
                                id="password"
                                name="password"
                                placeholder="************"
                                onChange={handleChange}
                                aria-label="Password"
                            />
                            <span className="absolute right-4 top-12 cursor-pointer" onClick={() => setViewPass(!viewPass)}>
                                {viewPass ? <FaRegEyeSlash /> : <FaRegEye />}
                            </span>
                        </div>
                        <div className="flex-1 flex flex-col gap-4 my-4">
                            <h3>Current Roles</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {formData.roles && formData.roles.length > 0 &&
                                    formData.roles.map((role) => (
                                        <div key={role._id} className="flex items-center gap-3">
                                            <Checkbox
                                                checked={formData.roles.some(r => r._id === role._id)}
                                                onChange={(e) => handleRoleSelection(e, role)}
                                                id={role.name}
                                                value={role.name}
                                                disabled
                                                aria-label={`Role ${role.name}`}
                                            />
                                            <Label htmlFor={role.name}>
                                                <div>
                                                    <p>{role.name}</p>
                                                    <span className="text-xs text-gray-500">
                                                        [{role.permissions && role.permissions.length > 0 &&
                                                            role.permissions.map(permission => permission.actions.join(", "))
                                                        }]
                                                    </span>
                                                </div>
                                            </Label>
                                        </div>
                                    ))}
                            </div>
                        </div>
                        {roles && Array.isArray(roles) && roles.length > 0 && (
                            <div className="my-2 block">
                                <Label value="Update Roles" />
                                <div className="grid grid-cols-2 gap-3">
                                    {roles.filter(role => formData && !formData.roles.some(r => r._id === role._id)).map(role => (
                                        <div key={role._id} className="flex gap-3 mt-2 items-center">
                                            <Checkbox
                                                checked={formData.roles.some(r => r._id === role._id)}
                                                type="checkbox"
                                                id={role._id}
                                                value={role.name}
                                                onChange={(e) => handleRoleSelection(e, role)}
                                                className="cursor-pointer"
                                                aria-label={`Role ${role.name}`}
                                            />
                                            <Label htmlFor={role._id}>
                                                {role.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <div className="flex gap-4">
                        <Button onClick={() => setShowModalEdit(false)} color={"gray"}>Cancel</Button>
                        <Button onClick={handleSubmit} outline gradientMonochrome="purple" disabled={loading}>
                            {loading ? (<Spinner color={"purple"} />) : 'Save Changes'}
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}
