import { FaGoogle, FaUser, FaLock, FaCalendarAlt, FaFilePdf, FaUserShield, FaDonate, FaLuggageCart  } from 'react-icons/fa';
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import FeatureCard from './FeatureCard';

export  default function FeatureSection() {
    return (
        <section className="p-8 bg-white text-center">
            <h3 className="text-2xl font-semibold mb-6 text-black font-serif" data-aos="flip-left" data-aos-duration="3000">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard icon={<FaDonate />} title="Daan Management" description="Sabhi daanon ka record rakhein aur receipts generate karein." style={"bg-yellow-300"} />
                <FeatureCard icon={<FaMoneyBillTrendUp />} title="Kharch Ka Hisaab" description="Mandir ke sabhi kharchon ko manage karein." style={"bg-green-300"} />
                <FeatureCard icon={<FaCalendarAlt />} title="Events Management" description="Sabhi events ka management, passcode ke sath." style={"bg-orange-300"} />
                <FeatureCard icon={<FaLuggageCart />} title="Inventories Management" description="Mandir ke inventory(Saamagri Prabandhan) items ko track aur manage karein." style={"bg-indigo-300"}/>
                <FeatureCard icon={<FaFilePdf />} title="Invitation PDF Generation" description="Vishisht donors ke liye personalized invitation PDFs banayein." style={"bg-blue-300"}/>
                <FeatureCard icon={<FaUser />} title="Devi-Devta Management" description="Apne mandir ke sabhi devi-devtaon ko add karein." style={"bg-red-300"}/>
                <FeatureCard icon={<FaUserShield />} title="Role-Based Access" description="Alag-alag users ke liye alag-alag access rights." style={"bg-teal-300"}/>
                <FeatureCard icon={<FaGoogle />} title="Multiple Login Options" description="Google Auth, phone SMS using Firebase, aur normal login available." style={"bg-purple-300"}/>
            </div>
        </section>
    );
}