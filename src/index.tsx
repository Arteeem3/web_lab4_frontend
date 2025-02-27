import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import "./assets/index.css";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {CustomThemeProvider} from "./components/ThemeContext";
import store from "./store/store";
import {Provider} from "react-redux";

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <LoginPage />
        },
        {
            path: "/main",
            element: <MainPage />
        }
    ]
);

const libTheme = createTheme({
    palette: {
        primary: {
            main: "#666666",
        },
        secondary: {
            main: "#9999CC",
        },
        info: {
            main: "#9966FF"
        },
    },
    typography: {
        fontFamily: "Montserrat, Arial, sans-serif",
        button: {
            textTransform: "none",
            fontSize: "medium",
            fontWeight: 350,
        },
    },
});

const root = createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <ThemeProvider theme={libTheme}>
            <CustomThemeProvider>
                <React.StrictMode>
                    <RouterProvider router={router} />
                </React.StrictMode>
            </CustomThemeProvider>
        </ThemeProvider>
    </Provider>
);