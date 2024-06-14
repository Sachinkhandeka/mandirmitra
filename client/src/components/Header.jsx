import { Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { FaSearch } from "react-icons/fa";
import { RxMoon,  RxSun } from "react-icons/rx";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { setSearchTerm } from "../redux/search/searchSlice";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import brand from "../assets/brand.jpg";

export default function Header() {
    const dispatch = useDispatch();
    const { theme } = useSelector(state => state.theme);
    const { searchTerm } = useSelector(state => state.searchTerm);

    const handleSearchInputChange = (e) => {
        const searchTermValue = e.target.value ; 
        dispatch(setSearchTerm(searchTermValue));
        
    };

    return(
        <>
        <Helmet>
            <title>MandirMitra - Your Devotional Companion</title>
            <meta name="description" content="Find and explore various sections like donations, expesnes, and location-address content with MandirMitra. Search for your donations, expenses, Seva and more." />
            <meta name="keywords" content="temples, deities, Hinduism, search, MandirMitra, devotion, donation, expense, navbar, search" />
            <meta name="author" content="MandirMitra" />
        </Helmet>
        <Navbar className="border border-b-2 sticky top-0 z-20" >
            <Link to={"/"} className="cursor-pointer">
                <img src={brand} alt="MandirMitra" className="w-8 h-8 rounded-md object-cover object-center border border-gray-300"/>
            </Link>
            <form>
                <div className="flex items-center gap-2" >
                    <TextInput 
                        type="text"
                        placeholder="Search."
                        value={searchTerm}
                        onChange={handleSearchInputChange}
                        rightIcon={FaSearch}
                    />
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
        </>
    );
}