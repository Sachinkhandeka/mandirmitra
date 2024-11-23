import React, { useEffect, useState } from "react";
import { getCountries, getStatesByCountry, getDistrictsByState, getTehsilsByDistrict, getVillagesByTehsil } from "../locationApi";
import { Label, Select } from "flowbite-react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../utilityFunx";

export default function AddressForm ({ selectedCountry, selectedState, selectedDistrict, selectedTehsil, selectedVillage, currUser, locationAdded, handleChange }) {
    const navigate = useNavigate();
    const [ countries , setCountries ] = useState([]);
    const [ states , setStates ] = useState([]);
    const [ districts , setDistricts ] = useState([]);
    const [ tehsils , setTehsils ] = useState([]);
    const [ villages , setVillages ] = useState([]);

    // get countries
    const getCountriesData = async () => {
        const response = await getCountries(currUser.templeId, navigate);
        setCountries(response.countries.sort((a, b) => a.name.localeCompare(b.name)));
    }
    useEffect(() => {
        getCountriesData();
    }, [locationAdded]);

    // get states
    const getStatesData = async () => {
        const response = await getStatesByCountry(currUser.templeId, selectedCountry, navigate);
        setStates(response.states.sort((a, b) => a.name.localeCompare(b.name)));
    }
    useEffect(() => {
        if (selectedCountry && Object.keys(selectedCountry).length !== 0) {
            getStatesData();
        }
    }, [selectedCountry]);

    // get districts
    const getDistrictData = async () => {
        const response = await getDistrictsByState(currUser.templeId, selectedState, navigate);
        setDistricts(response.districts.sort((a, b) => a.name.localeCompare(b.name)));
    }
    useEffect(() => {
        if (selectedState && Object.keys(selectedState).length > 0) {
            getDistrictData();
        }
    }, [selectedState]);

    // get tehsils
    const getTehsilsData = async () => {
        const response = await getTehsilsByDistrict(currUser.templeId, selectedDistrict, navigate);
        setTehsils(response.tehsils.sort((a, b) => a.name.localeCompare(b.name)));
    }
    useEffect(() => {
        if (selectedDistrict && Object.keys(selectedDistrict).length > 0) {
            getTehsilsData();
        }
    }, [selectedDistrict]);

    // get villages
    const getVillagesData = async () => {
        const response = await getVillagesByTehsil(currUser.templeId, selectedTehsil, navigate);
        setVillages(response.villages.sort((a, b) => a.name.localeCompare(b.name)));
    }
    useEffect(() => {
        if (selectedTehsil && Object.keys(selectedTehsil).length > 0) {
            getVillagesData();
        }
    }, [selectedTehsil]);

    return (
        <section className="address-form">
            <Helmet>
                <title>Address Form</title>
                <meta name="description" content="Select country, state, district, tehsil, and village to complete the address form." />
            </Helmet>

            { countries && countries.length !== 0 ? (
                <div className="flex flex-col md:flex-row flex-wrap gap-4">
                    <article className="flex-1 flex flex-col gap-4">
                        <header>
                            <Label htmlFor="country">Country</Label>
                        </header>
                        <Select id="country" onClick={handleChange}>
                            <option value={"select"} disabled>Select</option>
                            { countries.map((country) => (
                                <option value={country._id} key={country._id}>
                                    {country.name.charAt(0).toUpperCase() + country.name.slice(1)}
                                </option>
                            )) }
                        </Select>
                    </article>

                    { selectedCountry && Object.keys(selectedCountry).length > 0 && (
                        <article className="flex-1 flex flex-col gap-4">
                            <header>
                                <Label htmlFor="state">State</Label>
                            </header>
                            <Select id="state" onClick={handleChange}>
                                <option value="select" disabled>Select</option>
                                { states.map((state) => (
                                    <option value={state._id} key={state._id}>
                                        { state.name.charAt(0).toUpperCase() + state.name.slice(1) }
                                    </option>
                                )) }
                            </Select>
                        </article>
                    )}

                    { selectedState && Object.keys(selectedState).length > 0 && (
                        <article className="flex-1 flex flex-col gap-4">
                            <header>
                                <Label htmlFor="district">District</Label>
                            </header>
                            <Select id="district" onClick={handleChange}>
                                <option value="select" disabled>Select</option>
                                { districts.map((district) => (
                                    <option value={district._id} key={district._id}>
                                        { district.name.charAt(0).toUpperCase() + district.name.slice(1) }
                                    </option>
                                )) }
                            </Select>
                        </article>
                    )}

                    { selectedDistrict && Object.keys(selectedDistrict).length > 0 && (
                        <article className="flex-1 flex flex-col gap-4">
                            <header>
                                <Label htmlFor="tehsil">Tehsils</Label>
                            </header>
                            <Select id="tehsil" onClick={handleChange}>
                                <option value="select" disabled>Select</option>
                                { tehsils.map((tehsil) => (
                                    <option value={tehsil._id} key={tehsil._id}>
                                        { tehsil.name.charAt(0).toUpperCase() + tehsil.name.slice(1) }
                                    </option>
                                )) }
                            </Select>
                        </article>
                    )}

                    { selectedTehsil && Object.keys(selectedTehsil).length > 0 && (
                        <article className="flex-1 flex flex-col gap-4">
                            <header>
                                <Label htmlFor="village">Village</Label>
                            </header>
                            <Select id="village" onClick={handleChange}>
                                <option value="select" disabled>Select</option>
                                { villages.map((village) => (
                                    <option value={village._id} key={village._id}>
                                        { village.name.charAt(0).toUpperCase() + village.name.slice(1) }
                                    </option>
                                )) }
                            </Select>
                        </article>
                    )}
                </div>
            ) : (
                <p className="text-xs text-red-500">Please add location first.</p>
            )}
        </section>
    );
}
