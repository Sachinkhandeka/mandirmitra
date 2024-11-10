import { Footer } from "flowbite-react";
import { BsFacebook, BsInstagram, BsLinkedin, BsTwitterX  } from "react-icons/bs";
import TempleContent from "./TempleContent";
import TempleHeader from "./TempleHeader";

export default function TempleList() {
    return(
        <>
            <section className="min-h-screen text-black" >
                <TempleHeader />
                <TempleContent />
                <Footer container>
                    <Footer.Copyright href="/" by="mandirmitra™" year={2024} className="my-4" />
                    <div className="mt-4 flex gap-2 space-x-6 sm:mt-0 sm:justify-center">
                        <Footer.Icon href=" https://www.facebook.com/profile.php?id=61561382858176&mibextid=ZbWKwL" icon={BsFacebook} target="_blank" rel="noopener noreferrer" />
                        <Footer.Icon href="https://www.instagram.com/mandirmitra/" icon={BsInstagram} target="_blank" rel="noopener noreferrer" />
                        <Footer.Icon href="https://www.linkedin.com/in/mandir-mitra/" icon={BsLinkedin} target="_blank" rel="noopener noreferrer" />
                        <Footer.Icon href="https://x.com/MandirMitra" icon={BsTwitterX} target="_blank" rel="noopener noreferrer" />
                    </div>
                </Footer>
            </section>
        </>
    );
}