import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  eventCode: '',
};

const eventSlice = createSlice({
  name: 'eventCode',
  initialState,
  reducers: {
    setEventCode: (state, action) => {
      state.eventCode = action.payload;
    },
  },
});

export const { setEventCode } = eventSlice.actions;
export default eventSlice.reducer;