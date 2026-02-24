/**
 * Единая точка экспорта для store настроек
 *
 * Использование:
 * import { selectSettings, setUserName, setDateFormat } from '@features/settings/store';
 */

export {
  // Actions
  setUserName,
  setDateFormat,
  resetSettings,
  // Reducer
  default as settingsReducer,
  // State type
  type SettingsState,
  // Selectors
  selectSettings,
  selectUserName,
  selectDateFormat,
} from './settingsSlice';
