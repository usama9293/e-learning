const API_URL = "https://e-learning-backend-7-57nd.onrender.com/api/v1/auth";

/**
 * Register a new user (student or tutor)
 * @param {object} data - Registration form data
 * @returns {Promise<any>} - API response
 */
export async function register(data) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      // Map frontend form fields to backend expected fields
      role: data.role,
      email: data.email,
      password: data.password,
      full_name: data.fullName,
      dob: data.dob,
      gender: data.gender,
      contact_number: data.contactNumber,
      address: data.homeAddress,
      grade_level: data.gradeLevel,
      emergency_contact: data.emergencyContact,
      parent_guardian: data.parentName,
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

/**
 * Login user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<any>} - API response
 */
export async function login(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username: email, password }),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function getMe(token) {
  const res = await fetch(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}
