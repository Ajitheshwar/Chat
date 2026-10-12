import { createContext, useEffect, useState } from "react";
import { login, logout, register, getMe } from "../apis/auth";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getMe()
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => {
        setUser(null);
        console.error("Error fetching user:", error);
      });
  }, []);

  const loginUser = async (formData: {
    username: string;
    password: string;
  }) => {
    try {
      setLoading(true);
      const response = await login(formData);
      setUser(response.data.user);
      await getMe(); // Fetch the user data after login
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (formData: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      setLoading(true);
      await register(formData);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setUser(null);
    await logout();
  };

  return (
    <AuthContext.Provider
      value={{ user, loginUser, registerUser, logoutUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
