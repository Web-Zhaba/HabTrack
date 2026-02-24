import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface SettingsState {
  userName: string;
  dateFormat: string; // Формат даты: 'dd.MM.yyyy', 'MM/dd/yyyy', и т.д.
}

// Загружаем формат даты из localStorage
const getInitialDateFormat = (): string => {
  if (typeof window === 'undefined') return 'dd.MM.yyyy';
  const stored = window.localStorage.getItem('habtrack-date-format');
  if (
    stored &&
    ['dd.MM.yyyy', 'MM/dd/yyyy', 'yyyy-MM-dd', 'dd MMM yyyy', 'dd MMMM yyyy'].includes(stored)
  ) {
    return stored;
  }
  return 'dd.MM.yyyy';
};

// Загружаем имя пользователя из localStorage
const getInitialUserName = (): string => {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem('habtrack-user-name') || '';
};

const initialState: SettingsState = {
  userName: getInitialUserName(),
  dateFormat: getInitialDateFormat(),
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
      // Сохраняем в localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('habtrack-user-name', action.payload);
      }
    },
    setDateFormat: (state, action: PayloadAction<string>) => {
      state.dateFormat = action.payload;
      // Сохраняем в localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('habtrack-date-format', action.payload);
      }
    },
    resetSettings: (state) => {
      state.userName = '';
      state.dateFormat = 'dd.MM.yyyy';
      // Очищаем localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('habtrack-user-name');
        window.localStorage.removeItem('habtrack-date-format');
      }
    },
  },
});

export const { setUserName, setDateFormat, resetSettings } = settingsSlice.actions;

// Селекторы
export const selectSettings = (state: { settings: SettingsState }) => state.settings;
export const selectUserName = (state: { settings: SettingsState }) => state.settings.userName;
export const selectDateFormat = (state: { settings: SettingsState }) => state.settings.dateFormat;

export default settingsSlice.reducer;
