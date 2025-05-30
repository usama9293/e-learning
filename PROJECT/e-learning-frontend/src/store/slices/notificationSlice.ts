import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
  notifications: any[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    fetchNotificationsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchNotificationsSuccess(state, action: PayloadAction<any[]>) {
      state.notifications = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchNotificationsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearNotifications(state) {
      state.notifications = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const { fetchNotificationsStart, fetchNotificationsSuccess, fetchNotificationsFailure, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer; 