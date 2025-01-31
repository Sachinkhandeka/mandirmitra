import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import TempleCard from "./TempleCard";
import { Helmet } from "react-helmet-async"
import TempleCardSkeleton from "../skeletons/TempleCardSkeleton";

export default function TempleContent() {
    const { currUser } = useSelector( state => state.user );
    const [ temples, setTemples ] = useState([]);
    const [ alert, setAlert ] = useState({ type : "", message  : "" });
    const [ loading, setLoading ] = useState(false);

    const  getTemples = async()=> {
        setAlert({ type  : "", message : "" });
        setLoading(true);
        try {
            const  response = await fetch('/api/temple/all');
            const data = await response.json();

            if(!response.ok) {
                setAlert({ type : "error", message : data.message });
                return setLoading(false);
            }
            setTemples(data.temples);
            setLoading(false);
        }catch(err) {
            setAlert({ type : "error", message : err.message });
            setLoading(false);
        }
    }

    useEffect(()=>{
        getTemples();
    },[currUser]);
    return (
        <>
            <Helmet>
                <title>MandirMitra - Discover Temples Across India</title>
                <meta
                    name="description"
                    content="Discover a wide range of temples with MandirMitra. Connect with your favorite temples, view temple details, and learn about history, festivals, pujaris, managment, events and services."
                />
                <meta
                    name="keywords"
                    content="famous temples in India, temples near me, top 10 Hindu temples to visit in India, 
                    ancient temples in India, historical temples in India, Hindu temples with architectural significance, 
                    Shiva temples in India, Vishnu temples in India, famous South Indian temples, North Indian pilgrimage destinations, 
                    Char Dham Yatra guide, best time to visit Kedarnath, list of Jyotirlinga temples in India, 
                    festivals celebrated in Hindu temples, Hindu temple rituals explained, spiritual travel destinations in India, 
                    how to plan a temple tour in India, Hindu temples for meditation, top religious places for family trips, 
                    virtual darshan of famous temples, temple management software, temple donation management, temple event management, 
                    online donation platform for temples, mandir mitra, mandir management app, temple accounting software"
                />
                <meta property="og:title" content="Explore Temples | MandirMitra" />
                <meta property="og:description" content="Discover a wide range of temples with MandirMitra. Connect with your favorite temples, view temple details, and learn about history, festivals, pujaris, managment, events and services." />
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
            <section aria-labelledby="temple-listing"  className="my-4 min-h-screen p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6" >
                {loading
                    ? Array(8)
                        .fill(0)
                        .map((_, index) => <TempleCardSkeleton key={index} />)
                    : temples && temples.length > 0
                    ? temples.map((temple) => <TempleCard temple={temple} key={temple._id} />)
                    : <p className="text-center col-span-full text-gray-500">No temples found.</p>}
            </section>
        </>
    );
}