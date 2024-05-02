import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Avatar } from "flowbite-react";
import { IoIosArrowUp } from "react-icons/io";
import { FaUsers, FaIdCard } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";

import "../App.css";
import DonationBarChart from "./DonationBarChart";
import CardComponent from "./CardComponent";
import DonationPieChart from "./DonationPieChart";

export default function Home() {
    const { currUser } = useSelector(state=> state.user);
    const [ temple, setTemple ] =  useState({});
    const [ loading ,  setLoading ] = useState(false);
    const [ error , setError ] =  useState(null);
    const [ success, setSuccess ] = useState(null);
    const [donationAmnt, setDonationAmnt] = useState([]);
    const [donationCounts, setDonationCounts] = useState([]);
    const [totalDonationCount, setTotalDonationCount] = useState(0);
    const [totalUserCount, setTotalUserCount] = useState(0);
    const [totalRoleCount, setTotalRoleCount] = useState(0);
    const [totalPermissionCount, setTotalPermissionCount] = useState(0);

    //function to get  templeData
    const getTempleData = async()=> {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);
            const response = await fetch(`/api/temple/get/${currUser.templeId}`);
            const  data = await response.json();

            if(!response.ok) {
                setLoading(false);
                return  setError(data.message);
            }

            setLoading(false);
            setTemple(data.temple);
        }catch(err) {
            setLoading(false);
            setError(err.message);
        }
    }
    useEffect(()=>{
        getTempleData();
    },[currUser]);

    //get analytics data
    const getAnalyticsData = async()=> {
        try {
            const response = await fetch(`/api/temple//analytics/${currUser.templeId}`);
            const data = await response.json();

            if(!response.ok) {
                setError(data.message);
                return ; 
            }
            setDonationAmnt(data.donationData);
            setDonationCounts(data.donationCounts);
            setTotalDonationCount(data.totalDonationCount);
            setTotalUserCount(data.totalUserCount);
            setTotalRoleCount(data.totalRoleCount);
            setTotalPermissionCount(data.totalPermissionCount);
        }catch(err) {
            setError(err.message);
        }
    }
    useEffect(()=> {
        getAnalyticsData();
    },[currUser.templeId]);
    return (
        <div className="w-full min-w-[375px]" >  
            <div className="bg-gradient-to-t from-purple-400 to-purple-800 rounded-lg flex p-10 relative" >
                <h1 
                    className="absolute bottom-0 right-[32px] px-4 py-2 rounded-full 
                    bg-cyan-500 font-mono font-bold text-xl text-center animated-text" >E</h1>
                <h1 
                    className="absolute bottom-0 right-[42px] px-4 py-2 rounded-full
                    bg-rose-500 font-mono font-bold text-xl text-center animated-text" >L</h1>
                <h1 
                    className="absolute bottom-0 right-[52px] px-4 py-2 rounded-full 
                    bg-orange-500 font-mono font-bold text-xl text-center animated-text" >P</h1>
                <h1 
                    className="absolute bottom-0 right-[62px] px-4 py-2 rounded-full 
                  bg-lime-500 font-mono font-bold text-xl text-center animated-text" >M</h1>
                <h1 
                    className="absolute bottom-0 right-[72px] px-4 py-2 rounded-full 
                  bg-blue-500 font-mono font-bold text-xl text-center animated-text" >A</h1>
                <h1 
                    className="absolute bottom-0 right-[82px] px-4 py-2 rounded-full 
                  bg-amber-500 font-mono font-bold text-xl text-center animated-text" >T</h1>
                <div className="absolute bottom-[-15px]  left-3 bg-white rounded-full">
                    {temple && Object.keys(temple).length > 0 ? (
                        <Avatar img={temple.image} rounded bordered color="light" size="lg" />
                    ) : (
                        <Avatar rounded bordered color="light" size="lg" />
                    )}
                </div>
            </div>
            <div className="mt-8 ml-4" >
                <h3 className="text-xl font-serif uppercase font-semibold" >{ temple.name }</h3>
                <p className="text-xs font-light" >{ temple.location }</p>
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-4 my-8 w-full" >
                <CardComponent 
                    total={totalDonationCount}
                    label="Total donations"
                    compStyle="border-b border-orange-400"
                    IconComponent={IoIosArrowUp}
                    progressColor={"#fb923c"}
                />
                <CardComponent
                    total={totalUserCount}
                    label="Total Users"
                    compStyle="border-b border-indigo-400"
                    IconComponent={FaUsers} 
                    progressColor={"#818cf8"}
                />
                <CardComponent 
                    total={totalRoleCount}
                    label="Total Roles"
                    compStyle="border-b border-red-400"
                    IconComponent={FaIdCard}
                    progressColor={"#f87171"}
                />
                <CardComponent 
                    total={totalPermissionCount}
                    label="Total Permissions"
                    compStyle="border-b border-green-400"
                    IconComponent={FaEdit}
                    progressColor={"#4ade80"}
                />
            </div>
            <div className="flex flex-col md:flex-row gap-4 my-4 p-4" >
                <div className="shadow-md rounded-md p-4 border w-full md:w-[50%]" >  
                    <DonationBarChart 
                        donationAmnt={donationAmnt}
                    />
                </div>
                <div className="shadow-md rounded-md p-4 border w-full md:w-[50%]" >
                    <DonationPieChart
                        donationCounts={donationCounts} 
                    />
                </div>
            </div>
        </div>
    )
}