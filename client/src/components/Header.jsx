import { Button, Navbar, TextInput } from "flowbite-react";
import { GiByzantinTemple } from "react-icons/gi";
import { BsSearchHeart } from "react-icons/bs";
import { RxMoon,  RxSun } from "react-icons/rx";

export default function Header() {
    return(
        <Navbar className="border border-b-2" >
            <GiByzantinTemple size={26} />
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
                <Button className="w-10 h-10" color={'gray'} pill>
                    <RxMoon />
                </Button>
            </div>
        </Navbar>
    );
}