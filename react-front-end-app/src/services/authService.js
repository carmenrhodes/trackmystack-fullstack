const API_BASE = "http://localhost:8080/api";

export async function login({ email, password }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Login failed (${res.status}) ${text}`);
  }

  const data = await res.json();
   if (!data?.token) {
    throw new Error("Login succeeded but no token was returned.");
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("userEmail", email);

  return data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function isLoggedIn() {
  return !!getToken();
}