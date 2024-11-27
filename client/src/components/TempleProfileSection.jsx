import { Avatar, Button, Spinner } from "flowbite-react";
import { useRef, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { uploadImages, refreshToken, fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../utilityFunx"; 
import { useNavigate } from "react-router-dom";

export default function TempleProfileSection({ temple, setAlert }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const [tempImgUrl, setTempImgUrl] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null); 
  const [uploadingText, setUploadingText] = useState("");  

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
      setTempImgUrl(URL.createObjectURL(file));
      try {
        setLoading(true);
        setUploadingText("Uploading...");
        await refreshToken();

        const downloadURLs = await uploadImages([file], setUploadProgress, setLoading, setAlert);

        if (downloadURLs.length > 0) {
          const downloadURL = downloadURLs[0];  
          setTempImgUrl(downloadURL);
          setUploadingText("Saving...");
          await SaveImgInDb(downloadURL);  
        }
      } catch (error) {
        setLoading(false);
        setAlert({ type: "error", message: error.message });
      }
    }
  };

  const SaveImgInDb = async (downloadURL) => {
    const updatedTempleInfo = { ...temple, image: downloadURL };
    try {
      const data = await fetchWithAuth(
        `/api/temple/edit/${temple._id}/genInfo`, 
          {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ templeData: updatedTempleInfo }),
          },
          refreshSuperAdminOrUserAccessToken,
          "User",
          setLoading,
          setAlert,
          navigate
      );
      if(data) {
        setLoading(false);
        setAlert({ type : "success", message : "Profile data updated successfully" });
      }
    } catch (err) {
      setLoading(false);
      setAlert({ type: "error", message: err.message });
    }
  };

  return (
    <>
      <div className="p-4 shadow-md flex flex-col gap-4 rounded-md bg-white dark:bg-slate-800 mb-2">
        {/* Avatar and Temple Information */}
        <Avatar
          placeholderInitials="TI"
          img={tempImgUrl ? tempImgUrl : temple.image}
          alt="temple_Profile"
          size={"xl"}
        />
        <h3 className="p-2 text-2xl font-bold text-center">{temple.name}</h3>
        <p className="p-2 text-sm text-center">{temple.location}</p>

        {/* File input for uploading new image */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={inputRef}
          hidden
        />

        {/* Upload button */}
        <Button
          color={"blue"}
          onClick={() => inputRef.current.click()}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner />
              <span className="animate-pulse ml-2">{uploadingText || "Loading..."}</span>
            </>
          ) : (
            <>
              <FaCloudUploadAlt className="mr-2 h-5 w-5" />
              <span>Change Picture</span>
            </>
          )}
        </Button>
      </div>
    </>
  );
}
