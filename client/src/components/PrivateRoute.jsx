import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom"

export default function PrivateRoute() {
    const { currUser } = useSelector(state => state.user);
    
    // Function to get the token from cookies manually
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const accessToken = getCookie('access_token'); // Fetch the token manually

    return currUser && accessToken ? <Outlet /> : <Navigate to={"/"} />;
}
