import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ILink } from "../../type";

interface ILinkState {
  links: ILink[];
}

const initialState: ILinkState = { links: [] };

const linkSlice = createSlice({
  name: "links",
  initialState,
  reducers: {
    addLinks: (state, action: PayloadAction<ILink[]>) => {
      state.links = [...action.payload];
    },
  },
});

export const { addLinks } = linkSlice.actions;
export default linkSlice.reducer;
