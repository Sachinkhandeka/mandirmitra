import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currUser : null, 
    error : null,
    loading : false,
}

const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {
        signinStart : (state)=> {
            state.loading = true;
            state.error = null;
        },
        signinSuccess : ( state , action )=> {
            state.currUser = action.payload ;
            state.loading = false ; 
            state.error = null ;
        },
        signinFailure : ( state , action )=> {
            state.loading = false ; 
            state.error = action.payload ; 
        },
        resetError: state => {
            state.loading = false;
            state.error = null;
        },
        updateStart : ( state )=> {
            state.loading = true ; 
            state.error = null ; 
        },
        updateSuccess : (state , action)=> {
            state.currUser = action.payload ; 
            state.loading = false ; 
            state.error = null ; 
        },
        updateFailure : (state , action)=> {
            state.loading = false ;  
            state.error = action.payload ; 
        },
        deleteStart : (state)=> {
            state.loading = true ;
            state.error = null ; 
        },
        deleteSuccess : (state )=> {
            state.currUser = null ;
            state.loading = false ;
            state.error = null ;
        },
        deleteFailure : (state , action)=> {
            state.loading = false ; 
            state.error = action.payload ; 
        },
        signoutSuccess : (state)=>  {
            state.currUser = null ;
            state.error = null;
            state.loading = false;
        },
    }
});

export const { 
    signinStart, 
    signinSuccess, 
    signinFailure,
    resetError, 
    updateStart, 
    updateSuccess, 
    updateFailure,
    deleteStart,
    deleteSuccess,
    deleteFailure,
    signoutSuccess,
}  = userSlice.actions ; 
export default userSlice.reducer ; 