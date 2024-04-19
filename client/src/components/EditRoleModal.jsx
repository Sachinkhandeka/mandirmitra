import { Modal, TextInput , Label , Badge, Checkbox } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiCheck } from "react-icons/hi";
import { useSelector } from "react-redux";

export default function EditRoleModal({ roleData , showModal , setShowModal ,  setRoleUpdated }) {
    const {  currUser } = useSelector(state => state.user);
    const [ error , setError ] = useState(null);
    const [ permissions , setPermissions ] = useState([]);
    const [ formData , setFormData ] = useState({
        name : '',
        permissions : [],
    });

    // Function to track changes in form - name 
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id] : e.target.value
        });
    }

    // Fetch permissions data
    const getPermissionsData = async () => {
        try {
            setError(null);

            if (!currUser || !currUser.templeId) {
                setError("Invalid user or templeId");
                return;
            }
            const response = await fetch(`/api/permission/get/${currUser.templeId.toString()}`);
            const data = await response.json();
            
            if(!response.ok) {
                return setError(data.message);
            }
            setPermissions(data.permissions);
        } catch(err) {
            setError(err.message);
        }
    }

    useEffect(() => {
        getPermissionsData();
    }, [currUser]);

    // Update formData when roleData changes
    useEffect(() => {
        if (roleData && roleData.name !== undefined && roleData.permissions && roleData.permissions.length > 0) {
            setFormData({
                ...formData,
                name : roleData.name,
                permissions : roleData.permissions,
            });
        }
    }, [roleData]);

    // Function to track changes in permission
    const handlePermissionChange = (permission) => {
        const index = formData.permissions.findIndex(p => p._id === permission._id);

        if (index === -1) {
            // Add the selected permission to the permissions array in formData
            setFormData(prevFormData => ({
                ...prevFormData,
                permissions: [...prevFormData.permissions, permission]
            }));
        } else {
            // Remove the permission from the permissions array in formData
            setFormData(prevFormData => ({
                ...prevFormData,
                permissions: prevFormData.permissions.filter(p => p._id !== permission._id)
            }));
        }
    }

    console.log(formData);

    return (
        <Modal show={showModal} dismissible onClose={() => setShowModal(false)} >
            <Modal.Header>
                <div>
                    <Badge icon={HiCheck} className="py-1 px-3" >
                        {roleData && roleData.permissions && roleData.permissions.length > 0 && 
                            roleData.permissions.map(permission => `${permission.permissionName}, `)}
                    </Badge>
                </div>
            </Modal.Header>
            <Modal.Body>
                <div className="space-y-6" >
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">Edit Role</h3>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="name">Role Name</Label>
                        </div>
                        <TextInput
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        {/* Permissions section */}
                        <div className="my-2 block">
                            <p>Permissions</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {permissions && permissions.length > 0 && permissions.map(permission => (
                                <div key={permission._id} className="flex items-center gap-3">
                                    <Checkbox
                                        checked={formData.permissions.some(p => p._id === permission._id)}
                                        onChange={() => handlePermissionChange(permission)}
                                        value={permission.permissionName}
                                        key={permission._id}
                                        id={permission._id}
                                    />
                                    <Label htmlFor={ permission._id }>{permission.permissionName}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}
