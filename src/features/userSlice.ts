import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type for the user
interface User {
  username: string;
  email: string;
  token: string;
}

// Define the type for the initial state
export interface UserState {
  user: User | null;
  loggedIn: boolean;
}

// Initialize the state
const initialState: UserState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null,
  loggedIn: !!localStorage.getItem("token"),
};

// Create the slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
      state.loggedIn = true;

      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.loggedIn = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

// Export actions and reducer
export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
