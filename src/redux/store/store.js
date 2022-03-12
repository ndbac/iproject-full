import { configureStore } from "@reduxjs/toolkit";
import usersSlices from "../slices/users/usersSlices";

const store = configureStore({
  reducer: {
    users: usersSlices,
  },
});

export default store;
