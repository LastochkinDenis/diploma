import userSlice from './userSlice';
import courseEditSlice from './courseEditSlice';


import {configureStore} from '@reduxjs/toolkit';

export default configureStore({
    reducer: {
        user: userSlice,
        courseEdit: courseEditSlice,
    }
});