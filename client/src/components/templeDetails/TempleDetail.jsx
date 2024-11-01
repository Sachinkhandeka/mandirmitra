import { useParams } from "react-router-dom";
import TempleHeader from "./TempleHeader";
import { useEffect, useState } from "react";
import TempleDetailsSection from "./TempleDetailsSection";
import FooterComp from "../FooterComp";
import { Footer } from "flowbite-react";

export default function TempleDetail() {
    const { id } = useParams();
    const [ temple, setTemple ] = useState(null);
    const [ alert, ssetAlert ] = useState({ type : "", message : "" });

    const fetchTemple = async()=> {
        try {
            const response = await fetch(`/api/temple/${id}`);
            const data = await response.json();
            if(!response.ok) {
                return ssetAlert({ type : "error", message : data.message });
            }
            setTemple(data.temple);
        }catch(err){
            ssetAlert({ type : "error", message : err.message });
        }
    }
    
    useEffect(()=>{
        if(id) fetchTemple();
    },[id]);
    return (
        <section className="min-h-screen text-black" >
            <TempleHeader />
            { temple && <TempleDetailsSection temple={temple} /> }
            <Footer container>
                <Footer.Copyright href="/" by="mandirmitra™" year={2022} />
            </Footer>
        </section>
    );
}