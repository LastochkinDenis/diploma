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
            const { lastName, firstName, email } = action.payload.user;
            state.user = {
                ...state.user,
                lastName,
                firstName,
                email
            };
        }
    }
})


export const {getFullUserName, getLastName, getFirstName, getEmail, putUserData} = userSlice.actions;

export default userSlice.reducer;