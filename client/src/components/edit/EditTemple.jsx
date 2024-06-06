import { Button, Label, Modal, Spinner, TextInput, Toast } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";
import React, { useRef, useState, useEffect } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const AdditionalTempleInfo = React.lazy(()=> import("../AdditionalTempleInfo"));

export default function EditTemple({ showModal, setShowModal, temple, setIsTempleUpdted }) {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        image: '',
    });
    const [isUpdated, setIsUpdated] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [addMore, setAddMore] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [imageFile, setImageFile] = useState(null);
    const [tempImageUrl, setTempImageUrl] = useState(null);
    const inputRef = useRef();

    useEffect(() => {
        if (temple) {
            setFormData({
                name: temple.name || '',
                location: temple.location || '',
                image: temple.image || '',
            });
        }
    }, [temple]);

    const handleChange = (e)=> {
        const { id, value } = e.target ; 
        setFormData({
            ...formData,
            [id] : value,
        });
        setIsUpdated(true);
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setTempImageUrl(URL.createObjectURL(file));
        }
    };

    const uploadImage = async () => {
        setUploadError(null);
        setUploadSuccess(null);
        setIsUpdated(false);
        setLoading(true);
        const storage = getStorage(app);
        const fileName = `templeImages/${new Date().getTime()}_${imageFile.name}`;
        const storageRef = ref(storage, fileName);

        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(Math.round(progress));
            },
            (error) => {
                setUploadError('Could not upload image. (File must be less than 2KB)');
                setUploadProgress(0);
                setImageFile(null);
                setTempImageUrl(null);
                setIsUpdated(false);
                setLoading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setTempImageUrl(downloadURL);
                    setIsUpdated(true);
                    setFormData((prevFormData) => ({ ...prevFormData, image: downloadURL }));
                    setUploadSuccess("Temple image uploaded successfully.");
                    setUploadProgress(0);
                    setLoading(false);
                });
            }
        );
    };

    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);

    const handleSubmit = async(e)=> {
        e.preventDefault();
        setLoading(true);
        setUploadError(null);
        setUploadSuccess(null);
        if(!isUpdated) {
            setLoading(false);
            setUploadError("No changes detected to update.");
            return ;
        }
        try {
            
            const response = await fetch(
                `/api/temple/edit/${temple._id}`,
                {
                    method : "PUT",
                    headers: { "content-type": "application/json" },
                    body : JSON.stringify({templeData : formData}),
                }
            );
        
            const data = await response.json();
    
            if(!response.ok) {
                setLoading(false);
                return setUploadError(data.message);
            }
    
            setUploadSuccess(data.message);
            setLoading(false);
            setIsTempleUpdted(true);
        } catch(err) {
            setLoading(false);
            setUploadError(err.message);
        }
    }
    return (
        <>
            <Modal show={showModal} dismissible onClose={() => setShowModal(false)}>
                <Modal.Header className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500">
                    <div className="relative w-full flex justify-center">
                        <input type="file" accept="image/*" onChange={handleImageChange} ref={inputRef} hidden />
                        <div
                            className="h-24 w-24 relative cursor-pointer"
                            onClick={() => inputRef.current.click()}
                        >
                            {uploadProgress > 0 && uploadProgress < 100 && (
                                <CircularProgressbar
                                    value={uploadProgress}
                                    text={`${uploadProgress}%`}
                                    strokeWidth={6}
                                    styles={{
                                        root: { width: '100%', height: '100%' },
                                        path: { stroke: `rgb(62, 152, 199)` },
                                        text: { fill: '#f88', fontSize: '16px' },
                                    }}
                                    className="absolute inset-0"
                                />
                            )}
                            <img
                                src={tempImageUrl || temple.image}
                                alt="profile_Image"
                                className={`
                                    h-full w-full rounded-full object-cover border-2 border-white
                                    ${uploadProgress > 0 && uploadProgress < 100 ? 'opacity-60' : ''}
                                `}
                            />
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit} >
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="name">Temple Name</Label>
                            <TextInput
                                name="name"
                                id="name"
                                value={formData.name}
                                type="text"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex flex-col gap-3 mt-2">
                            <Label htmlFor="location">Temple Location</Label>
                            <TextInput
                                name="location"
                                id="location"
                                value={formData.location}
                                type="text"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex flex-row-reverse my-4">
                            <Button gradientDuoTone={"pinkToOrange"} onClick={handleSubmit} disabled={loading} >
                                {loading ? <Spinner color={"pink"} /> : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                    {uploadError &&(
                        <Toast className=" float-right" theme="danger" onClose={() => setUploadError(null)}>
                            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                                <HiX className="h-5 w-5" />
                            </div>
                            <div className="ml-3 text-sm font-normal">{uploadError}</div>
                            <Toast.Toggle />
                        </Toast>
                    )}
                    {uploadSuccess && (
                        <Toast className="float-right" theme="success" onClose={() => setUploadSuccess(null)}>
                            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                                <HiCheck className="h-5 w-5" />
                            </div>
                            <div className="ml-3 text-sm font-normal">{uploadSuccess}</div>
                            <Toast.Toggle />
                        </Toast>
                    )}
                    <div onClick={()=> setAddMore(!addMore)} className="flex gap-1 items-center cursor-pointer text-xs text-blue-600 hover:underline font-semibold my-4" >
                        <p>Add More</p>
                        { addMore ? <MdOutlineKeyboardArrowUp /> : <MdOutlineKeyboardArrowDown /> }
                    </div>
                    { addMore && ( <AdditionalTempleInfo temple={temple} /> ) }
                </Modal.Body>
            </Modal>
        </>
    );
}
