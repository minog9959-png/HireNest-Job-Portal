// Backend se baat karne ka ek hi jagah code.
// Token har request ke sath header me jata hai.
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function api(path, method = 'GET', body) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

// File upload (FormData) ke liye alag helper: Content-Type header nahi lagate,
// browser khud multipart boundary lagata hai.
export async function apiUpload(path, formData) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}
