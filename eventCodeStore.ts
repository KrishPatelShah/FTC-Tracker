import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import eventCodeReducers from './eventCodeReducers';
const store = configureStore({
  reducer: {
    event: eventCodeReducers,
  },
});

export { store, Provider };