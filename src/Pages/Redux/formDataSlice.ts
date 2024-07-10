// formDataSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  formData: {
    stateName: '',
    cityName: '',
    engine_no: '',
    chassis_number: '',
    vehicle_type: '',
    manufacturer: '',
    registration_no: '',
    model: '',
    salutation: '',
    fname: '',
    mname: '',
    lname: '',
    email: '',
    mobile_no: '',
    gender: '',
    dob: '',
    addr1: '',
    addr2: '',
    pincode: '',
    city_id: '',
    state_id: '',
    nominee_full_name: '',
    nominee_age: '',
    nominee_relationship: '',
    appointee_name: '',
    appointee_age: '',
    appointee_relationship: '',
  },
  formErrors: {},
};

const formDataSlice = createSlice({
  name: 'formData',
  initialState,
  reducers: {
    updateFormData(state, action) {
      state.formData = { ...state.formData, ...action.payload };
    },
    updateFormErrors(state, action) {
      state.formErrors = { ...state.formErrors, ...action.payload };
    },
    resetFormData(state) {
      state.formData = { ...initialState.formData };
      state.formErrors = { ...initialState.formErrors };
    },
  },
});

export const { updateFormData, updateFormErrors, resetFormData } = formDataSlice.actions;
export default formDataSlice.reducer;
