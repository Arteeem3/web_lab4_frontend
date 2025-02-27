import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Typography,
} from "@mui/material";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import ThemeSwitch from "./ThemeSwitch";
import { useTheme } from "./ThemeContext";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

export default function MainHeader() {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const dispatch = useDispatch();

    const [isLogoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const [isUserDialogOpen, setUserDialogOpen] = useState(false);
    const [userStats, setUserStats] = useState({
        login: "Загрузка...",
        totalResults: 0,
        hits: 0,
        misses: 0,
    });

    const fetchUserStats = async () => {
        try {
            const response = await fetch("http://localhost:24147/backend/api/results/userStats", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setUserStats({
                    login: data.login,
                    totalResults: data.totalResults,
                    hits: data.hits,
                    misses: data.misses,
                });
            } else {
                console.error("Ошибка получения статистики пользователя:", response.statusText);
            }
        } catch (error) {
            console.error("Произошла ошибка при получении статистики:", error);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    const toggleLogoutDialog = () => {
        setLogoutDialogOpen(!isLogoutDialogOpen);
    };

    const toggleUserDialog = () => {
        if (!isUserDialogOpen) {
            fetchUserStats();
        }
        setUserDialogOpen(!isUserDialogOpen);
    };

    return (
        <header>
            <div className="flex justify-center w-screen">
                <div className="fixed w-full items-baseline ml-6">
                    <IconButton
                        aria-label="logout"
                        size="large"
                        style={{ color: isDark ? "white" : "black" }}
                        onClick={toggleLogoutDialog}>
                        <LogoutIcon/>
                    </IconButton>
                </div>
                <header className="text-center">
                    <h1>Лабораторная работа №4</h1>
                    <h1>Соколов Артём Олегович P3218, вариант 8746</h1>
                </header>
                <div className="fixed right-0 mr-4">
                    <ThemeSwitch/>
                    <IconButton
                        aria-label="user"
                        style={{ color: isDark ? "white" : "black" }}
                        size="large"
                        onClick={toggleUserDialog}
                    >
                        <AccountCircleOutlinedIcon fontSize="medium"/>
                    </IconButton>
                </div>
            </div>

            <Dialog
                open={isLogoutDialogOpen}
                onClose={toggleLogoutDialog}
                aria-labelledby="logout-dialog-title"
                aria-describedby="logout-dialog-description"
            >
                <DialogTitle id="logout-dialog-title">{"Вы точно хотите выйти из аккаунта?"}</DialogTitle>
                <DialogActions>
                    <Button onClick={toggleLogoutDialog} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleLogout} color="error" autoFocus>
                        Выйти
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={isUserDialogOpen}
                onClose={toggleUserDialog}
                aria-labelledby="user-dialog-title"
                aria-describedby="user-dialog-description"
            >
                <DialogTitle id="user-dialog-title">Профиль пользователя</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">Логин: {userStats.login}</Typography>
                    <Typography variant="body1">
                        Количество результатов: {userStats.totalResults}
                    </Typography>
                    <Typography variant="body1">Попаданий: {userStats.hits}</Typography>
                    <Typography variant="body1">Промахов: {userStats.misses}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleUserDialog} color="primary">
                        Закрыть
                    </Button>
                </DialogActions>
            </Dialog>
        </header>
    )
    }