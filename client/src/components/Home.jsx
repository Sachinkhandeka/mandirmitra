import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Avatar } from "flowbite-react";

import "../App.css";

export default function Home() {
    const { currUser } = useSelector(state=> state.user);
    const [ temple, setTemple ] =  useState({});
    const [ loading ,  setLoading ] = useState(false);
    const [ error , setError ] =  useState(null);
    const [ success, setSuccess ] = useState(null);

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
    return (
        <div>  
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
        </div>
    )
}