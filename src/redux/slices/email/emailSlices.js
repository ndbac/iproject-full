import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";

// Action
export const sendMailAction = createAsyncThunk(
  "mail/sent",
  async (email, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.post(`${baseURL}/api/mailing`, {
        from: email?.from,
        to: email?.to,
        subject: email?.subject,
        message: email?.message,
      });
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      } else {
        return rejectWithValue(error?.response?.data);
      }
    }
  }
);

export const sendMailAction2 = createAsyncThunk(
  "mail/sent",
  async (email, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.post(`${baseURL}/api/mailing`, {
        from: email?.from,
        to: email?.to,
        subject: email?.subject,
        message: email?.message,
      });
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      } else {
        return rejectWithValue(error?.response?.data);
      }
    }
  }
);

// Slices
const sendMailSlices = createSlice({
  name: "mail",
  initialState: {},
  extraReducers: (builder) => {
    builder.addCase(sendMailAction.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(sendMailAction.fulfilled, (state, action) => {
      state.isMailSent = true;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(sendMailAction.rejected, (state, action) => {
      state.isMailSent = false;
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
  },
});

export default sendMailSlices.reducer;
