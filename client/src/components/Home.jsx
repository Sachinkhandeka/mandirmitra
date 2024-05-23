import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Avatar } from "flowbite-react";
import { IoIosArrowUp, IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { FaUsers, FaIdCard } from "react-icons/fa6";
import { FaRupeeSign } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { GiCash } from "react-icons/gi";

import "../App.css";
import BarChart from "./BarChart";
import CardComponent from "./CardComponent";
import PieChart from "./PieChart";
import EventCard from "./EventCard";

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
    const [events, setEvents] = useState([]);

    const scrollRef = useRef(null);

    const scrollLeft = () => {
        scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    };

    const scrollRight = () => {
        scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    };

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
            setExpenseAmnt(data.expenseData);
            setDonationCounts(data.donationCounts);
            setExpenseCounts(data.expenseCounts);
            setTotalDonationCount(data.totalDonationCount);
            setTotalExpenseCount(data.totalExpenseCount);
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

    //get events
    const getEvents = async()=> {
        try {
            const response = await fetch(`/api/event/get/${currUser.templeId}`);
            const data = await response.json();

            if(!response.ok) {
                return console.log(data.message);
            }

            setEvents(data.events);
        }catch(err) {
            console.log(err.message);
        }
    }

    useEffect(()=>{
        getEvents();
    },[currUser]);
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
            { events && events.length > 0 && (
            <div>
                <h1 className="my-4 text-2xl font-serif font-bold uppercase">Events</h1>
                <div className="relative">
                    <IoIosArrowBack
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 cursor-pointer border border-slate-500 rounded-full p-2 hover:shadow-lg"
                        size={36}
                        onClick={scrollLeft}
                    />
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-scroll space-x-4"
                    >
                        {events && events.map(event => (
                            <EventCard
                                key={event._id}
                                id={event._id}
                                name={event.name}
                                date={event.date}
                                location={event.location}
                                status={event.status}
                            />
                        ))}
                    </div>
                    <IoIosArrowForward
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer border border-slate-500 rounded-full p-2 hover:shadow-lg"
                        size={36}
                        onClick={scrollRight}
                    />
                </div>
            </div>
            ) }
        </div>
    );
}