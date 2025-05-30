import api from '../services/api'; // Your axios instance

// Courses
export const fetchCourses = async (params: { page: number; per_page: number; search?: string }) => {
  const res = await api.get('/tutor/courses', { params });
  return res.data;
};

// Materials
export const fetchMaterials = async (courseId:number,params: { page: number; per_page: number; search?: string,course_id:number}) => {
    console.log(params)
    const res = await api.get(`/tutor/courses/${courseId}/materials`,{params});
  return res.data;
};

// Assignments
export const fetchAssignments = async (courseId: number,params: { page: number; per_page: number; search?: string, course_id: number}) => {
  console.log(params)
    const res = await api.get(`/tutor/courses/${courseId}/assignments`,{params});
  return res.data;
};

// Students
export const fetchStudents = async (courseId: number,params: { page: number; per_page: number; search?: string, course_id: number}) => {
  const res = await api.get(`/tutor/courses/${courseId}/students`,{params});
  return res.data;
};

// Chats (with a specific student)
export const fetchChats = async (courseId: number, studentId: number,params: { page: number; per_page: number; search?: string, course_id: number, student_id: number}) => {
  const res = await api.get(`/tutor/courses/${courseId}/chats/${studentId}`,{params});
  return res.data;
};
