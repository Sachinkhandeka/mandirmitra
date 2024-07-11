import { FaUser, FaSignOutAlt, FaUsers, FaDonate, FaAddressCard, FaEdit, FaLuggageCart } from "react-icons/fa";
import { FaMoneyBillTrendUp, FaMapLocationDot  } from "react-icons/fa6";
import { SiEventbrite } from "react-icons/si";
import { RiHandHeartFill } from "react-icons/ri";
import DescriptionCard from "./DescriptionCard";
import { useState } from "react";
import { DashImage } from "./DashImage";
import DashDescription from "./DashDescription";

export default function description() {
    const [ selectedService, setSelectedService ] = useState("Donations");

    const  services = [
        { title : "Donations", icon : <FaDonate />, styles:"text-yellow-300" },
        { title : "Expenses", icon:<FaMoneyBillTrendUp />, styles:"text-green-300" },
        { title : "Events", icon: <SiEventbrite />, styles:"text-orange-300" },
        { title : "Inventories",  icon: <FaLuggageCart />, styles:"text-indigo-300" }
    ]; 

    const handleServiceClick = (title)=> {
        setSelectedService(title);
    }

    const handleCarouselChange = (direction) => {
        const currentIndex = services.findIndex(service => service.title === selectedService);
        let newIndex;

        if (direction === 'left') {
            newIndex = (currentIndex === 0) ? services.length - 1 : currentIndex - 1;
        } else if (direction === 'right') {
            newIndex = (currentIndex === services.length - 1) ? 0 : currentIndex + 1;
        }

        setSelectedService(services[newIndex].title);
    };
    return (
        <section className="my-auto p-2" >
            <p className="text-3xl font-bold italic text-black text-center my-4" data-aos="zoom-in-left" data-aos-duration="3000">Services We Offer</p>
            <div className="scrollbar-hidden overflow-x-scroll md:mx-auto sm:max-w-[80%]" >
                <div className="flex gap-8 items-center justify-center" data-aos="zoom-in-right" data-aos-duration="3000" >
                    { services.map(service=> (
                        <DescriptionCard 
                            key={service.title}
                            title={service.title}
                            icon={service.icon}
                            styles={service.styles}
                            onClick={()=> handleServiceClick(service.title)}
                            isSelected={selectedService === service.title}
                        />
                    )) }
                </div>
            </div>
            <DashImage 
                selectedService={selectedService}
                services={services}
                handleCarouselChange={handleCarouselChange}
            />
            <div data-aos="flip-up" data-aos-duration="3000" >
                <DashDescription 
                    selectedService={selectedService}
                />
            </div>
        </section>
    );
}