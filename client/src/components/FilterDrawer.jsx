import { Modal, Button, FloatingLabel, Select } from "flowbite-react";
import { useEffect, useState, useCallback } from "react";
import { BsCashCoin, BsBank } from "react-icons/bs";
import { MdMobileFriendly } from "react-icons/md";
import { GoDash } from "react-icons/go";
import { FaFilter } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function FilterDrawer({isDrawerOpen, setIsDrawerOpen, filterCount, setFilterCount}) {
    const { currUser } = useSelector(state => state.user);
    const  navigate = useNavigate();
    const [ villages, setVillages ] = useState([]);
    const [ tehsils, setTehsils ] = useState([]);
    const [ districts, setDistricts ] = useState([]);
    const [ states, setStates ] = useState([]);
    const [ countries, setCountries ] = useState([]);
    const [ paymentMethod, setPaymentMethod ] = useState('');
    const [ minAmount, setMinAmount ] = useState('');
    const [ maxAmount, setMaxAmount ] = useState('');
    const [ locationParams, setLocationParams ] = useState('');
    const [ seva, setSeva ] = useState([]);

    const getSeva = useCallback(async () => {
        try {
            const response = await fetch(`/api/seva/get/${currUser.templeId}`);
            const data = await response.json();

            if (!response.ok) {
                return ;
            }
            setSeva(data.seva);
        } catch (err) {
            return ;
        }
    }, [currUser.templeId]);

    useEffect(() => {
        getSeva();
    }, [getSeva]);

    //get address data
    const getlocationData = async()=> {
        try{
            const response = await fetch(`/api/location/get/${currUser.templeId}`);
            const data = await response.json();

            if(!response.ok) {
                return ; 
            }
            setVillages(data.villages);
            setTehsils(data.tehsils);
            setDistricts(data.districts);
            setStates(data.states);
            setCountries(data.countries);
        } catch(err) {
            return ;
        }
    }
    useEffect(()=> {
        getlocationData();
    },[currUser]);

    // Validate and set minAmount
    const handleMinAmountChange = (e) => {
        const amount = e.target.value;
        if (/^\d+$/.test(amount) && amount.length <= 6) {
            setMinAmount(amount);
        }
    }

    // Validate and set maxAmount
    const handleMaxAmountChange = (e) => {
        const amount = e.target.value;
        if (/^\d+$/.test(amount) && amount.length <= 6) {
            setMaxAmount(amount);
        }
    }
    // Handle Seva selection
    const handleSevaChange = (e) => {
        setLocationParams({ ...locationParams, seva: e.target.value });  
    };


    //handle apply filter functionality
    const handleSubmit = async(e)=> {
        e.preventDefault();
        const  params = new URLSearchParams();
        filterCount = 0 ; 
        if(paymentMethod) {
            params.set("paymentMethod", paymentMethod);
            filterCount++
        }
        if(minAmount) {
            params.set("minAmnt", minAmount);
            filterCount++
        }
        if(maxAmount) {
            params.set("maxAmnt", maxAmount);
            filterCount++
        }
        if(locationParams.village) {
            params.set("village", locationParams.village);
            filterCount++
        }
        if(locationParams.tehsil) {
            params.set("tehsil", locationParams.tehsil);
            filterCount++
        }
        if(locationParams.district) {
            params.set("district", locationParams.district);
            filterCount++
        }
        if(locationParams.state) {
            params.set("state", locationParams.state);
            filterCount++
        }
        if(locationParams.country) {
            params.set("country", locationParams.country);
            filterCount++
        }
        if(locationParams.seva) {
            params.set("seva", locationParams.seva);
            filterCount++
        }
        const searchQuery = params.toString();
        setFilterCount(filterCount);
        navigate(`?tab=daans&${searchQuery}`);
        setIsDrawerOpen(false);
    }

    // Handle clear all filters
    const handleClearFilters = () => {
        setPaymentMethod('');
        setMinAmount('');
        setMaxAmount('');
        setLocationParams({
            village: '',
            tehsil: '',
            district: '',
            state: '',
            country: ''
        });
        navigate(`?tab=daans`);
        setFilterCount(0); // Reset filter count
        setIsDrawerOpen(false);
    }
    return (
        <>
        <Helmet>
            <title>Filter Donations</title>
            <meta name="description" content="Filter donations by payment method, Seva, location, minimum donation amount and maximum donation amount." />
        </Helmet>
        <Modal show={isDrawerOpen} dismissible onClose={()=> setIsDrawerOpen(false)} position="top-right">
            <Modal.Header>
                <div className="flex gap-4 items-center" >
                    <FaFilter size={24} className="mx-3" />
                    <h2 className="text-xl" >Filters</h2>
                </div>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit} >
                    {/* Payment Method */}
                    <div className="flex flex-col gap-4" >
                        <h2 className="text-xl font-serif uppercase font-semibold" >Payment Method</h2>
                        <Button.Group color="dark">
                            <Button color={paymentMethod === "cash" ? "dark" : "gray"} onClick={()=> setPaymentMethod("cash")}>
                                <BsCashCoin className="mr-3 h-4 w-4" />
                                Cash
                            </Button>
                            <Button color={paymentMethod === "bank" ? "dark": "gray"} onClick={()=> setPaymentMethod("bank")} >
                                <BsBank className="mr-3 h-4 w-4" />
                                Bank
                            </Button>
                            <Button color={paymentMethod === "upi" ? "dark": "gray"} onClick={()=> setPaymentMethod("upi")} >
                                <MdMobileFriendly className="mr-3 h-4 w-4" />
                                Upi
                            </Button>
                        </Button.Group>
                    </div>
                    <hr className="gray-400 my-3" />
                    {/* Seva filter section */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xl font-serif uppercase font-semibold">Seva</h2>
                        <Select id="seva" defaultValue="" onChange={handleSevaChange} aria-label="Select Seva">
                            <option value="" disabled>Select</option>
                            {seva.map((sevaItem) => (
                                <option key={sevaItem._id} value={sevaItem.sevaName}>
                                    {sevaItem.sevaName}
                                </option>
                            ))}
                        </Select>
                    </div>
                    {/* Address Fields */}
                    <hr className="gray-400 my-3" />
                    <div className="flex flex-col gap-4" >
                        <h2 className="text-xl font-serif uppercase font-semibold" >Address</h2>
                        <div className="grid grid-cols-2 md:flex md:items-center md:justify-evenly gap-2" >
                            {/* Village */}
                            <div className="flex flex-col gap-3" >
                                <h2 className="text-lg font-semibold" >Village</h2>
                                <Select id="village" onClick={(e)=> setLocationParams({...locationParams, [e.target.id]: e.target.value}) } aria-label="Select Village">
                                    <option value="Select" disabled>Select</option>
                                    { villages && villages.map(village => (
                                        <option value={village.name} key={village._id}>{village.name}</option>
                                    )) }
                                </Select>
                            </div>  
                            {/* tehsil */}
                            <div className="flex flex-col gap-3" >
                                <h2 className="text-lg font-semibold" >Tehsil</h2>
                                <Select id="tehsil" onClick={(e)=> setLocationParams({...locationParams, [e.target.id]: e.target.value}) } aria-label="Select Tehsil" >
                                    <option value="Select" disabled>Select</option>
                                    { tehsils && tehsils.map(tehsil => (
                                        <option value={tehsil.name} key={tehsil._id}>{tehsil.name}</option>
                                    )) }
                                </Select>
                            </div>
                             {/* district */}
                             <div className="flex flex-col gap-3" >
                                <h2 className="text-lg font-semibold" >District</h2>
                                <Select id="district" onClick={(e)=> setLocationParams({...locationParams,[e.target.id]: e.target.value})} aria-label="Select District">
                                    <option value="Select" disabled>Select</option>
                                    { districts && districts.map(district => (
                                        <option value={district.name} key={district._id}>{district.name}</option>
                                    )) }
                                </Select>
                            </div>
                            {/* state */}
                            <div className="flex flex-col gap-3" >
                                <h2 className="text-lg font-semibold" >State</h2>
                                <Select id="state" onClick={(e)=> setLocationParams({...locationParams, [e.target.id]: e.target.value}) } aria-label="Select State" >
                                    <option value="Select" disabled>Select</option>
                                    { states && states.map(state => (
                                        <option value={state.name} key={state._id}>{state.name}</option>
                                    )) }
                                </Select>
                            </div> 
                            {/* country */}
                            <div className="flex flex-col gap-3" >
                                <h2 className="text-lg font-semibold" >Country</h2>
                                <Select id="country" onClick={(e)=> setLocationParams({...locationParams, [e.target.id]: e.target.value}) } aria-label="Select Country" >
                                    <option value="Select" disabled>Select</option>
                                    { countries && countries.map(country => (
                                        <option value={country.name} key={country._id}>{country.name}</option>
                                    )) }
                                </Select>
                            </div>         
                        </div>
                    </div>
                    {/* Price Range */}
                    <hr className="gray-400 my-3" />
                    <div className="flex flex-col gap-4" >
                        <h2 className="text-xl font-serif uppercase font-semibold" >Price Range</h2>
                        <div className="flex items-center justify-evenly gap-2" >
                            <FloatingLabel type="number" id="minAmnt" value={minAmount} variant="outlined" label="Minimun" onChange={handleMinAmountChange} aria-labelledby="min-amount-label" />
                            <GoDash size={20} />
                            <FloatingLabel  type="number" id="maxAmnt" value={maxAmount} variant="outlined" label="Maximum" onChange={handleMaxAmountChange} aria-labelledby="max-amount-label" />
                        </div>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer className="flex justify-between items-center" >
                <Button onClick={handleClearFilters} color={"gray"} >Clear All</Button>
                <Button onClick={handleSubmit} color={"dark"} >Apply Filters</Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}