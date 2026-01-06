import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { postsApi } from "../features/posts/postsApi";
import { adminApi } from "../features/admin/adminApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [postsApi.reducerPath]: postsApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(postsApi.middleware)
      .concat(adminApi.middleware),
});
