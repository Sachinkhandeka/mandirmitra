import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// function to upload image url on the firebase
export const uploadImages = async (
    files,
    setUploadProgress,
    setLoading,
    setAlert
) => {
    try {
        setAlert({ type: "", message: "" });
        setLoading(true);

        const storage = getStorage(app);
        const filesArray = Array.isArray(files) ? files : [files];

        const uploadPromises = filesArray.map((file, index) => {
            const fileName = `${new Date().getTime()}_${file.name}`;
            const storageRef = ref(storage, fileName);

            const uploadTask = uploadBytesResumable(storageRef, file);

            return new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setUploadProgress(progress.toFixed(0));
                    },
                    (error) => {
                        setAlert({ type: "error", message: error.message });
                        reject(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL);
                        }).catch((err) => reject(err));
                    }
                );
            });
        });

        // Wait for all uploads to finish
        const downloadURLs = await Promise.all(uploadPromises);
        
        // Directly return downloadURLs without relying on state
        setAlert({ type: "success", message: "Image(s) uploaded successfully." });
        setUploadProgress(Array(filesArray.length).fill(0));
        return downloadURLs;
    } catch (error) {
        setAlert({ type: "error", message: error.message });
        setLoading(false);
        throw error; // Ensure the error is thrown
    }
};

export const refreshToken = async () => {
    const auth = getAuth(app);

    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                return reject(new Error("User not authenticated"));
            }

            try {
                await user.getIdToken(true); 
                resolve();
            } catch (err) {
                reject(new Error("Error while refreshing the token"));
            }
        });
    });
};

// Utility function to extract video ID and convert to embeddable URL
export const getYouTubeEmbedUrl = (url)=> {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=)|youtu\.be\/)([^&\n?#]+)/;
    const matches = url.match(regex);
    const videoId = matches ? matches[1] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

//utility function to get devotee refresh token 
export const refreshDevoteeAccessToken = async ()=> {
    try {
        const response = await fetch("/api/devotee/refresh-token", {
            method: "POST",
            headers : { "content-type": "application/json" }
        });
        const data = await response.json();
        if (!response.ok) {
            return { errorData : data };
        }
        return true;
    } catch (error) {
        return { errorData : error };
    }
}

//utility function to get super-admin or user refresh token
export const refreshSuperAdminOrUserAccessToken = async ()=> {
    try {
        const response = await fetch(
            "/api/superadmin/refresh-token",
            {
                method : "POST",
                headers : { "content-type" : "application/json" },
            }
        );
        const data = await response.json();
        if(!response.ok) {
            return { errorData : data };
        }
        return true;
    } catch (error) {
        return { errorData : error};
    }
}

//utility function to call secure routes with refresh token checks
export const fetchWithAuth = async (
    endpoint,
    options,
    refreshTokenFunction,
    userType,
    setLoading,
    setAlert,
    navigate,
    retry = false,
) => {
    try {
        // initial API request
        const response = await fetch(`${endpoint}`, options);
        const data = await response.json();

        // unauthorized responses
        if (!response.ok) {
            if (response.status === 401 && (data.message === "jwt expired" || data.message === "Unauthorized request")) {
                // Attempt token refresh
                const refreshTokens = await refreshTokenFunction();
                if (refreshTokens !== true && refreshTokens.errorData) {
                    setAlert({
                        type: "error",
                        message: refreshTokens.errorData.message || "Failed to refresh tokens.",
                    });
                    if(userType === "Devotee"){
                        navigate("/devotees"); // Redirect if token refresh fails
                        return;
                    }else {
                        navigate("/login"); // Redirect if token refresh fails
                        return;
                    }
                }
                // Retry logic for token refresh failure
                if (retry) {
                    setAlert({ type: "error", message: "Token request failed multiple times." });
                    return;
                }

                // Retry the original request after token refresh
                return await fetchWithAuth(
                    endpoint,
                    options,
                    refreshTokenFunction,
                    setLoading,
                    setAlert,
                    navigate,
                    true,
                );
            }

            // Handle other backend errors
            setAlert({ type: "error", message: data.message });
            return;
        }

        // Return successful response data
        return data;
    } catch (error) {
        // Handle network or unexpected errors
        setAlert({ type: "error", message: error.message || "Error while fetching data." });
        return;
    } finally {
        // Ensure loading state is managed at the caller level
        setLoading(false);
    }
};
