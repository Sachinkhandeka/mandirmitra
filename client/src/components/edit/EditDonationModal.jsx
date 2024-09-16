import { useEffect, useState, useCallback } from "react";
import { Button, Label, Select, Spinner, TextInput, Modal } from "flowbite-react";
import { TbCoinRupee } from "react-icons/tb";
import { IoManSharp } from "react-icons/io5";
import { FiMapPin } from "react-icons/fi";
import { FaHandHoldingHeart, FaDonate } from "react-icons/fa";
import { MdOutlineWaterDrop, MdOutlineContactPhone, MdPayment } from "react-icons/md";
import { FaFilePdf } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Helmet } from "react-helmet-async";
import Receipt from "../../pdf/Receipt";
import AddressForm from "../AddressForm";
import Alert from "../Alert";

export default function EditDonationModal({ showEditModal, setShowEditModal, donation, setIsDonationUpdated }) {
    const [selectedCountry, setSelectedCountry] = useState({});
    const [selectedState, setSelectedState] = useState({});
    const [selectedDistrict, setSelectedDistrict] = useState({});
    const [selectedTehsil, setSelectedTehsil] = useState({});
    const [selectedVillage, setSelectedVillage] = useState({});
    const [seva, setSeva] = useState([]);
    const { currUser } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [formData, setFormData] = useState({
        donorName: "",
        sevaName: "",
        country: "",
        state: "",
        district: "",
        tehsil: "",
        village: "",
        contactInfo: 0,
        paymentMethod: "cash",
        donationAmount: 0,
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
        if (donation) {
            setFormData({
                donorName: donation.donorName || "",
                sevaName: donation.sevaName || "",
                country: donation.country || "",
                state: donation.state || "",
                district: donation.district || "",
                tehsil: donation.tehsil || "",
                village: donation.village || "",
                contactInfo: donation.contactInfo || 0,
                paymentMethod: donation.paymentMethod || "cash",
                donationAmount: donation.donationAmount || 0,
            });
        }
    }, [donation]);

    const handleChange = (e) => {
        const { value, id } = e.target;
        const selectedOption = e.target.options ? e.target.options[e.target.selectedIndex] : null;

        if (selectedOption) {
            if (id === "country") {
                setSelectedCountry(value);
                setFormData({
                    ...formData,
                    [id]: selectedOption.text,
                });
            } else if (id === "state") {
                setSelectedState(value);
                setFormData({
                    ...formData,
                    [id]: selectedOption.text,
                });
            } else if (id === "district") {
                setSelectedDistrict(value);
                setFormData({
                    ...formData,
                    [id]: selectedOption.text,
                });
            } else if (id === "tehsil") {
                setSelectedTehsil(value);
                setFormData({
                    ...formData,
                    [id]: selectedOption.text,
                });
            } else if (id === "village") {
                setSelectedVillage(value);
                setFormData({
                    ...formData,
                    [id]: selectedOption.text,
                });
            }
        } else {
            setFormData({
                ...formData,
                [id]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const response = await fetch(
                `/api/donation/edit/${currUser.templeId}/${donation._id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );
            const data = await response.json();

            if (!response.ok) {
                setLoading(false);
                return setError(data.message);
            }
            setLoading(false);
            setIsDonationUpdated(true);
            setSuccess("Donation updated successfully.");
            setReceiptData(data.updatedDonation);
        } catch (err) {
            setError(err.message);
        }
    };
    return (
        <>
            <Helmet>
                <title>Edit Donation - Temple Management</title>
                <meta name="description" content="Edit a donation record in the temple management system. Update donor details, address, and donation information." />
            </Helmet>
            <Modal show={showEditModal} dismissible onClose={() => setShowEditModal(false)} position={"top-right"}>
                <Modal.Header>
                    <p className="text-bold font-mono uppercase">{donation.donorName}</p>
                </Modal.Header>
                <Modal.Body className="w-full flex flex-col md:flex-row gap-4 relative" >
                        <div className="flex-1">
                            <form onSubmit={handleSubmit} className="py-4" >
                                <div className="flex flex-col md:flex-row flex-wrap gap-4">
                                    <div className="flex-1 flex flex-col gap-4">
                                        <Label htmlFor="donorName" className="mb-4 text-sm font-medium flex items-center gap-2" >
                                            <IoManSharp className="inline mr-2 text-xl text-gray-500" />
                                            Name of Donor
                                        </Label>
                                        <TextInput id="donorName" name="donorName" value={formData.donorName} onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })} />
                                    </div>
                                    <div className="flex-1 flex flex-col gap-4">
                                        <Label htmlFor="sevaName" className="mb-4 text-sm font-medium flex items-center gap-2" >
                                            <FaHandHoldingHeart className="inline mr-2 text-xl text-gray-500" />
                                            Name of Seva</Label>
                                        <Select id="sevaName" name="sevaName" onChange={(e)=>  setFormData({ ...formData, [e.target.id] : e.target.value })} value={formData.sevaName}>
                                            <option value="" disabled>Select Seva</option>
                                            {seva.map((item) => (
                                                <option key={item._id} value={item.sevaName}>
                                                    {item.sevaName}
                                                </option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>
                                <h2 className="my-4 text-sm font-medium flex items-center gap-2">
                                    <FiMapPin className="inline mr-2 text-xl text-gray-500" />
                                    Address
                                </h2>
                                <AddressForm
                                    selectedCountry={selectedCountry}
                                    selectedState={selectedState}
                                    selectedDistrict={selectedDistrict}
                                    selectedTehsil={selectedTehsil}
                                    selectedVillage={selectedVillage}
                                    currUser={currUser}
                                    handleChange={handleChange}
                                />
                                <div className="flex flex-col md:flex-row flex-wrap gap-4 my-8">
                                    <div className="flex-1 flex flex-col gap-4">
                                    <Label htmlFor="contactInfo" className="mb-4 text-sm font-medium flex items-center gap-2" >
                                        <MdOutlineContactPhone className="inline mr-2 text-xl text-gray-500" />
                                        Add Contact Info
                                    </Label>
                                        <TextInput id="contactInfo" name="contactInfo" value={formData.contactInfo} onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })} />
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row flex-wrap gap-4">
                                    <div className="flex-1 flex flex-col gap-4">
                                    <Label htmlFor="paymentMethod" className="mb-4 text-sm font-medium flex items-center gap-2" >
                                        <MdPayment className="inline mr-2 text-xl text-gray-500" />
                                        Payment Method
                                    </Label>
                                        <Select id="paymentMethod" onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })} value={formData.paymentMethod}>
                                            <option value="select" disabled>Select</option>
                                            <option value="cash">Cash</option>
                                            <option value="bank">Bank</option>
                                            <option value="upi">Upi</option>
                                        </Select>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-4">
                                    <Label htmlFor="donationAmount" className="mb-4 text-sm font-medium flex items-center gap-2" >
                                        <FaDonate className="inline mr-2 text-xl text-gray-500" />
                                        Donation Amount
                                    </Label>
                                        <TextInput type="number" id="donationAmount" name="donationAmount" value={formData.donationAmount} onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })} />
                                    </div>
                                </div>
                                <div className="flex flex-row-reverse my-4 gap-3">
                                    <Button gradientMonochrome={"cyan"} pill disabled={loading} onClick={handleSubmit}>
                                        {loading ? <Spinner color="info" /> : 'Edit Donation'}
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
                        <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                            {success && ( <Alert type="success" message={success} autoDismiss duration={6000} onClose={() => setSuccess(null)} /> )}
                            {error && ( <Alert type="error" message={error} autoDismiss duration={6000} onClose={() => setError(null)} /> )}
                        </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
