import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import TempleCard from "./TempleCard";

export default function TempleContent() {
    const { currUser } = useSelector( state => state.user );
    const [ temples, setTemples ] = useState([]);
    const [ alert, setAlert ] = useState({ type : "", message  : "" });

    const  getTemples = async()=> {
        try {
            const  response = await fetch('/api/temple/all');
            const data = await response.json();

            if(!response.ok) {
                setAlert({ type : "error", message : data.message });
            }
            setTemples(data.temples);
        }catch(err) {
            setAlert({ type : "error", message : err.message });
        }
    }

    useEffect(()=>{
        getTemples();
    },[currUser]);
    return (
        <section className="my-4 p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6" >
            { temples && temples.length > 0 && temples.map(temple => (
                <TempleCard temple={temple} key={temple._id} />
            )) }
        </section>
    );
}