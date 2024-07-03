import dashboardSite from "../../assets/dashboardSite.png";
import mobileSite from "../../assets/mobileSite.jpg";

export default function HeroSection() {
  return (
    <section className="bg-white p-4 text-center text-black overflow-hidden w-full">
        <div className="flex items-center justify-center flex-col lg:flex-row lg:gap-10 md:pl-[10%] w-full">
            <div className="mb-10" data-aos="zoom-in-down">
                <div className="relative mx-auto border-gray-800 bg-gray-800 border-[8px] rounded-t-xl h-auto max-w-full md:max-w-[512px]">
                    <div className="rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                        <img src={dashboardSite} className="dark:hidden w-full h-auto rounded-lg" alt="desktop_site_view" />
                        <img src={dashboardSite} className="hidden dark:block w-full h-auto rounded-lg" alt="desktop_site_view" />
                    </div>
                </div>
                <div className="relative mx-auto bg-gray-900 rounded-b-xl rounded-t-sm h-4 md:h-6 max-w-full md:max-w-[597px]">
                    <div className="absolute left-1/2 top-0 transform -translate-x-1/2 rounded-b-xl w-14 h-1 md:w-24 md:h-2 bg-gray-800"></div>
                </div>
            </div>
            <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-auto w-auto max-w-[13rem] mb-10" data-aos="flip-left" data-aos-easing="ease-out-cubic" data-aos-duration="2000">
                <div className="h-8 w-1 bg-gray-800 dark:bg-gray-800 absolute -left-4 top-18 rounded-l-lg"></div>
                <div className="h-12 w-1 bg-gray-800 dark:bg-gray-800 absolute -left-4 top-32 rounded-l-lg"></div>
                <div className="h-12 w-1 bg-gray-800 dark:bg-gray-800 absolute -left-4 top-44 rounded-l-lg"></div>
                <div className="h-16 w-1 bg-gray-800 dark:bg-gray-800 absolute -right-4 top-36 rounded-r-lg"></div>
                <div className="rounded-[2rem] overflow-hidden bg-white dark:bg-gray-800">
                    <img src={mobileSite} className="dark:hidden w-full h-auto" alt="mobile_site_view" />
                    <img src={mobileSite} className="hidden dark:block w-full h-auto" alt="mobile_site_view" />
                </div>
            </div>
        </div>
        <h2 className="text-4xl text-center font-serif font-semibold my-10" data-aos="zoom-in-right">Affordable Temple Management System for All Mandirs</h2>
        <p className="mb-4 text-xl text-center" data-aos="zoom-in-left">Har Mandir ka apna management system, bina zyada kharch ke!</p>
    </section>
  );
}
