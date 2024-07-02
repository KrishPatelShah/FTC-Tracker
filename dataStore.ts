import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import eventCodeReducers from './eventCodeReducers';
import teamNumberReducers from './teamNumberReducers';
const store = configureStore({
  reducer: {
    event: eventCodeReducers,
    teamNumber : teamNumberReducers
  },
});

export { store, Provider };