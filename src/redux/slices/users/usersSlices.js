import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import axios from "axios";

// Slices
const usersSlices = createSlice({
  name: "users",
  initialState: { userAuth: "login" },
  extraReducers: (builder) => {},
});

export default usersSlices.reducer;
