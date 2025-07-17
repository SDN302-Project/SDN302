import React, { createContext, useContext, useEffect, useState } from "react";
import authApi from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true); // để biết đang load user

  // Hàm login gọi authApi.login rồi set user
  const login = async (credentials) => {
    const { user, token } = await authApi.login(credentials);
    setUser(user);
    return { user, token };
  };

  // Hàm logout xóa token và user
  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  // Khi app load lần đầu, load token từ localStorage, nếu có thì lấy profile từ API
  useEffect(() => {
    const loadUser = async () => {
      setLoadingUser(true);
      const token = authApi.getToken();
      if (!token) {
        setLoadingUser(false);
        return;
      }

      try {
        const profile = await authApi.getProfile();
        authApi.saveUser(profile); // đồng bộ lại localStorage user
        setUser(profile);
      } catch (error) {
        authApi.logout();
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loadingUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook tiện dụng để lấy user, login, logout trong component
export const useAuth = () => useContext(AuthContext);
