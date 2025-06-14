import { configureStore } from "@reduxjs/toolkit"; // getDefaultMiddleware 임포트
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import authReducer from "./slices/authSlice";
import modalReducer from "./slices/modalSlice";
import userReducer from "./slices/userSlice"; // yeong-eun. 게시글 UI 본인/다른사용자 구분하기 위해 userSlice 만듦.

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "userId"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  modal: modalReducer,
  user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  // middleware 옵션을 추가하여 기본 미들웨어를 커스터마이징
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist 관련 액션 타입들을 직렬화 체크에서 무시하도록 설정
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
