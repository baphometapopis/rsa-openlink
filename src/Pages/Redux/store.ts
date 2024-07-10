// store.js

import { configureStore } from '@reduxjs/toolkit';
import formDataReducer from './formDataSlice';

export default configureStore({
  reducer: {
    formData: formDataReducer,
  },
});
