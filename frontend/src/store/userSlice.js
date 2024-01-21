import {createSlice} from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: { 'user' : {
        'lastName': '',
        'firstName': '',
        'email': ''
        }
    },
    reducers: {
        getFullUserName: (state, action) => {},
        getLastName: (state, action) => {},
        getFirstName: (state, action) => {},
        getEmail: (state, action) => {},
        putUserData: (state, action) => {
            state.user.lastName = action.payload.lastName;
            state.user.firstName = action.payload.firstName;
            state.user.email = action.payload.email;
        }
    }
})


export const {getFullUserName, getLastName, getFirstName, getEmail, putUserData} = userSlice.actions;

export default userSlice.reducer;