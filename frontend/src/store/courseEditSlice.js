import { combineSlices, createAction, createSlice } from "@reduxjs/toolkit";

export const courseEditSlice = createSlice({
  name: "courseEdit",
  initialState: {
    courseEdit: {
      isUpdate: false,
      linkRequestForServer: "",
      currentData: {},
    },
  },
  reducers: {
    handleDataChange: (state, action) => {
      state.courseEdit = {
        ...state.courseEdit,
        ...action.payload,
      };
    },
    setCurrentData: (state, action) => {
      const currentData = action.payload.currentData;

      state.courseEdit = {
        ...state.courseEdit,
        currentData,
      };
    },
    setLinkRequestForServer: (state, action) => {
      const linkRequestForServer = action.payload.linkRequestForServer;

      state.courseEdit = {
        ...state.courseEdit,
        linkRequestForServer,
      };
    },
    setIsUpdate: (state, action) => {
      const isUpdate = action.payload.isUpdate;

      state.courseEdit = {
        ...state.courseEdit,
        isUpdate,
      };
    },
  },
});

export const {
  setIsUpdate,
  setLinkRequestForServer,
  setCurrentData,
  handleDataChange,
} = courseEditSlice.actions;

export default courseEditSlice.reducer;
