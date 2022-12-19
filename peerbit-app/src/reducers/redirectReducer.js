import { createSlice } from "@reduxjs/toolkit";

// the user inputs url -> redirected to /login -> upon login redirected to the original url

export const redirectSlice = createSlice({
    name: 'redirectPath',
    initialState: {
        value: ""
    },
    reducers: {
        //redirect to discover page
        redirectDiscover: state => {
            state.value = "/discover"
        },
        //redirect to publish page
        redirectPublish(state) {
            console.log("publish reducer")
            state.value += "/publish"
        },
        //redirect to review page
        redirectReview: state => {
            state.value = "/review"
        },
        //redirect to account page
        redirectAccount: state => {
            state.value = "/account"
        },
        //redirect to some code submission url
        redirectCodeSubmission(state, action) {
            state.value = action.payload
        },
        // redirectDirect(state, action) {
        //     state.value = action.payload
        // },
        //reset value to indicate no redirection is required
        reset: state => {
            state.value = ""
        }
    }
})

export const { 
    redirectDiscover, 
    redirectPublish, 
    redirectReview, 
    redirectAccount, 
    redirectCodeSubmission, 
    reset 
} = redirectSlice.actions

export default redirectSlice.reducer