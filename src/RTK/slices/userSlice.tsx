import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../type";

interface IUserState {
  user: IUser | null;
  isAuthenticated: boolean;
}

const initialState: IUserState = {
  user: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUserData: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    removeUserData: (state) => {
      state.user = null;
    },

    setAuthenticated: (state) => {
      state.isAuthenticated = true;
    },
    setUnAuthenticated: (state) => {
      state.isAuthenticated = false;
    },
  },
});

export const {
  addUserData,
  removeUserData,
  setAuthenticated,
  setUnAuthenticated,
} = userSlice.actions;
export default userSlice.reducer;
