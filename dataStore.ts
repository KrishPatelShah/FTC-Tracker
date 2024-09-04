
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import eventCodeReducers from './eventCodeReducers';
import teamNumberReducers from './teamNumberReducers';
import { atom } from 'jotai';
import { TeamEventData } from './app/screens/TeamScoutingScreen/teamView';
const store = configureStore({
  reducer: {
    event: eventCodeReducers,
    teamNumber : teamNumberReducers
  },
});

export { store, Provider };

export type ScoutingSheetArrayType = {
  code : string;
  name : string;
  date : string;
  sheetID : string;
  eventData : TeamEventData[]
}

// going to have to add the owner user's ID as a field in the userScoutingSheetArray
// also have to add isShared condition as a field
 
export const eventCodeAtom = atom<string>("")
export const teamNumberAtom = atom<string>("")
export const teamDataAtom = atom<TeamEventData>({teamNumber : 0, extraNotes : "", intake : 5,  deposit : 5, drivetrain : 5, matchData : []})
export const persistentEventData = atom<TeamEventData[]>([])
export const scoutingSheetArray = atom<ScoutingSheetArrayType[]>([])
export const sharedSheetsArrayAtom = atom<ScoutingSheetArrayType[]>([])
export const bookmarkCodeArray = atom<string[]>([])
export const isSharedWithMeAtom = atom<boolean>(false)