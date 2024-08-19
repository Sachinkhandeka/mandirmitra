import { Modal, Button, Label,TextInput, Spinner } from "flowbite-react";
import { FaPencil } from "react-icons/fa6";
import { LuView } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { MdOutlineAttachEmail, MdOutlineCall } from "react-icons/md";
import { useDispatch , useSelector } from "react-redux";
import { updateStart, updateSuccess, updateFailure, resetError } from "../../redux/user/userSlice";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import { Helmet } from "react-helmet-async";
import 'react-circular-progressbar/dist/styles.css';

import CreateUser from "../create/CreateUser";
import CreateRoles from "../create/CreateRoles";
import CreatePermissions from "../create/CreatePermissions";
import UserRoles from "../UserRoles";
import AddTehsilGaam from "../AddTehsilGaam";
import DonationForm from "../create/DonationForm";
import CreateExpense from "../create/CreateExpense";
import CreateEvent from "../create/CreateEvent";
import CreateSeva from "../create/CreateSeva";
import CreateInventory from "../create/CreateInventory";
import CreateTenant from "../create/CreateTenant";
import CreateAssets from "../create/CreateAssets";
import Alert from "../Alert";
import ImageModal from "../ImageModal";

export default function DashProfile() {
    const dispatch = useDispatch();
    const [ showModal , setShowModal ] = useState(false);
    const [ viewPass , setViewPass ] = useState(false);
    const { currUser, loading , error } = useSelector(state => state.user);
    const [ imageFile , setImageFile ] = useState(null);
    const [ tempImageUrl , setTempImageUrl ] = useState(null);
    const [ uploadProgress , setUploadProgress ] = useState(0);
    const [ uploadError , setUploadError ] = useState(null);
    const [ uploadSuccess , setUploadSuccess ] = useState(null);
    const [ success , setSuccess ] = useState(null);
    const [ updated, setUpdated ] = useState(false);
    const [ roleUpdated, setRoleUpdated ] = useState(false);
    const inputRef = useRef();
    const [ formData , setFormData ] = useState({
        profilePicture : currUser.profilePicture,
        username : currUser.username,
        phoneNumber : currUser.phoneNumber,
        email : currUser.email,
        password : "",
    });
    const [ locationAdded , setLocationAdded ] = useState(false);
    const [sevaUpdated, setSevaUpdated] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);

    //handleChange - formData
    const handleChange = (e)=> {
        setFormData({
            ...formData,
            [e.target.id] : e.target.value.trim(),
        });
    }

    //update super admin function
    const handleSubmit = async(e)=> {
        e.preventDefault();
        dispatch(updateStart());
        setSuccess(null);
        try {
            const response =  await  fetch(
                currUser && currUser.isAdmin ? `/api/superadmin/edit/${currUser.templeId}/${currUser._id}` : `/api/user/edit/${currUser.templeId}/${currUser._id}`,
                {
                    method : "PUT",
                    headers : { "Content-Type" : "application/json" },
                    body : JSON.stringify(formData),
                }
            );
            const  data = await response.json();

            if(!response.ok) {
                dispatch(updateFailure(data.message));
                return ;
            }
            setSuccess("Profile updated successfully.");
            dispatch(updateSuccess( currUser && currUser.isAdmin ? data.currUser : data.updatedUser));
        } catch(err) {
            dispatch(updateFailure(err.message));
        }
    }

    //handle imagechange functionality
    const handleImageChange = (e)=> {
        const file = e.target.files[0];
        if(file) {
            setImageFile(file);
            setTempImageUrl(URL.createObjectURL(file));
        }
    }
    //upload image file
    const uploadImage = async()=> {
        setUploadError(null);
        setUploadSuccess(null);
        const storage = getStorage(app);
        const fileName = `${ currUser.isAdmin ? 'adminProfiles': 'userProfiles'}/${new Date().getTime()}_${imageFile.name}` ; 
        const storageRef = ref(storage , fileName);

        const uploadTask = uploadBytesResumable( storageRef, imageFile );
        uploadTask.on(
            'state_changed',
            (snapshot)=> {
                const progress = ( snapshot.bytesTransferred / snapshot.totalBytes ) * 100 ; 
                setUploadProgress(progress.toFixed(0));
            },
            (error)=> {
                setUploadError('Could not upload an image.(File must be less than 2KB)');
                setUploadProgress(0);
                setImageFile(null);
                setTempImageUrl(null);
            },
            ()=> {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=> {
                    setTempImageUrl(downloadURL);
                    setFormData({ ...formData , profilePicture : downloadURL })
                    setUploadSuccess("Profile picture uploaded Successfully.Please save Changes by clicking on pencil.")
                })
            }
        );
    }
    useEffect(()=>{
        if(imageFile) {
            uploadImage();
        }
    },[imageFile]);

    return (
        <>
        <Helmet>
            <title>Profile - {currUser.username}</title>
            <meta name="description" content="Manage your profile details including username, email, and profile picture." />
            <meta name="keywords" content="profile, user, settings, admin" />
        </Helmet>
        <div className="w-full" >
            { currUser && (
                <div className="w-full" >
                    <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm"  >
                        { uploadError && (<Alert type="error" message={uploadError} autoDismiss duration={6000} onClose={()=> setUploadError(null)} />) }
                        { uploadSuccess && ( <Alert type="success" message={uploadSuccess} autoDismiss duration={6000} onClose={setUploadSuccess(null)} /> ) }
                    </div>
                    <div className="w-full bg-gradient-to-b from-blue-800 to-blue-300 rounded-lg h-16 relative" >
                        <input type="file" accept="image/*" onChange={handleImageChange} ref={inputRef} hidden/>
                        <div className="h-14 w-14 absolute bottom-[-10px] left-4 rounded-full cursor-pointer" onClick={()=> inputRef.current.click()} >
                            { uploadProgress !== null && uploadProgress !== 0 &&  (
                                <CircularProgressbar 
                                    value={uploadProgress || 0}
                                    text={`${uploadProgress}%`}
                                    strokeWidth={6}
                                    styles={{ 
                                        root : { width : '100%', height:'100%', position:'absolute', top:'0', left:'0' },
                                        path : { stroke : `rgb(62, 152, 199)` },
                                    }} 
                                />
                            ) }
                            <img 
                                src={tempImageUrl || currUser.profilePicture} 
                                alt="profile_Image" 
                                className={`
                                   h-full w-full rounded-full object-cover border-2 border-white
                                   ${uploadProgress && uploadProgress < 100 && 'opacity-60'}
                                `}
                            />
                        </div>
                        <button
                            className="absolute bottom-[-14px] left-14 p-2 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500 text-white shadow-lg"
                            onClick={() => setShowImageModal(true)}
                        >
                                <LuView size={14} />
                        </button>
                    </div>
                    <div className="mt-10 md:w-20 font-serif" >
                        <h1 className="text-xl md:text-2xl font-bold pl-4 mb-4" >{  currUser.username }</h1>
                        <p className="text-xs md:text-sm pl-6 mb-2 flex gap-2 items-center" >
                            <span className=" animate-bounce"><MdOutlineAttachEmail /></span>
                            { currUser.email }
                        </p>
                        <p className="text-xs md:text-sm pl-6 mb-4 flex gap-2 items-center" >
                            <span className=" animate-bounce" ><MdOutlineCall /></span>
                            { currUser.phoneNumber }</p>
                    </div>
                    <div className="p-4 md:absolute md:right-8 md:top-28 rounded-full w-14 h-14 hover:bg-gray-300 dark:hover:bg-gray-700 cursor-pointer" >
                        <FaPencil size={20} onClick={()=> setShowModal(true)} />
                    </div>
                    <form className="p-4" onSubmit={handleSubmit} >
                    <Modal show={showModal} onClose={() => setShowModal(false)} position={"top-right"} >
                       <Modal.Header>Edit Details</Modal.Header>
                       <Modal.Body>
                        <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm"  >
                            { error && ( <Alert type={"error"} message={error} autoDismiss duration={6000} onClose={() => dispatch(resetError())} /> ) }
                            { success && ( <Alert type={"success"} message={success} autoDismiss duration={6000} onClose={() => setSuccess(null)} /> ) }
                       </div>
                         <div className="space-y-6">
                                <div className="flex flex-col gap-4 my-4" >
                                    <Label htmlFor="username" >username: </Label>
                                    <TextInput 
                                        type="text" 
                                        id="username" 
                                        name="username" 
                                        value={formData.username} 
                                        onChange={handleChange} required />
                                </div>
                                <div className="flex flex-col gap-4 my-4" >
                                    <Label htmlFor="email" >email: </Label>
                                    <TextInput 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleChange} required />
                                </div>
                                <div className="flex flex-col gap-4 my-4 relative" >
                                    <Label htmlFor="password" >password: </Label>
                                    <TextInput 
                                        type={`${ viewPass ? 'text' : 'password' }`} 
                                        id="password" 
                                        name="password" 
                                        placeholder={'**************'} 
                                        onChange={handleChange} required 
                                    />
                                    <span className="absolute right-4 top-12 cursor-pointer" onClick={() => setViewPass(!viewPass)}>
                                        {viewPass ? <FaRegEye /> : <FaRegEyeSlash /> }
                                    </span>
                                </div>
                         </div>
                       </Modal.Body>
                       <Modal.Footer>
                            <Button onClick={handleSubmit} disabled={loading}>
                                {loading ? <Spinner /> :'Save'}
                            </Button>
                            <Button color="gray" onClick={() => setShowModal(false)}>
                                Decline
                            </Button>
                       </Modal.Footer>
                    </Modal>
                    </form>
                     { !currUser.isAdmin && (
                        <UserRoles />  
                     ) }
                    {currUser.isAdmin && (
                        <div className="w-full bg-gradient-to-t from-red-400 via-orange-500 to-yellow-600 rounded-lg dark:bg-gray-700 p-2 md:p-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
                                <CreateUser
                                    roleUpdated={roleUpdated} 
                                /> 
                                <CreateRoles  
                                    updated={updated}
                                    setRoleUpdated={setRoleUpdated}
                                />
                                <CreatePermissions 
                                    setUpdated={setUpdated}
                                />
                                <CreateTenant />
                            </div>
                        </div>
                    )}
                    { 
                        (currUser.isAdmin || 
                        (currUser.roles && 
                        currUser.roles.some(role => role.permissions.some(p => p.actions.includes("create"))))) &&
                         (
                            <>
                                <div className="w-full flex flex-col md:flex-row flex-wrap gap-4 mt-10" >
                                    <AddTehsilGaam setLocationAdded={setLocationAdded} />
                                    <CreateSeva setSevaUpdated={setSevaUpdated} />
                                </div>
                                <DonationForm locationAdded={locationAdded} sevaUpdated={sevaUpdated} setSevaUpdated={setSevaUpdated} />
                                <CreateExpense />
                                <CreateEvent />
                                <CreateInventory />
                                <CreateAssets />
                            </>
                         )
                    }
                </div>
            ) }
            {
                showImageModal && (
                    <ImageModal
                        isOpen={showImageModal}
                        onClose={()=> setShowImageModal(null)}
                        url={ tempImageUrl || currUser.profilePicture }
                    />
                )
            }
        </div>
        </>
    );
}