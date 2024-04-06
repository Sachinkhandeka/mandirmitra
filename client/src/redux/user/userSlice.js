import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currUser : null,
    error : null,
    loading : false,
}

const userSlice = createSlice({
    name : 'user',
    initialState,

    reducers : {
        signinStart : (state)=> {
            state.loading  = true ; 
            state.error = null ;
        },
        signinSuccess : (state , action)=> {
            state.currUser = action.payload;
            state.error = null ; 
            state.loading = false ; 
        },
        signinFailure : (state , action)=> {
            state.loading = false ; 
            state.error = action.payload ; 
        },
        resetError: (state) => {
            state.loading = false;
            state.error = null;
        },
    }
});

export const { signinStart, signinSuccess, signinFailure, resetError } = userSlice.actions ; 
export default userSlice.reducer ; 