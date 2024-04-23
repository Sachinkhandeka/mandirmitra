import { Button, Select, TextInput } from 'flowbite-react';
import React, { useState } from 'react';

const DonationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    taluko: '',
    gaam: '',
    seva: '',
    mobileNumber: '',
    paymentMethod: '',
    amount: '',
  });
  const [gaamOptions, setGaamOptions] = useState([]);
  const [talukaOptions, setTalukaOptions] = useState([]); // Assuming you fetch taluka options from the backend

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTalukaChange = e => {
    const selectedTaluka = e.target.value;
    setFormData(prevState => ({
      ...prevState,
      taluko: selectedTaluka,
      gaam: '', // Reset gaam when taluka changes
    }));
    // Fetch gaam options based on selected taluka
    fetchGaamOptions(selectedTaluka);
  };

  const fetchGaamOptions = async (selectedTaluka) => {
    try {
      // Make an API call to fetch gaam options based on selected taluka
      const response = await fetch(`/api/gaam?taluko=${selectedTaluka}`);
      if (!response.ok) {
        throw new Error('Failed to fetch gaam options');
      }
      const data = await response.json();
      setGaamOptions(data.gaamOptions);
    } catch (error) {
      console.error('Error fetching gaam options:', error);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Make API call to submit donation data
      const response = await fetch('/api/donate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to submit donation');
      }
      // Reset form after successful submission
      setFormData({
        name: '',
        taluko: '',
        gaam: '',
        seva: '',
        mobileNumber: '',
        paymentMethod: '',
        amount: '',
      });
    } catch (error) {
      console.error('Error submitting donation:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} placeholder="Name" className="max-w-md mx-auto p-6 rounded shadow"  >
        <TextInput type="text" name="name" value={formData.name} onChange={handleInputChange} />
        <Select name="taluko" value={formData.taluko} onChange={handleTalukaChange} placeholder="Taluko">
            {talukaOptions.map(taluka => (
                <option key={taluka.id} value={taluka.id}>{taluka.name}</option>
            ))}
        </Select>
        <Select name="gaam" value={formData.gaam} onChange={handleInputChange} placeholder="Gaam">
            {gaamOptions.map(gaam => (
                <option key={gaam.id} value={gaam.id}>{gaam.name}</option>
            ))}
        </Select>
        <TextInput type="text" name="seva" value={formData.seva} onChange={handleInputChange} placeholder="Seva" />
        <TextInput type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} placeholder="Mobile Number" />
        <Select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} placeholder="Payment Method">
            <option value="cash">Cash</option>
            <option value="bank">Bank</option>
            <option value="upi">UPI</option>
        </Select>
        <TextInput type="number" name="amount" value={formData.amount} onChange={handleInputChange} placeholder="Amount" />
        <Button type="submit">Donate</Button>
    </form>
  );
};

export default DonationForm;
