import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: "https://256d59e9e4eeb351f01ba24a2579c157.balena-devices.com/api/v1/", // Substitua com a URL base do seu backend
  timeout: 5000,
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync("JSESSION");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    return config;
  }
});

export default api;
