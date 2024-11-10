import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import TempleCard from "./TempleCard";
import { Helmet } from "react-helmet-async"

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
        <>
            <Helmet>
                <title>Explore Temples | MandirMitra</title>
                <meta
                    name="description"
                    content="Discover a wide range of temples with MandirMitra. Connect with your favorite temples, view temple details, and learn about history, festivals, pujaris, managment, events and services."
                />
                <meta
                    name="keywords"
                    content="temples, MandirMitra, temple list, temple details, religious places, places of worship"
                />
                <meta property="og:title" content="Explore Temples | MandirMitra" />
                <meta property="og:description" content="Discover and connect with temples through MandirMitra. View details, events, and more." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.mandirmitra.co.in/" />
                <meta property="og:image" content="https://www.mandirmitra.co.in/images/temple-banner.jpg" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        "itemListElement": temples.map((temple, index) => ({
                            "@type": "ListItem",
                            "position": index + 1,
                            "url": `https://www.mandirmitra.co.in/temple/${temple._id}`,
                            "name": temple.name,
                            "description": temple.description || "Discover more about this temple on MandirMitra."
                        }))
                    })}
                </script>
            </Helmet>
            <section aria-labelledby="temple-listing"  className="my-4 p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6" >
                { temples && temples.length > 0 && temples.map(temple => (
                    <TempleCard temple={temple} key={temple._id} />
                )) }
            </section>
        </>
    );
}