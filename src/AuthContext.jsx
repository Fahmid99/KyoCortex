import { createContext, useContext, useState, useEffect } from "react";
import dcpService from "./services/dcpService";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const { isAuthenticated, isAdmin } = await dcpService.isAuthenticated();
        setIsLoggedin(isAuthenticated);
        setIsAdmin(isAdmin);
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedin, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);