import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return sessionStorage.getItem("token");
  });

  const login = (userData, authToken) => {
    console.log("Auth Login");
    console.log("USER:", userData);
    console.log("TOKEN RECEIVED:", !!authToken);
    setUser(userData);
    setToken(authToken);

    sessionStorage.setItem("user", JSON.stringify(userData));

    sessionStorage.setItem("token", authToken);

    console.log("TOKEN SAVED:", !!sessionStorage.getItem("token"));
    console.log("USER SAVED:", !!sessionStorage.getItem("user"));
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
