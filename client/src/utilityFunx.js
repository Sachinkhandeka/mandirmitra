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