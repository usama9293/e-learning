import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MaterialState {
  materials: any[];
  loading: boolean;
  error: string | null;
}

const initialState: MaterialState = {
  materials: [],
  loading: false,
  error: null,
};

const materialSlice = createSlice({
  name: 'material',
  initialState,
  reducers: {
    fetchMaterialsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchMaterialsSuccess(state, action: PayloadAction<any[]>) {
      state.materials = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchMaterialsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearMaterials(state) {
      state.materials = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const { fetchMaterialsStart, fetchMaterialsSuccess, fetchMaterialsFailure, clearMaterials } = materialSlice.actions;
export default materialSlice.reducer; 