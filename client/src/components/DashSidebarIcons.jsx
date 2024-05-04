import { Link, useLocation } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaUsers, FaDonate, FaAddressCard, FaEdit } from "react-icons/fa";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { signoutSuccess } from "../redux/user/userSlice";
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
    <>
      <Link to={"/?tab=profile"} className={`${tab === 'profile' ? ' bg-gray-300 dark:bg-gray-500 p-2 rounded-full' : ''} flex items-center my-4`}>
        <FaUser/>
      </Link>
      {
          (currUser && currUser.isAdmin || 
              (currUser.roles && currUser.roles.some(role=> role.permissions.some(p=> 
                p.actions.includes("read") || p.actions.includes("update") || p.actions.includes("delete")
              )))) && (
                <>
                    <Link to={"/?tab=daans"} className={`${tab === 'daans' ? ' bg-gray-300 dark:bg-gray-500 p-2 rounded-full' : ''} flex items-center my-4`}>
                        <FaDonate />
                    </Link>
                    <Link to={"/?tab=expenses"} className={`${tab === 'expenses' ? ' bg-gray-300 dark:bg-gray-500 p-2 rounded-full' : ''} flex items-center my-4`}>
                        <FaMoneyBillTrendUp />
                    </Link>
                </>
              )
      }
      {currUser.isAdmin && (
        <>
          <Link to={"/?tab=users"} className={`${tab === 'users' ? ' bg-gray-300 dark:bg-gray-500 p-2 rounded-full' : ''} flex items-center my-4`}>
            <FaUsers/>
          </Link>
          <Link to={"/?tab=roles"} className={`${tab === 'roles' ? ' bg-gray-300 dark:bg-gray-500 p-2 rounded-full' : ''} flex items-center my-4`}>
            <FaAddressCard />
          </Link>
          <Link to={"/?tab=permissions"} className={`${tab === 'permissions' ? ' bg-gray-300 dark:bg-gray-500 p-2 rounded-full' : ''} flex items-center my-4`}>
            <FaEdit  />
          </Link>
        </>
      )}
      <div onClick={handleSignout} className="flex items-center my-6 cursor-pointer">
        <FaSignOutAlt className="mr-2" />
      </div>
    </>
  );
}
