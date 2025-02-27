import { createSlice } from "@reduxjs/toolkit";
import * as JWT from 'jwt-decode';

const isTokenValid = (token) => {
    try {
        const decoded = JWT.jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
    } catch (error) {
        return false;
    }
};

const initialState = {
    user: JSON.parse(localStorage.getItem("user") || "null"),
    token: isTokenValid(localStorage.getItem("token")) ? localStorage.getItem("token") : null,
    isAuthenticated: !!localStorage.getItem("token") && isTokenValid(localStorage.getItem("token")),
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.error = null;

            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("user", JSON.stringify(action.payload.user));
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;

            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const { loginSuccess, logout, setError, clearError } = authSlice.actions;
export default authSlice.reducer;
