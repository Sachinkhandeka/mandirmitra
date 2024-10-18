import { Sidebar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaUsers, FaDonate, FaAddressCard, FaEdit, FaLuggageCart, FaLandmark, FaGopuram } from "react-icons/fa";
import { FaMoneyBillTrendUp, FaMapLocationDot, FaBuildingUser } from "react-icons/fa6";
import { MdAnalytics } from "react-icons/md";
import { SiEventbrite } from "react-icons/si";
import { RiHandHeartFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import { signoutSuccess } from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { getQuoteOfTheDay } from "../../quotes";

export default function DashSidebar() {
    const { currUser } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const location = useLocation();
    const [ tab , setTab ] = useState();
    const [dayQuote, setDayQuote] = useState(null);

    useEffect(() => {
        const quoteOfTheDay = getQuoteOfTheDay();
        setDayQuote(quoteOfTheDay);
    }, []);

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
            <div className="h-[70%] md:h-[80%] overflow-y-auto scrollbar-hidden">
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
                    { currUser.isAdmin && (
                        <Link to={"/?tab=templeinsights"} >
                            <Sidebar.Item
                                active={tab === "templeinsights"}
                                className="mt-6 cursor-pointer"
                                icon={FaGopuram} 
                                as={"div"}
                            >Temple Insights</Sidebar.Item>
                        </Link>
                    ) }
                    <Link to={"/?tab=analytics"} >
                        <Sidebar.Item 
                            active={tab === "analytics"} 
                            className="mt-6 cursor-pointer" 
                            icon={MdAnalytics}
                            as={"div"}
                        >Analytics</Sidebar.Item>
                    </Link>
                    {
                        (currUser && currUser.isAdmin || 
                            (currUser.roles && currUser.roles.some(role=> role.permissions.some(p=> 
                                p.actions.includes("read") || p.actions.includes("update") || p.actions.includes("delete")
                            )))) && (
                                <>
                                    <Link to={"/?tab=daans"} >
                                        <Sidebar.Item
                                            active={tab === "daans"}
                                            className="mt-6 cursor-pointer"
                                            icon={FaDonate} 
                                            as={"div"}
                                        >Donations</Sidebar.Item>
                                    </Link>
                                    <Link to={"/?tab=expenses"} >
                                        <Sidebar.Item
                                            active={tab === "expenses"}
                                            className="mt-6 cursor-pointer"
                                            icon={FaMoneyBillTrendUp}
                                            as={"div"} 
                                        >Expenses</Sidebar.Item>
                                    </Link>
                                    <Link to={"/?tab=inventories"} >
                                        <Sidebar.Item
                                            active={tab === "inventories"}
                                            className="mt-6 cursor-pointer"
                                            icon={FaLuggageCart}
                                            as={"div"} 
                                        >Inventories</Sidebar.Item>
                                    </Link>
                                    <Link to={"/?tab=events"} >
                                        <Sidebar.Item
                                            active={tab === "events"}
                                            className="mt-6 cursor-pointer"
                                            icon={SiEventbrite}
                                            as={"div"} 
                                        >Events</Sidebar.Item>
                                    </Link>
                                    <Link to={"/?tab=assets"} >
                                        <Sidebar.Item
                                            active={tab === "assets"}
                                            className="mt-6 cursor-pointer"
                                            icon={FaLandmark}
                                            as={"div"} 
                                        >Assets</Sidebar.Item>
                                    </Link>
                                    <Link to={"/?tab=tenants"} >
                                        <Sidebar.Item
                                            active={tab === "tenants"}
                                            className="mt-6 cursor-pointer"
                                            icon={FaBuildingUser}
                                            as={"div"} 
                                        >Tenants</Sidebar.Item>
                                    </Link>
                                    <Link to={"/?tab=seva"}>
                                        <Sidebar.Item
                                            active={tab === "seva"}
                                            className="my-6 cursor-pointer"
                                            icon={RiHandHeartFill}
                                            as={"div"}
                                        >Seva</Sidebar.Item>
                                    </Link>
                                    <Link to={"/?tab=address"}>
                                        <Sidebar.Item
                                            active={tab === "address"}
                                            className="my-6 cursor-pointer"
                                            icon={FaMapLocationDot}
                                            as={"div"}
                                        >Address</Sidebar.Item>
                                    </Link>
                                </>
                            )                
                    }
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
            <div className="p-4 bg-gradient-to-tr text-white from-indigo-400 to-purple-500 rounded-md text-center my-2">
                <h3 className="text-sm font-semibold mb-2">Quote of the Day</h3>
                    {dayQuote && (
                        <p className="italic text-xs">"{dayQuote.quote}"<span>- {dayQuote.source}</span></p>
                    )}
            </div>
            </div>
        </Sidebar>
        </>
    );
}