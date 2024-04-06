import { Sidebar } from "flowbite-react";
import { useSelector } from "react-redux";

export default function DashSidebar() {
    const { currUser } = useSelector(state => state.user);
    return(
        <>
          <Sidebar className="w-full h-full" >
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Sidebar.Item className="mt-6" >User</Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>
        </>
    );
}