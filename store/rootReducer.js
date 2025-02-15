import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import itemsReducer from './itemsSlice';
const rootReducer = combineReducers({
  auth: authReducer,
  items: itemsReducer,
});

export default rootReducer; 