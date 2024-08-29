import illustration_two from "../../assets/illustration_two.png";

export  default function GetStarted() {
    return (
        <section  className="flex items-center justify-center flex-col mt-8 text-black" data-aos="flip-left" data-aos-easing="ease-out-cubic" data-aos-duration="3000" >
            <h1 className="text-2xl md:text-6xl font-bold font-sans text-black my-6" >Get started for free</h1>
            <p className="text-center px-4" >Shuruat karein abhi, aur apne mandir ka management aasan banayein. Team ko baad mein add karein!</p>
            <a href="/login" className="px-4 py-2 bg-black hover:opacity-80 rounded-lg text-white font-bold my-10" >Try Mandirmitra free</a>
            <div className="my-10" >
                <img src={illustration_two} alt="illustration_image" className="w-72 h-60" />
            </div>
        </section>
    );
}