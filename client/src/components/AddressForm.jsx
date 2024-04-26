import React, { useEffect, useState } from "react";
import { getCountries, getStatesByCountry, getDistrictsByState, getTehsilsByDistrict, getVillagesByTehsil } from "../locationApi";
import { Label, Select } from "flowbite-react";

export default function AddressForm ({ selectedCountry, selectedState, selectedDistrict, selectedTehsil, selectedVillage, currUser, locationAdded, handleChange }) {
    const [ countries , setCountries ] = useState([]);
    const [ states , setStates ] = useState([]);
    const [ districts , setDistricts ] = useState([]);
    const [ tehsils , setTehsils ] = useState([]);
    const [ villages , setVillages ] = useState([]);

    //get countries
    const getCountriesData = async()=> {
        const response = await getCountries(currUser.templeId);
        setCountries(response.countries);
    }
    useEffect(()=> {
        getCountriesData();
    },[locationAdded]);

    //get states
    const getStatesData = async()=> {
        const response = await getStatesByCountry( currUser.templeId ,selectedCountry);
        setStates(response.states);
    }
    useEffect(()=> {
        if(selectedCountry && Object.keys(selectedCountry).length !== 0) {
            getStatesData();
        }
    },[selectedCountry]);

    //get districts
    const getDistrictData = async()=> {
        const response = await getDistrictsByState(currUser.templeId,selectedState);
        setDistricts(response.districts);

    }
    useEffect(()=> {
        if(selectedState && Object.keys(selectedState).length > 0) {
            getDistrictData();
        }
    },[selectedState]);

    //get tehsils
    const getTehsilsData = async()=> {
        const response = await getTehsilsByDistrict(currUser.templeId,selectedDistrict);
        setTehsils(response.tehsils);
    }

    useEffect(()=>{
        if(selectedDistrict && Object.keys(selectedDistrict).length > 0) {
            getTehsilsData();
        }
    },[selectedDistrict]);
    //get villages
    const getVillagesData = async()=> {
        const response = await getVillagesByTehsil(currUser.templeId,selectedTehsil);
        setVillages(response.villages);
    }
    useEffect(()=> {
        if(selectedTehsil && Object.keys(selectedTehsil).length > 0) {
            getVillagesData();
        }
    },[selectedTehsil]);

    return (
        <>
        { countries && countries.length !== 0 ? (
            <div className="flex flex-col md:flex-row  flex-wrap gap-4" >  
                <div className="flex-1 flex flex-col gap-4" >
                    <Label htmlFor="country" >Country</Label>
                    <Select id="country" onClick={handleChange} >
                        <option value={"select"} disabled >Select</option>
                        { countries && countries.length > 0 && countries.map((country)=> (
                            <option value={country._id} key={country._id}>
                                {country.name.charAt(0).toUpperCase() + country.name.slice(1)}
                            </option>
                        )) }
                    </Select>
                </div>
                { selectedCountry && Object.keys(selectedCountry).length > 0 && (
                    <div className="flex-1 flex flex-col gap-4" >
                        <Label htmlFor="state" >State</Label>
                        <Select id="state" onClick={handleChange} >
                            <option value="select" disabled>Select</option>
                            { states && states.length > 0 && states.map((state)=> (
                                <option value={state._id} key={state._id}>
                                    { state.name.charAt(0).toUpperCase() + state.name.slice(1) }
                                </option>
                            )) }
                        </Select>
                    </div>
                )}
                { selectedState && Object.keys(selectedState).length > 0 && (
                    <div className="flex-1 flex flex-col gap-4">
                        <Label htmlFor="district">District</Label>
                        <Select id="district" onClick={handleChange} >
                            <option value="select" disabled>Select</option>
                            { districts && districts.length > 0 && districts.map((district)=> (
                                <option value={district._id} key={district._id}>
                                    { district.name.charAt(0).toUpperCase() + district.name.slice(1) }
                                </option>
                            )) }
                        </Select>
                    </div>
                ) }
                { selectedDistrict && Object.keys(selectedDistrict).length > 0 && (
                    <div className="flex-1 flex flex-col gap-4" >
                        <Label htmlFor="tehsil">Tehsils</Label>
                        <Select id="tehsil" onClick={handleChange}>
                            <option value="select" disabled>Select</option>
                            { tehsils &&  tehsils.length > 0 && tehsils.map((tehsil)=> (
                                <option value={tehsil._id} key={tehsil._id}>
                                    { tehsil.name.charAt(0).toUpperCase() + tehsil.name.slice(1) }
                                </option>
                            )) }
                        </Select>
                    </div>
                ) }
                { selectedTehsil && Object.keys(selectedTehsil).length > 0 && (
                    <div className="flex-1 flex flex-col gap-4" >
                        <Label htmlFor="village" >Village</Label>
                        <Select id="village" onClick={handleChange} >
                            <option value="select" disabled>Select</option>
                            { villages && villages.length > 0 && villages.map((village)=> (
                                <option value={ village._id } key={village._id}>
                                    { village.name.charAt(0).toUpperCase() + village.name.slice(1) }
                                </option>
                            )) }
                        </Select>
                    </div>
                ) }
            </div>
            ): (
                <p className="text-xs text-red-500" >Please Add location first.</p>
            )}
        </>
    );
};
