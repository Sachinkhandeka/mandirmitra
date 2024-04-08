import { Modal, Button, Label,TextInput, Alert, Spinner, Toast } from "flowbite-react";
import { FaPencil } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { HiCheck, HiX } from "react-icons/hi";
import { useDispatch , useSelector } from "react-redux";
import { signinStart, signinSuccess, signinFailure, resetError } from "../redux/user/userSlice";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

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
    const inputRef = useRef();
    const [ formData , setFormData ] = useState({
        id :  currUser._id,
        username : currUser.username,
        email : currUser.email,
        password : "",
    });

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
        dispatch(signinStart());
        try {
            const response =  await  fetch(
                "/api/superadmin/edit",
                {
                    method : "PUT",
                    headers : { "Content-Type" : "application/json" },
                    body : JSON.stringify(formData),
                }
            );
            const  data = await response.json();

            if(!response.ok) {
                console.log(data.message);
                dispatch(signinFailure(data.message));
                return ;
            }
            dispatch(signinSuccess(data));
        } catch(err) {
            dispatch(signinFailure(err.message));
        }
    }

    //handle imagechhange functionality
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
        const fileName = new Date().getTime() + imageFile.name ; 
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
                    setUploadSuccess("Profile picture uploaded Successfully.")
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
        <div className="w-full min-w-[375px]" >
            { currUser && (
                <div className="w-full" >
                    { uploadError && (
                    <Toast>
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                          <HiX className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm font-normal">{ uploadError }</div>
                        <Toast.Toggle />
                    </Toast>) }
                    { uploadSuccess && (
                        <Toast>
                            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                            <HiCheck className="h-5 w-5" />
                            </div>
                            <div className="ml-3 text-sm font-normal">{ uploadSuccess }</div>
                            <Toast.Toggle />
                        </Toast>
                    ) }
                    <div className="w-full bg-gray-400 h-16 relative" >
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
                    </div>
                    <div className="mt-10 md:w-20" >
                        <h1 className="text-2xl font-mono font-bold pl-4" >{  currUser.username }</h1>
                        <p className="text-sm pl-4" >{ currUser.email }</p>
                    </div>
                    <div className="p-4 md:absolute md:right-8 md:top-28 rounded-full w-14 h-14 hover:bg-gray-300 cursor-pointer" >
                        <FaPencil size={20} onClick={()=> setShowModal(true)} />
                    </div>
                    <Modal show={showModal} onClose={() => setShowModal(false)}>
                       <Modal.Header>Edit Details</Modal.Header>
                       <Modal.Body>
                       { error && ( <Alert color={"failure"} onDismiss={() => dispatch(resetError())}>{ error }</Alert> ) }
                         <div className="space-y-6">
                            <form className="p-4" onSubmit={handleSubmit} >
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
                            </form>
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
                </div>
            ) }
        </div>
    );
}