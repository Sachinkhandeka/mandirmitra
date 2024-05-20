import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    searchTerm : "",
}

const searchSlice = createSlice({
    name : "searchTerm",
    initialState,
    reducers : {
        setSearchTerm : (state, action) => {
            state.searchTerm = action.payload;
        },
        clearSearchTerm : (state)=> {
            state.searchTerm = "";
        }
    }
})

export const { setSearchTerm, clearSearchTerm } = searchSlice.actions ; 
export default searchSlice.reducer ; 
