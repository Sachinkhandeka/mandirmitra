import React, { useState } from 'react';
import { Button, Label, Select, TextInput, Spinner } from 'flowbite-react';
import { useSelector } from 'react-redux';
import GetTenants from './GetTenants';
import Alert from './Alert';

export default function AddTenantToAsset({ assetId, fetchAssets }) {
    const { currUser } = useSelector(state => state.user);
    const [tenantDetails, setTenantDetails] = useState({
        tenant: '',
        rentAmount: '',
        leaseStartDate: '',
        leaseEndDate: '',
        paymentStatus: ''
    });
    const [alert, setAlert] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTenantDetails({
            ...tenantDetails,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setAlert({ type: "", message: "" });
            setLoading(true);
            const response = await fetch(
                `/api/assets/${assetId}/addTenant/${currUser.templeId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(tenantDetails),
                }
            );
            const data = await response.json();

            if (!response.ok) {
                setAlert({ type: "error", message: data.message });
                setLoading(false);
                return;
            }

            setAlert({ type: "success", message: data.message });
            setLoading(false);
            fetchAssets();
        } catch (err) {
            setAlert({ type: "error", message: err.message });
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="p-6 rounded-lg shadow-lg w-full my-6 dark:bg-slate-800">
                <h2 className="text-2xl font-semibold text-center mb-6">Add Tenant Details</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Label htmlFor="tenant">Tenant</Label>
                        <GetTenants />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="rentAmount">Rent Amount</Label>
                        <TextInput id="rentAmount" name="rentAmount" type="number" placeholder="Enter rent amount" value={tenantDetails.rentAmount} onChange={handleChange} required />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="leaseStartDate">Lease Start Date</Label>
                        <TextInput id="leaseStartDate" name="leaseStartDate" type="date" value={tenantDetails.leaseStartDate} onChange={handleChange} required />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="leaseEndDate">Lease End Date</Label>
                        <TextInput id="leaseEndDate" name="leaseEndDate" type="date" value={tenantDetails.leaseEndDate} onChange={handleChange} required />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="paymentStatus">Payment Status</Label>
                        <Select id="paymentStatus" name="paymentStatus" value={tenantDetails.paymentStatus} onChange={handleChange} required>
                            <option value="">Select a status</option>
                            <option value="Paid">Paid</option>
                            <option value="Unpaid">Unpaid</option>
                            <option value="Partially Paid">Partially Paid</option>
                        </Select>
                    </div>
                    <div className="flex items-center justify-end">
                        <Button type="submit" color={"blue"} disabled={loading}>
                            {loading ? <Spinner color={"purple"} /> : 'Add Tenant'}
                        </Button>
                    </div>
                </form>
                <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                    {alert && alert.message && (
                        <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                    )}
                </div>
            </div>
        </div>
    );
}
