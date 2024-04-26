import { useSelector } from "react-redux";
import { IoBagCheck } from "react-icons/io5";
import { IoIosCreate } from "react-icons/io";
import { FaReadme } from "react-icons/fa";
import { MdOutlineUpdate, MdDeleteForever } from "react-icons/md";

export default  function  UserRoles() {
    const { currUser } = useSelector(state => state.user);

    //switch statement to  render icons according to actions/permissions
    const renderIcon = (action) => {
        switch (action) {
            case "read":
                return <FaReadme size={20} />;
            case "create":
                return <IoIosCreate size={20} />;
            case "update":
                return <MdOutlineUpdate size={20} />;
            case "delete":
                return <MdDeleteForever size={20} />;
            default:
                return null;
        }
    };
    return (
        <>
        { currUser && !currUser.isAdmin && (
            <div  className="w-full bg-gradient-to-tr from-green-400 to-yellow-100 dark:bg-gradient-to-tr dark:from-gray-800 dark:to-gray-600" >
                <div className="p-4" > 
                    { currUser.roles.map((role)=> (
                        role.permissions.map((p)=> (
                            <div key={p._id} >
                                <div className="flex gap-5 items-center" >
                                    <IoBagCheck size={30} />
                                    <p className=" text-xl font-semibold uppercase " >{ p.permissionName }</p>
                                </div>
                                {p.actions.map((action) => (
                                    <div key={action} className="flex gap-5 items-center m-5 pl-5">
                                        {renderIcon(action)}
                                        <p className="text-md  uppercase">{action}</p>
                                    </div>
                                ))}
                            </div>
                        ))
                    )) }
                </div>
            </div>
        ) }
        </>
    );
}