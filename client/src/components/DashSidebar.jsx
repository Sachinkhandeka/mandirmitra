import { Sidebar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function DashSidebar() {
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
            const response = await fetch("/api/superadmin/signout",{ method : "POST" });
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
                            label={"User"} 
                            labelColor={"dark"} 
                            as={"div"}
                        >Profile</Sidebar.Item>
                    </Link>
                    <Sidebar.Item active={tab === 'signout'} icon={FaSignOutAlt} className="cursor-pointer" ><span onClick={handleSignout}>Signout</span></Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>
        </>
    );
}