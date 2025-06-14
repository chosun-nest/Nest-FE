/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { refreshAccessToken } from "./auth/auth";
import { store } from "../store";
import { selectAccessToken, clearTokens } from "../store/slices/authSlice";
import { showModal } from "../store/slices/modalSlice";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let subscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  subscribers.forEach((callback) => callback(token));
  subscribers = [];
}

function addSubscriber(callback: (token: string) => void) {
  subscribers.push(callback);
}

API.interceptors.request.use(
  (config) => {
    const skipAuth = (config.headers as any)?.skipAuth;
    if (!skipAuth) {
      const token = selectAccessToken(store.getState());
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (config.headers && (config.headers as any).skipAuth !== undefined) {
      delete (config.headers as any).skipAuth;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error.response?.status;
    const errorMessage = (error.response?.data as any)?.message || "";

    console.warn("에러 상태코드:", status);
    console.warn("에러 메시지:", errorMessage);

    if (status === 401) {
      if (isRefreshing) {
        console.log("🔄 토큰 재발급 중, 대기 중...");
        return new Promise((resolve) => {
          addSubscriber((newToken) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            resolve(API(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await refreshAccessToken();
        const newToken = selectAccessToken(store.getState());

        if (!newToken) throw new Error("❌ 새 토큰 없음");

        onRefreshed(newToken);
        isRefreshing = false;

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return API(originalRequest);
      } catch (refreshError) {
        console.error("🔴 토큰 재발급 실패", refreshError);
        isRefreshing = false;

        store.dispatch(clearTokens());
        store.dispatch(
          showModal({
            title: "세션 만료",
            message: "세션이 만료되었습니다. 다시 로그인해주세요.",
            type: "error",
          })
        );
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // 403 처리
    if (status === 403 && !errorMessage) {
      store.dispatch(
        showModal({
          title: "접근 권한 오류",
          message: "로그인이 필요하거나 권한이 없습니다.",
          type: "error",
        })
      );
    }

    return Promise.reject(error);
  }
);
