import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  profile: any;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchUserStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchUserSuccess(state, action: PayloadAction<any>) {
      state.profile = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchUserFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearUser(state) {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { fetchUserStart, fetchUserSuccess, fetchUserFailure, clearUser } = userSlice.actions;
export default userSlice.reducer; 