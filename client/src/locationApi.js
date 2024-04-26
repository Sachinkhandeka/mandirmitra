// Function to make a GET request to retrieve all countries
export async function getCountries(templeId) {
    try {
        const response = await fetch(`/api/location/countries/${templeId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getting countries:", error);
        throw error;
    }
}

// Function to make a GET request to retrieve states by country ID
export async function getStatesByCountry(templeId,countryId) {
    try {
        const response = await fetch(`/api/location/states/${templeId}/${countryId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getting states:", error);
        throw error;
    }
}

// Function to make a GET request to retrieve districts by state ID
export async function getDistrictsByState(templeId,stateId) {
    try {
        const response = await fetch(`/api/location/districts/${templeId}/${stateId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getting districts:", error);
        throw error;
    }
}

// Function to make a GET request to retrieve tehsils by district ID
export async function getTehsilsByDistrict(templeId,districtId) {
    try {
        const response = await fetch(`/api/location/tehsils/${templeId}/${districtId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getting tehsils:", error);
        throw error;
    }
}

// Function to make a GET request to retrieve villages by tehsil ID
export async function getVillagesByTehsil(templeId,tehsilId) {
    try {
        const response = await fetch(`/api/location/villages/${templeId}/${tehsilId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getting villages:", error);
        throw error;
    }
}