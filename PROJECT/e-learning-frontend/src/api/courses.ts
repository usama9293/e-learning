import api from  '../services/api'

import axios from 'axios';
export async function fetchAllCourses() {
  const res = await api.get('/courses');

  if (res.status !== 200) {
    throw new Error('Failed to fetch courses');
  }
  return await res.data;
} 



export async function fetchCourses() {
  const res = await api.get('/tutor/courses');
  if (res.status !== 200) throw new Error('Failed to fetch courses');
  return await res.data;
}



export async function fetchStudentCourses(tudent_id:number) {
  const res = await api.get(`/students/courses`);
  if (res.status !== 200) throw new Error('Failed to fetch courses');
  return await res.data;

}

export async function fetchStudentSessions(student_id:number) {
  const res = await api.get(`/students/${student_id}/sessions`);
  if (res.status !== 200) throw new Error('Failed to fetch courses');
  return await res.data;

}

export async function checkEnrollment(courseId: number) {
  const res = await api.get(`/courses/${courseId}enroll`);
  if (res.status !== 200) throw new Error('Failed to check enrollment'); 

  return await res.data;
}



export async function fetchEnrolled() {
  const res = await api.get(`/students/courses`);
  if (res.status !== 200) throw new Error(JSON.stringify({status:res.status,detail:'Failed to check enrollment'})); 

  return await res.data;
}

export async function enrollInCourse( sessionID: number) {
  try {
    const res = await api.post(
      `/sessions/${sessionID}/enroll`
    );

    return res.data; // Axios puts the response body here
  } catch (err: any) {
    throw new Error(err.response?.data?.detail || 'Failed to enroll in course');
  }
}