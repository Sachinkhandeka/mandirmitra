import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { Avatar } from "flowbite-react";
import { IoIosArrowUp } from "react-icons/io";
import { FaUsers, FaIdCard } from "react-icons/fa6";
import { FaRupeeSign, FaBoxes, FaExclamationTriangle, FaTimesCircle, FaChartBar, FaChartPie  } from "react-icons/fa";
import { CiEdit, CiLocationOn } from "react-icons/ci";
import { FaEdit } from "react-icons/fa";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { GiCash, GiGearHammer } from "react-icons/gi";
import banner from "../assets/banner.png";

import "../App.css";
import BarChart from "./BarChart";
import CardComponent from "./CardComponent";
import PieChart from "./PieChart";
import EditTemple from "./edit/EditTemple";
import InventoryPieChart from "./InventoryPieChart";
import InventoryBarChart from "./InventoryBarChart";
import Alert from "./Alert";

const GodCard = React.lazy(()=> import("./GodCard"));

export default function Home() {
    const {currUser} = useSelector(state=> state.user);
    const [temple, setTemple] =  useState({});
    const [loading ,  setLoading] = useState(false);
    const [error , setError] =  useState(null);
    const [success, setSuccess] = useState(null);
    const [donationAmnt, setDonationAmnt] = useState([]);
    const [expenseAmnt, setExpenseAmnt] = useState([]);
    const [donationCounts, setDonationCounts] = useState([]);
    const [expenseCounts, setExpenseCounts] = useState([]);
    const [totalDonationCount, setTotalDonationCount] = useState(0);
    const [totalExpenseCount, setTotalExpenseCount] = useState(0);
    const [totalUserCount, setTotalUserCount] = useState(0);
    const [totalRoleCount, setTotalRoleCount] = useState(0);
    const [totalPermissionCount, setTotalPermissionCount] = useState(0);
    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);
    const [balance, setBalance] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [isTemplUpdted, setIsTempleUpdted] = useState(false);

    const [totalInventoryValue, setTotalInventoryValue] = useState(0);
    const [lowStockItemsCount, setLowStockItemsCount] = useState(0);
    const [outOfStockItemsCount, setOutOfStockItemsCount] = useState(0);
    const [inventoryCategoryBreakdown, setInventoryCategoryBreakdown] = useState([]);
    const [inventoryQuantities, setInventoryQuantities] = useState([]);

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

    useEffect(()=>{
        if(isTemplUpdted) {
            getTempleData();
            setIsTempleUpdted(false);
        }
    },[isTemplUpdted]);
    //get analytics data
    const getAnalyticsData = useCallback( async()=> {
        try {
            const response = await fetch(`/api/temple/analytics/${currUser.templeId}`);
            const data = await response.json();

            if(!response.ok) {
                setError(data.message);
                return ; 
            }
            setDonationAmnt(data.donationData);
            setExpenseAmnt(data.expenseData);
            setDonationCounts(data.donationCounts);
            setExpenseCounts(data.expenseCounts);
            setTotalDonationCount(data.totalDonationCount);
            setTotalExpenseCount(data.totalExpenseCount);
            setTotalUserCount(data.totalUserCount);
            setTotalRoleCount(data.totalRoleCount);
            setTotalPermissionCount(data.totalPermissionCount);
            setTotalInventoryValue(data.totalInventoryValue);
            setLowStockItemsCount(data.lowStockItemsCount);
            setOutOfStockItemsCount(data.outOfStockItemsCount);
            setInventoryCategoryBreakdown(data.inventoryCategoryBreakdown);
            setInventoryQuantities(data.inventoryQuantities);
            setSuccess("Analytical data data fetched successfully");
        }catch(err) {
            setError(err.message);
        }
    },[currUser.templeId]);
    useEffect(()=> {
        getAnalyticsData();
    },[currUser.templeId]);

    //calculate the total donation amnt/income
    useEffect(() => {
        if (donationAmnt && donationAmnt.length > 0) {
            let totalAmount = 0;
            donationAmnt.forEach(el => {
                totalAmount += el.amount;
            });
            setIncome(totalAmount);
        }
    }, [donationAmnt]);
    
    //calculate the total expense amnt/expenses
    useEffect(() => {
        if (expenseAmnt && expenseAmnt.length > 0) {
            let totalExpense = 0;
            expenseAmnt.forEach(el => {
                totalExpense += el.amount;
            });
            setExpense(totalExpense);
        }
    }, [expenseAmnt]);
    
    //calculate  the balance available
    useEffect(() => {
        // Calculate the balance
        const netProfit = income - expense;
    
        // Update state for balance 
        setBalance(netProfit);
    }, [income, expense]);
    return (
        <>
        <Helmet>
            <title>Analytical Page - mandirmitra</title>
            <meta
                name="description"
                content="MandirMitra is your ultimate devotional companion, providing detailed information about temples, deities, and spiritual practices. Manage donations, expenses, and analytics with ease."
            />
            <meta
                name="keywords"
                content="MandirMitra, mandirmitra, mandir mitra, mandir, mitra temples, Hinduism, deities, donations, expenses, analytics, spirituality, religious management, Home-Page, Home Component"
            />
            <meta name="google-site-verification" content="VvYIu8ULwVvBXQX9D3xXhNJ_mVl9E7PKyae2OrlXMMQ" />
            <meta name="author" content="MandirMitra" />
            <link rel="canonical" href="https://www.mandirmitra.co.in/" />
        </Helmet>
        <div className="w-full" >  
            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                {success && ( <Alert type="success" message={success} autoDismiss duration={6000} onClose={() => setSuccess(null)} /> )}
                {error && ( <Alert type="error" message={error} autoDismiss duration={6000} onClose={() => setError(null)} /> )}
            </div>
            <div className="bg-contain bg-center h-full rounded-lg flex p-10 relative" style={{ backgroundImage: `url(${banner})` }}>
                <h1 
                    className="absolute bottom-0 right-[32px] px-2 md:px-4 py-1 md:py-2 rounded-full 
                    bg-cyan-500 font-mono md:font-bold text-xs md:text-xl text-center animated-text" >E</h1>
                <h1 
                    className="absolute bottom-0 right-[42px] px-2 md:px-4 py-1 md:py-2 rounded-full
                    bg-rose-500 font-mono md:font-bold text-xs  md:text-xl text-center animated-text" >L</h1>
                <h1 
                    className="absolute bottom-0 right-[52px] px-2 md:px-4 py-1 md:py-2 rounded-full 
                    bg-orange-500 font-mono md:font-bold text-xs md:text-xl text-center animated-text" >P</h1>
                <h1 
                    className="absolute bottom-0 right-[62px] px-2 md:px-4 py-1 md:py-2 rounded-full 
                  bg-lime-500 font-mono md:font-bold text-xs md:text-xl text-center animated-text" >M</h1>
                <h1 
                    className="absolute bottom-0 right-[72px] px-2 md:px-4 py-1 md:py-2 rounded-full 
                  bg-blue-500 font-mono md:font-bold text-xs md:text-xl text-center animated-text" >E</h1>
                <h1 
                    className="absolute bottom-0 right-[82px] px-2 md:px-4 py-1 md:py-2 rounded-full 
                  bg-amber-500 font-mono md:font-bold text-xs md:text-xl text-center animated-text" >T</h1>
                <div className={`absolute bottom-[-15px]  left-3 bg-white rounded-full`}>
                    {temple && Object.keys(temple).length > 0 ? (
                        <Avatar img={temple.image} rounded bordered color="light" size="lg" />
                    ) : (
                        <Avatar rounded bordered color="light" size="lg" />
                    )}
                </div>
            </div>
            <div className="mt-8 ml-4" >
                <div >
                    <h3 className="text-3xl font-bold dark:text-white">{ temple.name }</h3>
                    <p className="text-md font-normal text-gray-500 lg:text-lg dark:text-gray-400 flex items-center gap-3" >
                        <CiLocationOn size={16} className="text-black dark:text-white"/>
                        { temple.location }
                    </p>
                    { temple.foundedYear && (
                        <div className="text-gray-400 flex items-center gap-3 mb-4" > 
                            <GiGearHammer size={16} className="text-black dark:text-white"/>
                            <h6 className="text-lg text-gray-500 lg:text-lg dark:text-gray-400">since, { temple.foundedYear }</h6> 
                        </div>
                    ) }
                    { temple.description && (
                        <div className="mb-3 text-gray-500 dark:text-gray-400" >
                            <div className="text-3xl text-black dark:text-white mb-3">About</div>
                            { temple.description }
                        </div>
                    ) }
                        { temple.godsAndGoddesses && temple.godsAndGoddesses.length > 0 && (
                             <GodCard godsAndGoddesses={temple.godsAndGoddesses} />
                        ) }
                </div>
                { currUser.isAdmin && (
                    <div className="inline-block mt-2 cursor-pointer rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 p-2" >
                        <CiEdit size={20} onClick={()=> setShowModal(true)}/>
                    </div>
                ) }
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
                    <BarChart 
                        amnt={donationAmnt}
                        title={"Monthly Donation Amounts"}
                        label={"Donation Amount"}
                    />
                </div>
                <div className="shadow-md rounded-md p-4 border w-full md:w-[50%]" >
                    <PieChart
                        counts={donationCounts}
                        title={"Monthly Donation Counts"} 
                    />
                </div>
            </div>
            <h1 className="my-4 text-2xl font-serif font-bold uppercase" >Expenses</h1>
            <div className="flex flex-col lg:flex-row items-center gap-4 my-8 w-full" >
                <CardComponent 
                    total={income.toLocaleString("en-IN")}
                    label="Income"
                    compStyle="border-b border-orange-400"
                    IconComponent={FaRupeeSign}
                    progressColor={"#fb923c"}
                />
                <CardComponent 
                    total={expense.toLocaleString("en-IN")}
                    label="Expenses"
                    compStyle="border-b border-indigo-400"
                    IconComponent={FaRupeeSign}
                    progressColor={"#818cf8"}
                />
                <CardComponent 
                    total={totalExpenseCount}
                    label="Total Expenses"
                    compStyle="border-b border-red-400"
                    IconComponent={FaMoneyBillTrendUp}
                    progressColor={"#f87171"}
                />
                <CardComponent 
                    total={balance.toLocaleString("en-IN")}
                    label="Balance Available"
                    compStyle={balance > 0 ?`border-b border-green-400` : `border-b border-red-400` }
                    IconComponent={GiCash}
                    progressColor={balance > 0 ? "#4ade80" : "#f87171"}
                />
            </div>
            <div className="flex flex-col md:flex-row gap-4 my-4 p-4" >
                <div className="shadow-md rounded-md p-4 border w-full md:w-[50%]" >  
                    <BarChart 
                        amnt={expenseAmnt}
                        title={"Monthly Expense Amounts"}
                        label={"Expense Amount"}
                    />
                </div>
                <div className="shadow-md rounded-md p-4 border w-full md:w-[50%]" >
                    <PieChart
                        counts={expenseCounts} 
                        title={"Monthly Expense Counts"}
                    />
                </div>
            </div>
            <h1 className="my-4 text-2xl font-serif font-bold uppercase">Inventories</h1>
            <div className="flex flex-col lg:flex-row items-center gap-4 my-8 w-full">
                <CardComponent 
                    total={totalInventoryValue.toLocaleString("en-IN")}
                    label="Total Inventory Value"
                    compStyle="border-b border-orange-400"
                    IconComponent={FaBoxes}
                    progressColor={"#fb923c"}
                />
                <CardComponent 
                    total={lowStockItemsCount}
                    label="Low Stock Items"
                    compStyle="border-b border-yellow-400"
                    IconComponent={FaExclamationTriangle}
                    progressColor={"#facc15"}
                />
                <CardComponent 
                    total={outOfStockItemsCount}
                    label="Out of Stock Items"
                    compStyle="border-b border-red-400"
                    IconComponent={FaTimesCircle}
                    progressColor={"#f87171"}
                />
            </div>
            <div className="flex flex-col md:flex-row gap-4 my-4 p-4">
                <div className="shadow-md rounded-md p-4 border w-full md:w-[50%]">
                    <InventoryBarChart
                        data={inventoryQuantities}
                        title={"Inventory Quantity Breakdown"}
                        label={"Inventory Quantity"}
                    />
                </div>
                <div className="shadow-md rounded-md p-4 border w-full md:w-[50%]">
                    <InventoryPieChart
                        data={inventoryCategoryBreakdown}
                        title={"Inventory Category Breakdown"}
                    />
                </div>
            </div>
            <EditTemple 
               showModal={showModal}
               setShowModal={setShowModal}
               temple={temple}
               setIsTempleUpdted={setIsTempleUpdted}
            />
        </div>
        </>
    );
}