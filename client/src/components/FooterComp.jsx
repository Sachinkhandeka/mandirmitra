import { Footer } from "flowbite-react";
import { BsFacebook, BsInstagram, BsTwitter } from "react-icons/bs";
import { Helmet } from "react-helmet-async";

import brand from "../assets/brand.jpg";

export default function FooterComp() {
    return (
        <>
            <Helmet>
                <title>Footer - MandirMitra</title>
                <meta name="description" content="Connect with MandirMitra through our social media platforms and learn more about us, our privacy policy, and terms and conditions." />
            </Helmet>
            <Footer container className="z-50 sticky left-0 mt-6" >
                <div className="w-full">
                    <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
                        <div className=" object-cover rounded-md" >
                            <Footer.Brand
                                href="/"
                                src={brand}
                                alt="MandirMitra Logo"
                                name="MandirMitra"
                                className="rounded-md"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:gap-6">
                            <div>
                                <Footer.Title title="about" />
                                <Footer.LinkGroup col>
                                    <Footer.Link href="/?tab=about">About Us</Footer.Link>
                                </Footer.LinkGroup>
                            </div>
                            <div>
                                <Footer.Title title="Legal" />
                                <Footer.LinkGroup col>
                                    <Footer.Link href="/?tab=privacy">Privacy Policy</Footer.Link>
                                    <Footer.Link href="/?tab=terms">Terms &amp; Conditions</Footer.Link>
                                </Footer.LinkGroup>
                            </div>
                    </div>
                </div>
                    <Footer.Divider />
                    <div className="w-full sm:flex sm:items-center sm:justify-between">
                        <Footer.Copyright href="/" by="MandirMitra™" year={new Date().getFullYear()} />
                        <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
                            <Footer.Icon href="#" icon={BsFacebook} />
                            <Footer.Icon href="#" icon={BsInstagram} />
                            <Footer.Icon href="#" icon={BsTwitter} />
                        </div>
                    </div>
                </div>
            </Footer>
        </>
    );
}