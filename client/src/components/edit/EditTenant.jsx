import { useSelector } from "react-redux";
import { Button, Label, Modal, TextInput, Select, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import "../../css/PhoneInputCostom.css";
import { Helmet } from "react-helmet-async";
import Alert from "../Alert";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../../utilityFunx";

export default function EditTenant({ tenant, isOpen, onClose, refreshTenants }) {
    const navigate = useNavigate();
    const { currUser } = useSelector(state => state.user);
    const [ alert, setAlert ] = useState({ type : "", message : "" });
    const [loading, setLoading] = useState(false);
    const [formData, setFormdata] = useState({
        name: '',
        contactInfo: '',
        email: '',
        address: '',
        pinCode: '',
        status : '',
    });
    
    useEffect(()=>{
        if(Object.keys(tenant).length > 0) {
            setFormdata({
                name : tenant.name,
                contactInfo : tenant.contactInfo,
                email : tenant.email,
                address : tenant.address,
                pinCode : tenant.pinCode,
                status : tenant.status,
            })
        }
    },[tenant]);

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
        e.preventDefault();
        setLoading(true);
        setAlert({ type : "", message : "" });
        try {
            const data = await fetchWithAuth(
                `/api/tenant/update/${currUser.templeId}/${tenant._id}`,
                {
                    method: "PUT",
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
                setAlert({ type : "success", message : data.message });
                setLoading(false);
                refreshTenants();
                onClose();
            }
        } catch (err) {
            setLoading(false);
            setAlert({ type : "error", message : err.message });
        }
    };

    return (
        <>
            <Helmet>
                <title>Edit Tenant - Your Dashboard</title>
                <meta name="description" content="Edit tenant details." />
            </Helmet>
            <Modal show={isOpen} size="md" popup onClose={onClose} position={"center-right"}>
                <Modal.Header className="bg-gradient-to-r from-pink-400 to-pink-700 p-4 text-2xl font-bold text-gray-900 dark:text-white" >
                    Edit Tenant
                </Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                            {alert && alert.message && (
                                <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
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
                            <div className="flex flex-col gap-3 mt-2">
                                <Label htmlFor="status">Status</Label>
                                <Select id="status" name="status" value={formData.status} onChange={handleChange} required>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </Select>
                            </div>
                            <Button type="submit" className="mt-4" gradientMonochrome={"pink"} outline disabled={loading}>
                                {loading ? <Spinner color={'pink'} /> : 'Update Tenant'}
                            </Button>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
