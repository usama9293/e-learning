const API_URL = 'https://e-learning-backend-7-57nd.onrender.com';

export async function fetchSessions(token: string) {
  const res = await fetch('http://localhost:8000/api/v1/admin/sessons', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch sessions');
  return await res.json();
}

export async function checkEnrollment(token: string, courseId: number) {
  const res = await fetch(`http://localhost:8000/api/v1/courses/${courseId}enroll`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to check enrollment'); 

  return await res.json();
}



export async function fetchSessionsForCourse(token: string,courseID:Number) {
  const res = await fetch(`http://localhost:8000/api/v1/courses/${courseID}/sessions`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch sessions');
  return await res.json();
}