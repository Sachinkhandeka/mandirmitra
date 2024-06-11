import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import LocationCard from "../LocationCard";

export default function DashAddress() {
    const { currUser } = useSelector(state => state.user);
    const [ countries, setCountries ] =  useState([]);
    const [ states, setStates ] = useState([]);
    const [ districts, setDistricts ] =  useState([]);
    const [ tehsils, setTehsils ] = useState([]);
    const [ villages, setVillages ] = useState([]);

    const getLocation = async ()=> {
        try {
            const response = await fetch(`/api/location/get/${currUser.templeId}`);
            const data = await response.json();

            if(!response.ok) {
                console.log(`Error while getting ${region} info`);
                return ;
            }
            setCountries(data.countries);
            setStates(data.states);
            setDistricts(data.districts);
            setTehsils(data.tehsils);
            setVillages(data.villages);
        }catch(err) {
            console.log(err.message);
        }
    }
    useEffect(()=> {
        getLocation();
    },[currUser.templeId]);

    const editLocation = async(id)=> {
        try {
            const response = await fetch(
                `/api/location/edit/${id}/${currUser.templeId}`,
                {
                    method : "PUT",
                    headers : { "content-type" : "application/json" },
                    body : JSON.stringify(),
                }
            );
            const data  = await response.json();
        }catch(err)  {
            console.log(err.message);
        }
    }
    const deleteLocation = async(id)=> {
        try {
            const response = await fetch(
                `/api/location/delete/${id}/${currUser.templeId}`,
                { method : "DELETE" },  
            );
            const data  = await response.json();
        }catch(err)  {
            console.log(err.message);
        }
    }
    return (
        <>
           <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                <LocationCard label={"countries"} data={countries} getLocation={getLocation} />
                <LocationCard label={"states"} data={states} getLocation={getLocation} />
                <LocationCard label={"districts"} data={districts} getLocation={getLocation} />
                <LocationCard label={"tehsils"} data={tehsils} getLocation={getLocation} />
                <LocationCard label={"villages"} data={villages} getLocation={getLocation} />
            </div>
        </>
    );
}