// 📦 authApi.js
const BASE_URL = "https://prevention-api-tdt.onrender.com/api/v1";

// 🛠️ Helper dùng chung
const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const token = localStorage.getItem("token");
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Lỗi khi gọi API xác thực");
  }

  return data;
};

// 📌 API chính
const login = async ({ email, password }) => {
  const res = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  const token = res.token;
  const user = res.data?.user;

  if (!token || !user) {
    throw new Error("Thiếu token hoặc user trong phản hồi");
  }

  saveUser(user);
  saveToken(token);

  return { user, token };
};

const register = async ({ name, email, password, passwordConfirm }) => {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password, passwordConfirm }),
  });
};

const forgotPassword = async (email) => {
  return request("/auth/forgotPassword", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

const resetPassword = async ({ token, password, passwordConfirm }) => {
  return request(`/auth/resetPassword/${token}`, {
    method: "PATCH",
    body: JSON.stringify({ password, passwordConfirm }),
  });
};

const getProfile = async () => {
  return request("/users/me", {
    method: "GET",
  });
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const saveToken = (token) => {
  localStorage.setItem("token", token);
};

const saveUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

const getToken = () => localStorage.getItem("token");

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export default {
  login,
  register,
  forgotPassword,
  resetPassword,
  getProfile,
  logout,
  saveToken,
  saveUser,
  getToken,
  getUser,
};
