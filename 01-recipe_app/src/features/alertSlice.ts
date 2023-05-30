import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

export interface AlertState {
    text?: string;
    alertType?: 'success' | 'error' | 'info';
}

const initialState: AlertState = {
    text: undefined,
    alertType: undefined,
};

export const alertSlice = createSlice({
    name: 'alerts',
    initialState,
    reducers: {
        setAlert: (state, action: PayloadAction<AlertState>) => {
            const { text, alertType } = action.payload;
            state.text = text;
            state.alertType = alertType;
        },
        clearAlert: (state) => {
            state.text = undefined;
            state.alertType = undefined;
        }
    },
});

export const { 
    setAlert,
    clearAlert
} = alertSlice.actions;

export const selectAlert = (state: RootState) => state.alert;

export default alertSlice.reducer;