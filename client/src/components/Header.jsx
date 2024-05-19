import { Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { GiByzantinTemple } from "react-icons/gi";
import { BsSearchHeart } from "react-icons/bs";
import { RxMoon,  RxSun } from "react-icons/rx";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { Link } from "react-router-dom";

import brand from "../assets/brand.jpg";

export default function Header() {
    const dispatch = useDispatch();
    const { theme } = useSelector(state => state.theme);
    return(
        <Navbar className="border border-b-2 sticky top-0 z-20" >
            <Link to={"/"} className="cursor-pointer">
                <img src={brand} alt="MandirMitra" className="w-8 h-8 rounded-full object-cover object-center border border-gray-300"/>
            </Link>
            <form>
                <div className="flex items-center gap-2" >
                    <TextInput 
                        type="text"
                        placeholder="Search."
                    />
                    <Button> <BsSearchHeart size={20} /> </Button>
                </div>
            </form>
            <div>
                <Button 
                   className="w-10 h-10" 
                   color={'gray'} 
                   pill 
                   onClick={()=> dispatch(toggleTheme())}>
                    { theme === 'light'? <RxMoon /> : <RxSun /> }
                </Button>
            </div>
        </Navbar>
    );
}