import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
    name: 'loginState',
    initialState: {
        value: {
            logged: false,
            uid: "",
            username: ""
        }
    },
    reducers: {
        logIn: state => {
            state.value.logged = true
        },
        logOut: state => {
            state.value.logged = false
        },
        addUID(state, action) {
            state.value.uid = action.payload
        },
        removeUID: state => {
            state.value.uid = ""
        },
        addUsername(state, action) {
            state.value.username = action.payload
        },
        removeUsername: state => {
            state.value.username = ""
        }
    }
})

export const { logIn, logOut, addUID, removeUID, addUsername, removeUsername } = loginSlice.actions

export default loginSlice.reducer