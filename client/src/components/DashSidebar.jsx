import { Sidebar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaUsers, FaDonate, FaAddressCard, FaEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DashSidebar() {
    const { currUser } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const location = useLocation();
    const [ tab , setTab ] = useState();

    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const tabUrl = urlParams.get("tab");
        if(tabUrl){
            setTab(tabUrl);
        }
    },[ location.search ]);

    const handleSignout = async()=> {
        try {
            const response = await fetch(`/api/superadmin/signout`,{ method : "POST" });
            const data = await response.json();

            if(!response.ok) {
                console.log(data.message);
            }else {
                dispatch(signoutSuccess());
            }

        }catch(err) {
            console.log(err.message);
        }
    }
    return(
        <>
          <Sidebar className="w-full h-full" >
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Link to={"/?tab=profile"} >
                        <Sidebar.Item 
                            active={tab === "profile"} 
                            className="mt-6 cursor-pointer" 
                            icon={FaUser} 
                            label={currUser.isAdmin ? 'Admin' : 'User'} 
                            labelColor={"dark"} 
                            as={"div"}
                        >Profile</Sidebar.Item>
                    </Link>
                    { 
                        currUser.isAdmin && 
                        (
                            <>
                              <Link to={"/?tab=users"} >
                                <Sidebar.Item
                                    active={tab === "users"}
                                    className="mt-6 cursor-pointer"
                                    icon={FaUsers} 
                                    as={"div"}
                                >Users</Sidebar.Item>
                              </Link>
                              <Link to={"/?tab=daans"} >
                                <Sidebar.Item
                                    active={tab === "daans"}
                                    className="mt-6 cursor-pointer"
                                    icon={FaDonate} 
                                    as={"div"}
                                >Daans</Sidebar.Item>
                              </Link>
                              <Link to={"/?tab=roles"}>
                                <Sidebar.Item 
                                    active={tab === "roles"}
                                    className="mt-6 cursor-pointer"
                                    icon={FaAddressCard} 
                                    as={"div"}
                                >Roles</Sidebar.Item>
                              </Link>
                              <Link to={"/?tab=permissions"}>
                                <Sidebar.Item
                                    active={tab === "permissions"}
                                    className="my-6 cursor-pointer"
                                    icon={FaEdit}
                                    as={"div"}
                                >Permissions</Sidebar.Item>
                              </Link>
                            </>
                        ) 
                    }
                    <Sidebar.Item active={tab === 'signout'} icon={FaSignOutAlt} className="cursor-pointer" onClick={handleSignout}>Signout</Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>
        </>
    );
}