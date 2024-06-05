import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userDetails: {},
    token: '',
    isLoggedIn: false,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserLoginDetails: (state, action) => {
            return {
                ...state,
                userDetails: action.payload.user,
                token: action.payload.token,
                isLoggedIn: true
            }
        }
    }
})

// Action creators are generated for each case reducer function
export const { setUserLoginDetails } = userSlice.actions

export default userSlice.reducer