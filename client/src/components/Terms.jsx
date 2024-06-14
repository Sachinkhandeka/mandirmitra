import { Helmet } from "react-helmet-async";

export default function Terms() {
    return (
        <>
            <Helmet>
                <title>Terms and Conditions - MandirMitra</title>
                <meta name="description" content="Read the terms and conditions of MandirMitra that govern your use of our temple management solution. By accessing or using our platform, you agree to comply with these terms and conditions." />
                <meta name="keywords" content="terms and conditions, MandirMitra, temple management, platform usage" />
            </Helmet>
           <section className="min-h-screen" >
                <h1 className="text-2xl font-bold mb-6" >Terms and Conditions:</h1>
                <div className="flex flex-col gap-2 p-3" >
                    <h3 className="text-xl font-semibold" >Introduction:</h3>
                    <p>
                        Welcome to MandirMitra! These Terms and Conditions govern your use of our temple management solution. 
                        By accessing or using our platform, you agree to comply with these terms and conditions.
                    </p>
                </div>
                <div className="flex flex-col gap-2 mt-4 p-3" >
                    <h3 className="text-xl font-semibold" >Account Registration:</h3>
                    <p>
                        To access certain features of our platform, you may be required to register for an account. 
                        You agree to provide accurate and complete information when creating your account and to 
                        keep your account credentials confidential.
                    </p>
                </div>
                <div className="flex flex-col gap-2 mt-4 p-3" >
                    <h3 className="text-xl font-semibold" >User Responsibilities:</h3>
                    <p>
                        You are responsible for maintaining the security of your account and for all activities that occur 
                        under your account. You agree not to share your account credentials with any third parties or to 
                        use our platform for any unlawful or unauthorized purposes.
                    </p>
                </div>
                <div className="flex flex-col gap-2 mt-4 p-3" >
                    <h3 className="text-xl font-semibold" >Limitation of Liability:</h3>
                    <p>
                        In no event shall MandirMitra be liable for any indirect, incidental, special, or consequential 
                        damages arising out of or in connection with your use of our platform, even if we have been advised of the possibility of such damages.
                    </p>
                </div>
                <div className="flex flex-col gap-2 mt-4 p-3" >
                    <h3 className="text-xl font-semibold" >Changes to These Terms:</h3>
                    <p>
                        We reserve the right to modify or update these Terms and Conditions at any time without 
                        prior notice. Your continued use of our platform after any changes to these terms will 
                        constitute your acceptance of such changes.
                    </p>
                </div>
           </section>
        </>
    );
}