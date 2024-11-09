import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { message: string } = {
  message: "",
};

const responseMessageSlice = createSlice({
  name: "responseMessage",
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
  },
});

export const { setMessage } = responseMessageSlice.actions;
export default responseMessageSlice.reducer;
