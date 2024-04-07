import { Sidebar } from "flowbite-react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function DashSidebar() {
    const { currUser } = useSelector(state => state.user);
    const location = useLocation();
    const [ tab , setTab ] = useState();

    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const tabUrl = urlParams.get("tab");
        if(tabUrl){
            setTab(tabUrl);
        }
    },[ location.search ]);
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
                    <Sidebar.Item active={tab === 'signout'} icon={FaSignOutAlt} className="cursor-pointer" >Signout</Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>
        </>
    );
}