import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import LocationCard from "../LocationCard";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../../utilityFunx";

export default function DashAddress() {
    const navigate = useNavigate();
    const { currUser } = useSelector(state => state.user);
    const [ countries, setCountries ] =  useState([]);
    const [ states, setStates ] = useState([]);
    const [ districts, setDistricts ] =  useState([]);
    const [ tehsils, setTehsils ] = useState([]);
    const [ villages, setVillages ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ alert, setAlert ] = useState({ type : "", message : "" });

    const getLocation = async ()=> {
        try {
            const data = await fetchWithAuth(
                `/api/location/get/${currUser.templeId}`,
                {},
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate
            );
            if(data) {
                setCountries(data.countries);
                setStates(data.states);
                setDistricts(data.districts);
                setTehsils(data.tehsils);
                setVillages(data.villages);
            }
        }catch(err) {
            console.log(err.message);
        }
    }
    useEffect(()=> {
        getLocation();
    },[currUser.templeId]);

    return (
        <>
            <Helmet>
                <title>Location Details - Dashboard</title>
                <meta name="description" content="Explore location details including countries, states, districts, tehsils, and villages." />
                <meta name="keywords" content="locations, addresses, countries, states, districts, tehsils, villages" />
            </Helmet>
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