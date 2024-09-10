import { Helmet } from "react-helmet-async";

export default function GodCard({ godsAndGoddesses }) {
    // Function to get a random gradient color
    function getRandomGradient() {
        const gradients = [
            "from-blue-300 to-indigo-500",
            "from-purple-400 to-pink-500",
            "from-yellow-400 to-orange-500",
            "from-green-400 to-teal-500",
            "from-red-400 to-pink-500",
            "from-indigo-400 to-purple-500",
            "from-pink-400 to-rose-500",
            "from-orange-400 to-yellow-500",
            "from-teal-400 to-cyan-500",
            "from-rose-400 to-red-500"
        ];
        return gradients[Math.floor(Math.random() * gradients.length)];
    }

    return (
        <>
        <Helmet>
            <meta name="description" content="Explore the diverse and rich collection of Devi-Devta and Sant-Mahant images and information." />
            <meta name="keywords" content="Devi, Devta, Sant, Mahant, Gods, Goddesses, Hinduism, MandirMitra" />
            <meta name="author" content="MandirMitra" />
        </Helmet>
        <h2 className="text-xl font-serif uppercase font-semibold my-4" >Analytical Page - mandirmitra</h2>
        <div className="flex overflow-x-auto scrollbar-hidden">
            <div className="my-2 flex gap-4">
                {godsAndGoddesses.map((god, index) => (
                    <div
                        key={index}
                        className={`bg-white rounded-lg w-24 md:w-44 shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105`}
                    >
                        <div className="w-full h-24 md:h-40 object-cover relative">
                            <img src={god.image} alt={god.name} className="w-full h-full object-cover" />
                        </div>
                        <div className={`h-full text-center px-4 py-2 bg-gradient-to-r ${getRandomGradient()}`}>
                            <h3 className="text-sm mb-2">{god.name}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
};
