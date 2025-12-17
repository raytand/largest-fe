const API_URL = "https://localhost:7121/api";

let token = null;

export const setToken = (t) => {
  token = t;
};

const authHeaders = () => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: "Bearer " + token } : {}),
});

const handleResponse = async (res) => {
  let data = null;

  try {
    data = await res.json();
  } catch {
    // якщо бек не повернув JSON
  }

  if (!res.ok) {
    throw data ?? { title: res.statusText };
  }

  return data;
};

export const fetchGet = async (url) => {
  const res = await fetch(`${API_URL}${url}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
};

export const fetchPost = async (url, body) => {
  const res = await fetch(`${API_URL}${url}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  return handleResponse(res);
};

export const fetchPut = async (url, body) => {
  const res = await fetch(`${API_URL}${url}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  return handleResponse(res);
};

export const fetchDelete = async (url) => {
  const res = await fetch(`${API_URL}${url}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(res);
};
