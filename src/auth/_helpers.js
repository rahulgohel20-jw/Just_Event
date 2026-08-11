import { getData, setData } from '@/utils';

const userId = `${import.meta.env.VITE_APP_NAME}-auth-v${import.meta.env.VITE_APP_VERSION}`;

const getAuth = () => {
  try {
    const auth = getData(userId);
    if (auth) {
      return auth;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error);
  }
};

const setAuth = auth => {
  setData(userId, auth);
  if (auth?.id) {
    localStorage.setItem("userId", auth.id);
  }
};

const removeAuth = () => {
  if (!localStorage) return;
  try {
    localStorage.removeItem(userId);
    localStorage.removeItem("userId");
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error);
  }
};

export function setupAxios(axios) {
  axios.defaults.headers.Accept = 'application/json';
  axios.interceptors.request.use(config => {
    const auth = getAuth();
    if (auth?.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  }, async err => await Promise.reject(err));
}

export { userId , getAuth, removeAuth, setAuth };