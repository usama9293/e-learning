import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CourseState {
  courses: any[];
  loading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  courses: [],
  loading: false,
  error: null,
};

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    fetchCoursesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCoursesSuccess(state, action: PayloadAction<any[]>) {
      state.courses = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchCoursesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearCourses(state) {
      state.courses = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const { fetchCoursesStart, fetchCoursesSuccess, fetchCoursesFailure, clearCourses } = courseSlice.actions;
export default courseSlice.reducer; 