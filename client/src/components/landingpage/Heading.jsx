import { Button } from "flowbite-react";
import { FaUsers, FaDonate, FaAddressCard, FaEdit } from "react-icons/fa";
import { FaMoneyBillTrendUp, FaMapLocationDot } from "react-icons/fa6";
import { SiEventbrite } from "react-icons/si";
import { RiHandHeartFill } from "react-icons/ri";
import illustration_one from "../../assets/illustration_one.png";

export default function Heading() {
    return (
        <header className="bg-white text-black p-4 text-center mt-10 font-sans">
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-serif font-bold mx-10" data-aos="fade-down">Aapka Mandir Management, Hamari Zimmedari</h1>
            <p className="text-sm lg:text-lg my-4" data-aos="fade-right">Ek hi system mein, sab kuch manage karein - daan, kharch, inventory aur events!</p>
            <a href="/login" className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-700 text-white font-bold" >Register Mandir</a>
            <img src={illustration_one} alt="people_illustration_image" className="w-72 h-42 mx-auto my-4" data-aos="flip-left" data-aos-easing="ease-out-cubic" data-aos-duration="2000" />
            <div className="flex items-center justify-center relative w-64 h-64 mx-auto mt-10 rounded-full border-2 border-gray-400" data-aos="flip-left" data-aos-easing="ease-out-cubic" data-aos-duration="2000">
                <FaDonate className="absolute top-[-1rem] left-1/2 transform -translate-x-1/2 text-3xl" />
                <FaMoneyBillTrendUp className="absolute top-1/4 right-[0.5rem] transform translate-x-1/2 text-3xl" />
                <SiEventbrite className="absolute bottom-1/4 right-[0.5rem] transform translate-x-1/2 text-3xl" />
                <FaUsers className="absolute bottom-[-1rem] left-1/2 transform -translate-x-1/2 text-3xl" />
                <FaAddressCard className="absolute bottom-1/4 left-[0.5rem] transform -translate-x-1/2 text-3xl" />
                <FaEdit className="absolute top-1/4 left-[0.5rem] transform -translate-x-1/2 text-3xl" />
                <RiHandHeartFill className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl" />
            </div>
        </header>

    );
}