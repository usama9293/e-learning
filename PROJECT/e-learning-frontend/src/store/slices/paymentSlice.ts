import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PaymentState {
  payments: any[];
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  payments: [],
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    fetchPaymentsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPaymentsSuccess(state, action: PayloadAction<any[]>) {
      state.payments = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchPaymentsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearPayments(state) {
      state.payments = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const { fetchPaymentsStart, fetchPaymentsSuccess, fetchPaymentsFailure, clearPayments } = paymentSlice.actions;
export default paymentSlice.reducer; 