export default function PrivacyPolicy() {
    return (
        <>
           <div>
                <h1 className="text-2xl font-bold mb-6" >Privacy Policy:</h1>
                <div className="flex flex-col gap-6" >
                    <h3 className="text-xl font-semibold" >Introduction:</h3>
                    <p>
                        Welcome to MandirMitra! We are committed to protecting your privacy 
                        and ensuring the security of your personal information. This Privacy Policy 
                        outlines how we collect, use, and safeguard your data when you use our temple 
                        management solution.
                    </p>
                </div>
                <div className="flex flex-col mt-3" >
                    <h3 className="text-xl font-semibold" >Information We Collect:</h3>
                    <ul className="p-4" >
                        <li className="mt-2" >
                            <span className="font-bold" >Personal Information : </span>
                            When you register as a user or temple administrator, we may collect personal 
                            information such as your name, email address, and contact details to create 
                            and manage your account.
                        </li>
                        <li className="mt-2" >
                            <span className="font-bold" >Donation and Expense Data:</span>
                            We collect and store information about donations, expenses, 
                            and financial transactions made through our platform to 
                            facilitate temple management and reporting.
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col mt-3" >
                    <h3 className="text-xl font-semibold" >How We Use Your Information : </h3>
                    <ul className="p-4" >
                        <li className="mt-2" >
                            <span className="font-bold" >Account Management : </span>
                            We use your personal information to create and manage your account, 
                            provide customer support, and communicate with you about your 
                            account and our services.
                        </li>
                        <li className="mt-2" >
                            <span className="font-bold" >Data Analysis : </span>
                            We analyze donation and expense data to generate insights and 
                            reports that help temples manage their finances more effectively.
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col gap-2" >
                    <h3 className="text-xl font-semibold" >Data Security : </h3>
                    <p>
                        We implement industry-standard security measures to protect your personal information 
                        from unauthorized access, alteration, disclosure, or destruction. We use encryption, 
                        firewalls, and other security technologies to safeguard your data.
                    </p>
                </div>
                <div className="flex flex-col gap-2 mt-4" >
                    <h3 className="text-xl font-semibold" >Third-Party Disclosure : </h3>
                    <p>
                        We do not sell, trade, or otherwise transfer your personal information 
                        to third parties without your consent, except as required by law or as 
                        necessary to provide our services.
                    </p>
                </div>
                <div className="flex flex-col gap-2 mt-4" >
                    <h3 className="text-xl font-semibold" >Changes to This Policy : </h3>
                    <p>
                        We may update this Privacy Policy from time to time to reflect changes in 
                        our practices or legal requirements. We will notify you of any material 
                        changes by posting the updated policy on our website.
                    </p>
                </div>
                <div className="flex flex-col gap-2 mt-4" >
                    <h3 className="text-xl font-semibold" >Contact Us : </h3>
                    <p>
                        If you have any questions or concerns about our Privacy Policy or the 
                        use of your personal information, please contact us at <a href="#">khandekasachin271@gmail.com</a>.
                    </p>
                </div>
           </div>
        </>
    );
}