import { Button, Spinner } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch, useSelector }  from "react-redux";
import { signinStart, signinSuccess, signinFailure } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function OAuth({ templeId }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading } = useSelector( state => state.user );
    const auth = getAuth(app);

    const handleGoogleClick = async()=> {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt : 'select_account' });
        try {
            dispatch(signinStart());
            const result = await signInWithPopup(auth , provider);
            const response =  await fetch(
                "/api/superadmin/google",
                {
                    method : "POST",
                    headers : { "Content-Type" : "application/json" },
                    body : JSON.stringify({
                        name : result.user.displayName,
                        email: result.user.email,
                        googlePhotoUrl : result.user.photoURL,
                        phoneNumber : localStorage.getItem("signupPhoneNumber"),
                        templeId : templeId,
                    })
                }
            );

            const  data = await response.json();
            if(!response.ok) {
                dispatch(signinFailure(data.message));
                return ;
            }
            dispatch(signinSuccess(data.currUser));
            navigate("/dashboard");

        }catch(err) {
            dispatch(signinFailure(err.message));
        }
    }
    return (
        <>
        <Helmet>
            <title>Sign up/in with Google</title>
            <meta name="description" content="Sign up/in to your account using Google." />
        </Helmet>
        <Button 
            type="button" 
            gradientDuoTone={"pinkToOrange"} 
            outline 
            className="w-full my-8 text-sm"
            onClick={handleGoogleClick}
            disabled={loading}
        >
                { loading ? "" : <AiFillGoogleCircle className="w-6 h-6 mr-3" /> }
                { loading ? <Spinner color="warning" aria-label="loading indicator" /> :  'Continue with Google' }
        </Button>
        </>
    );
}