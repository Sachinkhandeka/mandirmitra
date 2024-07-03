import { Button } from "flowbite-react";
import brand from "../../assets/brand.jpg";
import { useNavigate } from "react-router-dom";

export default function LandingNavbar() {
    const  navigate =  useNavigate();

    const handleNavigate = ()=> {
        navigate("/login");
    }
  return (
    <nav className="bg-white shadow-md sticky top-0 z-10 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <a href="/landingpage" className="flex items-center">
            <img src={brand} className="mr-3 h-6 sm:h-9" alt="MandirMitra Logo" />
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">MandirMitra</span>
        </a>
        <Button color={"dark"} onClick={handleNavigate} >Get mandirmitra free</Button>
      </div>
    </nav>
  );
}
