import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  teamNumber: '',
};

const teamSlice = createSlice({
  name: 'teamNumber',
  initialState,
  reducers: {
    setTeamNumber: (state, action) => {
      state.teamNumber = action.payload;
    },
  },
});

export const { setTeamNumber } = teamSlice.actions;
export default teamSlice.reducer;