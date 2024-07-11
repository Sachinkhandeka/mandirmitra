import { Carousel } from "flowbite-react";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";

import Donations from "../../assets/Donations.png";
import Expenses from "../../assets/Expenses.png";
import Events from  "../../assets/Events.png";
import Inventories from "../../assets/Inventories.png";

export function DashImage({ selectedService, services, handleCarouselChange }) {
    const images = {
        Donations,
        Expenses,
        Events,
        Inventories
    };

  return (
        <div className="h-48 md:h-80 lg:h-96 w-full md:w-[70%] mx-auto my-4 border border-slate-200 bg-gray-300 shadow-md rounded-lg" 
            data-aos="fade-up"
            data-aos-duration="3000"
        >
            <Carousel 
                slide={false}
                leftControl={<CiCircleChevLeft size={34} onClick={()=> handleCarouselChange("left")} />} 
                rightControl={<CiCircleChevRight size={34} onClick={()=> handleCarouselChange("right")} />} 
            >
                {services.map(service => (
                    <img
                        key={service.title}
                        src={images[selectedService]}
                        alt={service.title}
                        className="object-contain h-full"
                    />
                ))}
            </Carousel>
        </div>
    );
}
