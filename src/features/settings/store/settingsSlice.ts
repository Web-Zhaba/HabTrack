import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface SettingsState {
  userName: string;
}

const initialState: SettingsState = {
  userName: '',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    resetSettings: (state) => {
      state.userName = '';
    },
  },
});

export const { setUserName, resetSettings } = settingsSlice.actions;

// Селекторы
export const selectSettings = (state: { settings: SettingsState }) => state.settings;
export const selectUserName = (state: { settings: SettingsState }) => state.settings.userName;

export default settingsSlice.reducer;