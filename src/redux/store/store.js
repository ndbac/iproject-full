import { configureStore } from "@reduxjs/toolkit";

import sendMailReducer from "../slices/email/emailSlices";

const store = configureStore({
  reducer: {
    sendMailReducer,
  },
});

export default store;
