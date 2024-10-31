import FooterComp from "../FooterComp";
import TempleContent from "./TempleContent";
import TempleHeader from "./TempleHeader";

export default function TempleList() {
    return(
        <>
            <section className="min-h-screen text-black" >
                <TempleHeader />
                <TempleContent />
                <FooterComp />
            </section>
        </>
    );
}