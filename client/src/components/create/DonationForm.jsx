import { useEffect, useState, useCallback } from "react";
import { Button, Label, Select, Spinner, TextInput, Toast } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";
import { FcDonate } from "react-icons/fc";
import { FaFilePdf } from "react-icons/fa6";
import { MdOutlineWaterDrop } from "react-icons/md";
import { useSelector } from "react-redux";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Helmet } from "react-helmet-async";
import Receipt from "../../pdf/Receipt";
import AddressForm from "../AddressForm";

export default function DonationForm({ locationAdded, sevaUpdated, setSevaUpdated }) {
    const [selectedCountry, setSelectedCountry] = useState({});
    const [selectedState, setSelectedState] = useState({});
    const [selectedDistrict, setSelectedDistrict] = useState({});
    const [selectedTehsil, setSelectedTehsil] = useState({});
    const [selectedVillage, setSelectedVillage] = useState({});
    const [seva, setSeva] = useState([]);
    const { currUser } = useSelector((state) => state.user);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [donation, setDonation] = useState({
        donorName: "",
        sevaName: "",
        country: "",
        state: "",
        district: "",
        tehsil: "",
        village: "",
        contactInfo: "",
        paymentMethod: "cash",
        donationAmount: "",
    });
    const [receiptData, setReceiptData] = useState({});

    const getSeva = useCallback(async () => {
        try {
            const response = await fetch(`/api/seva/get/${currUser.templeId}`);
            const data = await response.json();

            if (!response.ok) {
                return setError(data.message);
            }
            setSeva(data.seva);
        } catch (err) {
            setError(err.message);
        }
    }, [currUser.templeId]);

    useEffect(() => {
        getSeva();
    }, [getSeva]);

    useEffect(() => {
        if (sevaUpdated) {
            getSeva();
            setSevaUpdated(false);
        }
    }, [sevaUpdated, getSeva, setSevaUpdated]);

    const handleChange = useCallback((e) => {
        const { value, id } = e.target;
        const selectedOption = e.target.options ? e.target.options[e.target.selectedIndex] : null;

        if (selectedOption) {
            const text = selectedOption.text;
            switch (id) {
                case "country":
                    setSelectedCountry(value);
                    setDonation((prevDonation) => ({ ...prevDonation, [id]: text }));
                    break;
                case "state":
                    setSelectedState(value);
                    setDonation((prevDonation) => ({ ...prevDonation, [id]: text }));
                    break;
                case "district":
                    setSelectedDistrict(value);
                    setDonation((prevDonation) => ({ ...prevDonation, [id]: text }));
                    break;
                case "tehsil":
                    setSelectedTehsil(value);
                    setDonation((prevDonation) => ({ ...prevDonation, [id]: text }));
                    break;
                case "village":
                    setSelectedVillage(value);
                    setDonation((prevDonation) => ({ ...prevDonation, [id]: text }));
                    break;
                default:
                    setDonation((prevDonation) => ({ ...prevDonation, [id]: value }));
            }
        } else {
            setDonation((prevDonation) => ({ ...prevDonation, [id]: value }));
        }
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const response = await fetch(`/api/donation/create/${currUser.templeId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(donation),
            });
            const data = await response.json();

            if (!response.ok) {
                setLoading(false);
                return setError(data.message);
            }

            setLoading(false);
            setSuccess("Donation added successfully.");
            setReceiptData(data.newDaan);
            setDonation({
                donorName: "",
                sevaName: "",
                country: "",
                state: "",
                district: "",
                tehsil: "",
                village: "",
                contactInfo: "",
                paymentMethod: "cash",
                donationAmount: "",
            });
            setSelectedCountry({});
            setSelectedState({});
            setSelectedDistrict({});
            setSelectedTehsil({});
            setSelectedVillage({});
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }, [currUser.templeId, donation]);

    return (
        <div className="w-full flex flex-col md:flex-row gap-4 border-2 border-gray-300 dark:border-gray-700 rounded-md my-10 relative">
            <Helmet>
                <title>Add Donation - MandirMitra</title>
                <meta name="description" content="Add a new donation to MandirMitra. Fill out donor details, select Seva, and enter donation amount." />
                <meta name="keywords" content="MandirMitra, Donation, Seva, Temple Donation" />
            </Helmet>
            <div
                className="min-h-20 md:min-h-full w-full md:w-40 flex md:flex-col 
                justify-around items-center bg-gradient-to-bl from-blue-600 to-blue-300 
                dark:bg-gradient-to-bl dark:from-gray-600 dark:to-gray-800 rounded-tr-md 
                md:rounded-tr-none rounded-tl-md md:rounded-bl-md"
            >
                <div>
                    <FcDonate size={30} />
                </div>
                <div>
                    <MdOutlineWaterDrop size={30} />
                </div>
                <div>
                    <FcDonate size={30} />
                </div>
            </div>
            <div className="flex-1 p-4 md:p-10">
                <h2 className="text-blue-400 dark:text-white font-mono uppercase font-bold p-2 mb-4 text-3xl">Add Donation</h2>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row flex-wrap gap-4">
                        <div className="flex-1 flex flex-col gap-4">
                            <Label htmlFor="donorName">Name of Donor</Label>
                            <TextInput id="donorName" name="donorName" placeholder="@firstName @lastName" onChange={handleChange} value={donation.donorName} />
                        </div>
                        <div className="flex-1 flex flex-col gap-4">
                            <Label htmlFor="sevaName">Name of Seva</Label>
                            <Select id="sevaName" name="sevaName" onChange={handleChange} value={donation.sevaName}>
                                <option value="" disabled>Select Seva</option>
                                {seva.map((item) => (
                                    <option key={item._id} value={item.sevaName}>
                                        {item.sevaName}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <h2 className="my-3 font-bold">Address</h2>
                    <AddressForm
                        selectedCountry={selectedCountry}
                        selectedState={selectedState}
                        selectedDistrict={selectedDistrict}
                        selectedTehsil={selectedTehsil}
                        selectedVillage={selectedVillage}
                        currUser={currUser}
                        locationAdded={locationAdded}
                        handleChange={handleChange}
                    />
                    <div className="flex flex-col md:flex-row flex-wrap gap-4 my-8">
                        <div className="flex-1 flex flex-col gap-4">
                            <Label htmlFor="contactInfo">Add Contact Info</Label>
                            <TextInput id="contactInfo" name="contactInfo" placeholder="Mo. 7834XXXXXX" onChange={handleChange} value={donation.contactInfo} />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row flex-wrap gap-4">
                        <div className="flex-1 flex flex-col gap-4">
                            <Label htmlFor="paymentMethod">Payment Method</Label>
                            <Select id="paymentMethod" onChange={handleChange} value={donation.paymentMethod}>
                                <option value="select" disabled>Select</option>
                                <option value="cash">Cash</option>
                                <option value="bank">Bank</option>
                                <option value="upi">UPI</option>
                            </Select>
                        </div>
                        <div className="flex-1 flex flex-col gap-4">
                            <Label htmlFor="donationAmount">Donation Amount</Label>
                            <TextInput type="number" id="donationAmount" name="donationAmount" placeholder="Rs. 2300" onChange={handleChange} value={donation.donationAmount} />
                        </div>
                    </div>
                    <div className="flex flex-row-reverse my-4 gap-3">
                        <Button gradientMonochrome={"cyan"} pill disabled={loading} onClick={handleSubmit}>
                            {loading ? <Spinner color="info" /> : 'Add Donation'}
                        </Button>
                        {receiptData && Object.keys(receiptData).length > 0 && (
                            <PDFDownloadLink
                                document={<Receipt receiptData={receiptData} />}
                                fileName='Donation.pdf'
                            >
                                {({ loading }) => (
                                    <Button color="failure" pill disabled={loading}>
                                        {loading ? 'Loading document...' : 'Receipt'}
                                        <FaFilePdf className="ml-2 h-5 w-5" />
                                    </Button>
                                )}
                            </PDFDownloadLink>
                        )}
                    </div>
                </form>
            </div>
            {success && (
                <Toast className="fixed bottom-4 right-4 z-50">
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                        <HiCheck className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm font-normal">{success}</div>
                    <Toast.Toggle />
                </Toast>
            )}
            {error && (
                <Toast className="fixed bottom-4 right-4 z-40">
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                        <HiX className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm font-normal">{error}</div>
                    <Toast.Toggle />
                </Toast>
            )}
        </div>
    );
}
