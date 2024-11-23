import { useSelector } from "react-redux";
import { Button, Card, Label, Modal, TextInput, Spinner } from "flowbite-react";
import { useState } from "react";
import { FaBuildingUser } from "react-icons/fa6";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import "../../css/PhoneInputCostom.css";
import { Helmet } from "react-helmet-async";
import Alert from "../Alert";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshDevoteeAccessToken, refreshSuperAdminOrUserAccessToken } from "../../utilityFunx";

export default function CreateTenant() {
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const { currUser } = useSelector(state => state.user);
    const [alert, setAlert] = useState({ type : "", message : "" });
    const [loading, setLoading] = useState(false);
    const [formData, setFormdata] = useState({
        name: '',
        contactInfo: '',
        email: '',
        address: '',
        pinCode: '',
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
        setAlert({ type : "", message : "" });
        setLoading(true);
        e.preventDefault();
        try {
            const data = await fetchWithAuth(
                `/api/tenant/create/${currUser.templeId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate,
            );
            if(data) {
                setAlert({ type : "success", message :  data.message });
                setLoading(false);
                setFormdata({
                    name: '',
                    contactInfo: '',
                    email: '',
                    address: '',
                    pinCode: '',
                });
            }
        } catch (err) {
            setAlert({ type : "error", message : "" });
            setLoading(false);
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
                        <div className="p-0.5 bg-gradient-to-r from-pink-400 to-pink-700 rounded-lg">
                            <Card className="w-full h-full bg-white rounded-lg">
                                <div className="flex items-center md:flex-col gap-4">
                                    <span className="h-20 w-20 flex items-center justify-center p-2 bg-gradient-to-r from-pink-400 to-pink-700 rounded-md"><FaBuildingUser size={30} /></span>
                                    <h5 className="text-2xl text-center font-bold tracking-tight">Create Tenant</h5>
                                </div>
                                <Button onClick={() => setOpenModal(true)} gradientMonochrome={"pink"} className="text-white">Create</Button>
                            </Card>
                        </div>
                        <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)} position={"center-right"}>
                            <Modal.Header className="bg-gradient-to-r from-pink-400 to-pink-700 p-4 text-2xl font-bold text-gray-900 dark:text-white" >
                                Create Tenant
                            </Modal.Header>
                            <Modal.Body>
                                <div className="space-y-6">
                                    <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                                        {alert.message && (
                                            <Alert 
                                                type={alert.type}
                                                message={alert.message}
                                                autoDismiss
                                                duration={6000}
                                                onClose={()=> setAlert({ type : "", message : "" })}
                                            />
                                        )}
                                    </div>
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
