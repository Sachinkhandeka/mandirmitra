import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom"

export default function PrivateRoute() {
    const { currUser } = useSelector(state => state.user);
    return currUser && currUser.displayName ? <Outlet /> : <Navigate to={"/"} />
}