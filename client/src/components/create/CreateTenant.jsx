import { useSelector } from "react-redux";
import { Button, Card, Label, Modal, TextInput, Select, Alert, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaBuildingUser } from "react-icons/fa6";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import "../../css/PhoneInputCostom.css";
import { Helmet } from "react-helmet-async";

export default function CreateTenant() {
    const [openModal, setOpenModal] = useState(false);
    const { currUser } = useSelector(state => state.user);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormdata] = useState({
        name: '',
        contactInfo: '',
        email: '',
        address: '',
        pinCode: '',
        idProofType: '',
        idProofNumber: ''
    });

    //handle change
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormdata({
            ...formData,
            [id]: value,
        });
    };
    //handle onChange for phoneNumber
    const handleOnChange = (value, { dialCode = '' }) => {
        setFormdata({
            ...formData,
            contactInfo: `${value.slice(dialCode.length)}`
        });
    };

    const handleSubmit = async (e) => {
        setError(null);
        setSuccess(null);
        setLoading(true);
        e.preventDefault();
        try {
            const response = await fetch(
                `/api/tenant/create/${currUser.templeId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );
            const data = await response.json();

            if (!response.ok) {
                setLoading(false);
                return setError(data.message);
            }
            setSuccess(data.message);
            setLoading(false);
            setFormdata({
                name: '',
                contactInfo: '',
                email: '',
                address: '',
                pinCode: '',
                idProofType: '',
                idProofNumber: ''
            });
        } catch (err) {
            setLoading(false);
            setError(err.message);
        }
    };
    return (
        <>
            <Helmet>
                <title>Create Tenant - Your Dashboard</title>
                <meta name="description" content="Create a new tenant. Fill out the form with details such as name, contact info, email, address, pin code, and ID proof." />
            </Helmet>
            {
                currUser.isAdmin && (
                    <>
                        <Card className="w-full max-w-sm bg-white">
                            <div className="flex items-center md:flex-col gap-4">
                                <span className="h-20 w-20 flex items-center justify-center p-2 bg-gradient-to-r from-pink-400 to-pink-700 rounded-md"><FaBuildingUser size={30} /></span>
                                <h5 className="text-2xl text-center font-bold tracking-tight">Create Tenant</h5>
                            </div>
                            <Button onClick={() => setOpenModal(true)} gradientMonochrome={"pink"} className="text-white">Create</Button>
                        </Card>
                        <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)} position={"center-right"}>
                            <Modal.Header className="bg-gradient-to-r from-pink-400 to-pink-700 p-4 text-2xl font-bold text-gray-900 dark:text-white" >
                                Create Tenant
                            </Modal.Header>
                            <Modal.Body>
                                <div className="space-y-6">
                                    {error && (<Alert color={"failure"} onDismiss={() => setError(null)} className="sticky top-2 z-20">{error}</Alert>)}
                                    {success && (<Alert color={"success"} onDismiss={() => setSuccess(null)} className="sticky top-2 z-20">{success}</Alert>)}
                                    <form className="my-3" onSubmit={handleSubmit}>
                                        <div className="flex flex-col gap-3 mt-2">
                                            <Label htmlFor="name">Name</Label>
                                            <TextInput type="text" id="name" name="name" value={formData.name} placeholder="Enter tenant name" onChange={handleChange} required />
                                        </div>
                                        <div className="flex flex-col gap-3 mt-2">
                                            <Label htmlFor="email">Email</Label>
                                            <TextInput type="email" id="email" name="email" value={formData.email} placeholder="Enter email" onChange={handleChange} />
                                        </div>
                                        <div className="flex flex-col gap-3 mt-2">
                                            <Label htmlFor="contactInfo">Phone Number</Label>
                                            <PhoneInput
                                                country={'in'}
                                                onChange={handleOnChange}
                                                placeholder="Enter Phone Number"
                                                containerClass="custom-phone-input-container"
                                                inputClass="custom-phone-input"
                                                buttonClass="custom-dropdown-button"
                                                dropdownClass="custom-dropdown-container"
                                                searchClass="custom-search-field"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-3 mt-2">
                                            <Label htmlFor="address">Address</Label>
                                            <TextInput type="text" id="address" name="address" value={formData.address} placeholder="Enter address" onChange={handleChange} required />
                                        </div>
                                        <div className="flex flex-col gap-3 mt-2">
                                            <Label htmlFor="pinCode">Pin Code</Label>
                                            <TextInput type="number" id="pinCode" name="pinCode" value={formData.pinCode} placeholder="Enter pin code" onChange={handleChange} required />
                                        </div>
                                        <div className="flex flex-col gap-3 mt-2">
                                            <Label htmlFor="idProofType">ID Proof Type</Label>
                                            <Select id="idProofType" name="idProofType" value={formData.idProofType} onChange={handleChange} required>
                                                <option value="">Select ID Proof Type</option>
                                                <option value="Aadhaar Card">Aadhaar Card</option>
                                                <option value="PAN Card">PAN Card</option>
                                                <option value="Voter ID">Voter ID</option>
                                                <option value="Passport">Passport</option>
                                                <option value="Driving License">Driving License</option>
                                                <option value="Ration Card">Ration Card</option>
                                                <option value="Employee ID Card">Employee ID Card</option>
                                                <option value="Bank Passbook">Bank Passbook</option>
                                                <option value="Government Issued ID Card">Government Issued ID Card</option>
                                            </Select>
                                        </div>
                                        <div className="flex flex-col gap-3 mt-2">
                                            <Label htmlFor="idProofNumber">ID Proof Number</Label>
                                            <TextInput type="text" id="idProofNumber" name="idProofNumber" value={formData.idProofNumber} placeholder="Enter ID proof number" onChange={handleChange} required />
                                        </div>
                                        <Button type="submit" className="mt-4" gradientMonochrome={"pink"} outline disabled={loading}>
                                            {loading ? <Spinner color={'pink'} /> : 'Create Tenant'}
                                        </Button>
                                    </form>
                                </div>
                            </Modal.Body>
                        </Modal>
                    </>
                )
            }
        </>
    );
}
