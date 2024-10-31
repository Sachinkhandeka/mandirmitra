import { Link, useLocation } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaUsers, FaDonate, FaAddressCard, FaEdit, FaLuggageCart, FaLandmark, FaGopuram } from "react-icons/fa";
import { FaMoneyBillTrendUp, FaMapLocationDot, FaBuildingUser  } from "react-icons/fa6";
import { MdAnalytics } from "react-icons/md";
import { SiEventbrite } from "react-icons/si";
import { RiHandHeartFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import { signoutSuccess } from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DashSidebarIcon() {
  const { currUser } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const [tab, setTab] = useState();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabUrl = urlParams.get("tab");
    if (tabUrl) {
      setTab(tabUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const response = await fetch(`/api/superadmin/signout`,{ method: "POST" });
      const data = await response.json();

      if (!response.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
      <div className="h-[80%] overflow-y-auto scrollbar-hidden flex flex-col mt-6 items-center">
            <Link to={"/dashboard?tab=profile"} className={`${tab === 'profile' ? ' bg-gray-300 dark:bg-gray-500 p-2 rounded-full' : ''} flex items-center my-4`}>
                <FaUser />
            </Link>
            { currUser.isAdmin && (
                <Link to={"/dashboard?tab=templeinsights"} className={`${tab === 'templeinsights' ? ' bg-gray-300 dark:bg-gray-500 p-2 rounded-full' : ''} flex items-center my-4`}>
                    <FaGopuram />
                </Link>
            ) }
            <Link to={"/dashboard?tab=analytics"} className={`${tab === 'analytics' ? ' bg-gray-300 dark:bg-gray-500 p-2 rounded-full' : ''} flex items-center my-4`}>
                <MdAnalytics />
            </Link>
            {
                (currUser && currUser.isAdmin || 
                    (currUser.roles && currUser.roles.some(role => role.permissions.some(p => 
                    p.actions.includes("read") || p.actions.includes("update") || p.actions.includes("delete")
                    )))) && (
                        <>
                            <Link to={"/dashboard?tab=daans"} className={`${tab === 'daans' ? ' bg-gray-300 dark:bg-gray-500 p-2 rounded-full' : ''} flex items-center my-4`}>
                                <FaDonate />
                            </Link>
                            <Link to={"/dashboard?tab=expenses"} className={`${tab === 'expenses' ? ' bg-gray-300 dark:bg-gray-500 p-2 rounded-full' : ''} flex items-center my-4`}>
                                <FaMoneyBillTrendUp />
                            </Link>
                            <Link to={"/dashboard?tab=inventories"} className={`${tab === 'inventories' ? ' bg-gray-300 dark:bg-gray-500 p-2 rounded-full' : ''} flex items-center my-4`}>
                                <FaLuggageCart />
                            </Link>
                            <Link to={"/dashboard?tab=events"} className={`${tab === 'events' ? ' bg-gray-300 dark:bg-gray-500 p-2 rounded-full' : ''} flex items-center my-4`}>
                                <SiEventbrite />
                            </Link>
                            <Link to={"/dashboard?tab=assets"} className={`${tab === 'assets' ? ' bg-gray-300 dark:bg-gray-500 p-2 rounded-full' : ''} flex items-center my-4`}>
                                <FaLandmark />
                            </Link>
                            <Link to={"/dashboard?tab=tenants"} className={`${tab === 'tenants' ? ' bg-gray-300 dark:bg-gray-500 p-2 rounded-full' : ''} flex items-center my-4`}>
                                <FaBuildingUser />
                            </Link>
                            <Link to={"/dashboard?tab=seva"} className={`${tab === 'seva' ? ' bg-gray-300 dark:bg-gray-500 p-2 rounded-full' : ''} flex items-center my-4`}>
                                 <RiHandHeartFill />
                            </Link>
                            <Link to={"/dashboard?tab=address"} className={`${tab === 'address' ? ' bg-gray-300 dark:bg-gray-500 p-2 rounded-full' : ''} flex items-center my-4`}>
                                 <FaMapLocationDot />
                            </Link>
                        </>
                    )
            }
            {currUser.isAdmin && (
                <>
                    <Link to={"/dashboard?tab=users"} className={`${tab === 'users' ? ' bg-gray-300 dark:bg-gray-500 p-2 rounded-full' : ''} flex items-center my-4`}>
                        <FaUsers />
                    </Link>
                    <Link to={"/dashboard?tab=roles"} className={`${tab === 'roles' ? ' bg-gray-300 dark:bg-gray-500 p-2 rounded-full' : ''} flex items-center my-4`}>
                        <FaAddressCard />
                    </Link>
                    <Link to={"/dashboard?tab=permissions"} className={`${tab === 'permissions' ? ' bg-gray-300 dark:bg-gray-500 p-2 rounded-full' : ''} flex items-center my-4`}>
                        <FaEdit />
                    </Link>
                </>
            )}
            <div onClick={handleSignout} className="flex items-center mt-6 mb-8 ml-2 cursor-pointer">
                <FaSignOutAlt className="mr-2" />
            </div>
      </div>
  );
}
