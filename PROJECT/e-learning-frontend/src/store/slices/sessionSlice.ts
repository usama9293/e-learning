import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SessionState {
  sessions: any[];
  loading: boolean;
  error: string | null;
}

const initialState: SessionState = {
  sessions: [],
  loading: false,
  error: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    fetchSessionsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSessionsSuccess(state, action: PayloadAction<any[]>) {
      state.sessions = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchSessionsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearSessions(state) {
      state.sessions = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const { fetchSessionsStart, fetchSessionsSuccess, fetchSessionsFailure, clearSessions } = sessionSlice.actions;
export default sessionSlice.reducer; 