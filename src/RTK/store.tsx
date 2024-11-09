import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { TypedUseSelectorHook, useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import linksReducer from "./slices/linkSlice";
import responseMessageReducer from "./slices/respMessageSlice";
import userReducer from "./slices/userSlice";
import { odlApiSlice } from "./API/odlApiSlice";

export const store = configureStore({
  reducer: {
    allLinks: linksReducer,
    responseMessage: responseMessageReducer,
    userReducer: userReducer,

    [odlApiSlice.reducerPath]: odlApiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(odlApiSlice.middleware),
});

setupListeners(store.dispatch);

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
