import { useParams } from "react-router-dom";
import TempleHeader from "./TempleHeader";
import { useEffect, useState } from "react";
import TempleDescription from "./TempleDescription";
import { BsFacebook, BsInstagram, BsLinkedin, BsTwitterX  } from "react-icons/bs";
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
            { temple && <TempleDescription temple={temple} setTemple={setTemple} /> }
            <Footer container>
                <Footer.Copyright href="/" by="mandirmitra™" year={2024} className="my-4" />
                <div className="mt-4 flex gap-2 space-x-6 sm:mt-0 sm:justify-center">
                    <Footer.Icon href=" https://www.facebook.com/profile.php?id=61561382858176&mibextid=ZbWKwL" icon={BsFacebook} target="_blank" rel="noopener noreferrer" />
                    <Footer.Icon href="https://www.instagram.com/mandirmitra/" icon={BsInstagram} target="_blank" rel="noopener noreferrer" />
                    <Footer.Icon href="https://www.linkedin.com/in/mandir-mitra/" icon={BsLinkedin} target="_blank" rel="noopener noreferrer" />
                    <Footer.Icon href="https://x.com/MandirMitra" icon={BsTwitterX} target="_blank" rel="noopener noreferrer" />
                </div>
            </Footer>
        </section>
    );
}