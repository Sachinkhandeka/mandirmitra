import { Footer } from "flowbite-react";
import FooterComp from "../FooterComp";
import TempleContent from "./TempleContent";
import TempleHeader from "./TempleHeader";

export default function TempleList() {
    return(
        <>
            <section className="min-h-screen text-black" >
                <TempleHeader />
                <TempleContent />
                <Footer container className="text-center" >
                    <Footer.Copyright href="/" by="mandirmitra™" year={2022} />
                </Footer>
            </section>
        </>
    );
}