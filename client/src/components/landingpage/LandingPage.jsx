import { Helmet } from 'react-helmet-async';
import FeatureSection from "./FeatureSection";
import Heading from "./Heading";
import HeroSection from "./HeroSection";
import GetStarted from "./GetStarted";
import LandingNavbar from "./LandingNavbar";
import Description from "./Description";

export default function LandingPage() {
    return (
        <>
            <Helmet>
                <title>MandirMitra - Comprehensive Temple Management System</title>
                <meta name="description" content="MandirMitra is a revolutionary temple management system designed to streamline and simplify the operations of temples. Our platform offers an all-in-one solution to manage donations, track expenses, organize events, and generate invitation PDFs for valuable donors. With features like role-based access, multi-login options including Google Auth and SMS, and a user-friendly interface, MandirMitra ensures efficient management of temple activities and worship services." />
                <meta name="keywords" content="mandir mitra, mandir, mandirmitra, temple management system, MandirMitra, donations management, expense tracking, event management, invitation generation, role-based access, Google Auth, SMS login, temple administration, temple software, Hindu temple management, religious organization software" />
                <meta name="author" content="MandirMitra Team" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta charSet="UTF-8" />
                <meta property="og:title" content="MandirMitra - Comprehensive Temple Management System" />
                <meta property="og:description" content="MandirMitra is a revolutionary temple management system designed to streamline and simplify the operations of temples. Our platform offers an all-in-one solution to manage donations, track expenses, organize events, and generate invitation PDFs for valuable donors. With features like role-based access, multi-login options including Google Auth and SMS, and a user-friendly interface, MandirMitra ensures efficient management of temple activities and worship services." />
                <meta property="og:url" content="https://www.mandirmitra.co.in/" />
            </Helmet>
            <div className="bg-white w-full">
                {/* Landing Navbar */}
                <LandingNavbar />
                {/* Header section */}
                <Heading />
                {/* Hero Section */}
                <HeroSection />
                {/* description section */}
                <Description />
                {/* Feature Section */}
                <FeatureSection />
                {/* Get Started Section */}
                <GetStarted />
            </div>
        </>
    );
}
