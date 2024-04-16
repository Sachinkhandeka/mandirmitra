import { useState, useEffect } from "react";
import { Alert, Avatar, Badge, Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useSelector } from "react-redux";

 export default function EditUserModal ({ showModalEdit, setShowModalEdit, userData, setUserData, error, setError, success, setSuccess }) {
    const { currUser } = useSelector(state => state.user);
    const [ viewPass , setViewPass ] = useState(false);
    const [ formData , setFormData ] = useState({
        username:  '',
        email:  '',
        password: '',
        roles : [],
    });
    const [ isFormUpdated , setIsFormUpdated ] = useState(false);
    const [ roles , setRoles ] = useState([]);

    //roles data
    const  getRolesData = async()=> {
        try {
            setError(null);
            const  response = await fetch(`/api/role/get/${currUser.templeId}`);
            const data = await response.json();

            if(!response.ok) {
                return setError(data.message);
            }
            setRoles(data.roles);
        }catch(err){
            setError(err.message);
        }
    }
    useEffect(()=> {
        getRolesData();
    }, [ currUser ]);

    //handle onChange for roles
    const handleRoleSelection = (e , role)=> {
        const { checked } = e.target ; 
        if(checked) {
            setFormData((prev)=> ({
                ...prev ,
                roles : [ ...prev.roles , role._id ]
            }));
        }else {
            setFormData((prev)=> ({
                ...prev,
                roles : prev.roles.filter(rId => rId !== role._id)
            }));
        }
        setIsFormUpdated(true);
    }

     // Update formData when userData changes
     useEffect(() => {
        if (userData && userData.username !== undefined && userData.email !== undefined && userData.roles && userData.roles.length > 0) {
            setFormData(prevFormData => ({
                ...prevFormData,
                username: userData.username,
                email: userData.email,
                roles: userData.roles,
            }));
        }
    }, [userData]);

    //handle onChange for username pass email
    const handleChange = (e)=> {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
        setIsFormUpdated(true);
    }
    console.log(formData);
    //handle submit function  
    const handleSubmit =  async(e)=> {
        e.preventDefault();

        if(!isFormUpdated) {
            return setError("No changes detected to update user");
        }

        try {
            setError(null);
            setSuccess(null);

            const response =  await fetch(
                `/api/user/edit/${userData._id}`,
                {
                    method : "PUT",
                    headers : { "Content-Type" : "application/json" },
                    body : JSON.stringify(formData),
                }
            );
            const data = await response.json();

            if(!response.ok) {
                return setError(data.message);
            }
            setUserData(data.updatedUser);
            setIsFormUpdated(false);
        } catch(err) {
            setError(err.message);
        }
    }
    return (
    <Modal show={showModalEdit} dismissible onClose={() => setShowModalEdit(false)} position={"top-right"}>
        <Modal.Header>
            {/* Modal header content */}
            <div className="flex gap-8" >
                        <Avatar 
                            img={userData.profilePicture} 
                            rounded 
                            bordered color={"pink"} 
                            status="away" statusPosition="bottom-right" 
                        />
                        <div>
                            <h3 className="text-2xl font-mono font-bold" >{ userData.username }</h3>
                            <p className="text-xs text-gray-700 uppercase mt-2" >Created : 
                                <span className="text-xs text-gray-500 ml-2" >
                                { new Date(userData.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) }
                                </span>
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2" >
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
            {/* Error and success alerts */}
            {error && (
                <Alert color={"failure"} onDismiss={() => setError(null)} className="sticky top-0 z-10" >{error}</Alert>
            )}
            {success && (
                <Alert color={"success"} onDismiss={() => setSuccess(null)} className="sticky top-0 z-10" >{success}</Alert>
            )}
            {/* Form */}
            <form>
                {/* Username input */}
                <div className="flex-1 flex flex-col gap-4 my-4">
                    <Label htmlFor="username">Username</Label>
                    <TextInput type="text" id="username" name="username" value={formData.username} onChange={handleChange} />
                </div>
                {/* Email input */}
                <div className="flex-1 flex flex-col gap-4 my-4">
                    <Label htmlFor="email">Email</Label>
                    <TextInput type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
                {/* Password input */}
                <div className="flex flex-col gap-4 my-4 relative">
                    <Label htmlFor="password">Password</Label>
                    <TextInput 
                        type={`${viewPass ? 'text' : 'password'}`} 
                        id="password" 
                        name="password" 
                        placeholder="************" 
                        onChange={handleChange} 
                        required 
                    />
                    <span className="absolute right-4 top-12 cursor-pointer" onClick={() => setViewPass(!viewPass)}>
                        {viewPass ? <FaRegEyeSlash /> : <FaRegEye />}
                    </span>
                </div>
                {/* Current Roles section */}
                <div className="flex-1 flex flex-col gap-4 my-4">
                    <h3>Current Roles</h3>
                    <div className="grid grid-cols-2 gap-3" >
                        {formData && formData.roles && formData.roles.length > 0 &&
                            formData.roles.map((role) => (
                                <div key={role._id} className="flex items-center gap-3">
                                    <Checkbox 
                                        checked={formData.roles.some(r => r._id === role._id)}
                                        onChange={(e) => handleRoleSelection(e, role)} 
                                        id={role.name}
                                        value={role.name}
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
                {/* all roles section */}
                {
                    roles && Array.isArray(roles) && roles.length > 0 && (
                        <div className="my-2 block">
                            <Label value="Update Roles" />
                            <div className="grid grid-cols-2 gap-3" >
                                {roles.filter(role => formData && !formData.roles.includes(role._id)).map(role => (
                                    <div key={role._id} className="flex gap-3 mt-2 items-center" >
                                        <Checkbox
                                            type="checkbox"
                                            id={role._id}
                                            value={role.name}
                                            onChange={(e) => handleRoleSelection(e, role)}
                                            className="cursor-pointer"
                                        />
                                        <Label htmlFor={role._id}>
                                            {role.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                     )
                 }
            </form>
        </Modal.Body>
        {/* Modal footer */}
        <Modal.Footer>
            <div className="flex gap-4">
                <Button onClick={() => setShowModalEdit(false)} color={"gray"}>Cancel</Button>
                <Button onClick={handleSubmit} outline gradientMonochrome="purple">Save Changes</Button>
            </div>
        </Modal.Footer>
    </Modal>
    );
 }