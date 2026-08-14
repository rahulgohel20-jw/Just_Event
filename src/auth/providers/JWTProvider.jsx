import { createContext, useEffect, useState } from 'react';
import * as authHelper from '../_helpers';
import { login as loginApi, signup as signupApi } from '@/services/apiServices';

export const AuthContext = createContext(null);

// JWTs use base64url, not base64 — atob() alone corrupts payloads containing
// '-' or '_' (exactly the chars in your sample token), so decode manually.
const decodeJwtPayload = (token) => {
  const base64Url = token.split('.')[1];
  if (!base64Url) return null;
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  return JSON.parse(atob(padded));
};

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(authHelper.getAuth());
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('userData');
      return stored ? JSON.parse(stored) : undefined;
    } catch {
      return undefined;
    }
  });

  useEffect(() => {
    (async () => {
      await verify();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

const saveAuth = (authData) => {
  setAuth(authData);
  if (authData) {
    authHelper.setAuth(authData);
  } else {
    authHelper.removeAuth();           // removes the auth key (metronic-tailwind-react-auth-v1...)
    localStorage.removeItem('userData'); // removes the user data key
  }
};

  const verify = async () => {
    const storedAuth = authHelper.getAuth();
    const storedUserRaw = localStorage.getItem('userData');

    if (!storedAuth?.token || !storedUserRaw) {
      saveAuth(undefined);
      setCurrentUser(undefined);
      return;
    }

    try {
      const payload = decodeJwtPayload(storedAuth.token);
      const isExpired = !payload?.exp || payload.exp * 1000 < Date.now();

      if (isExpired) {
        saveAuth(undefined);
        setCurrentUser(undefined);
      } else {
        setAuth(storedAuth);
        setCurrentUser(JSON.parse(storedUserRaw));
      }
    } catch {
      saveAuth(undefined);
      setCurrentUser(undefined);
    }
  };

const login = async (values) => {
  try {
    const response = await loginApi(values);
    const { msg, data, success, errorMessage } = response?.data ?? response ?? {};

    if (!success || !data?.token) {
      throw new Error(errorMessage || msg || 'Login failed');
    }

    saveAuth(data);
    localStorage.setItem('userData', JSON.stringify(data));
    setCurrentUser(data);
    return data;
  } catch (error) {
    saveAuth(undefined);
    throw error;
  }
};

const register = async (payload) => {
  try {
    const response = await signupApi(payload);
    const { msg, data, success } = response ?? {};

    if (!success) {
      throw new Error(msg || 'Signup failed');
    }

    if (data?.token) {
      saveAuth(data);
      localStorage.setItem('userData', JSON.stringify(data));
      setCurrentUser(data);
    }
    return data;
  } catch (error) {
    saveAuth(undefined);
    throw error;
  }
};

  const requestPasswordResetLink = async (email) => {
    // wire to your forgot-password endpoint here
  };

  const changePassword = async (email, token, password, password_confirmation) => {
    // wire to your reset-password endpoint here
  };

  const logout = () => {
    saveAuth(undefined);
    setCurrentUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        auth,
        saveAuth,
        currentUser,
        setCurrentUser,
        login,
        register,
        requestPasswordResetLink,
        changePassword,
        logout,
        verify,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };