import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import {Button, CircularProgress} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {loginSuccess, setError} from "../store/authSlice";

export default function LoginForm() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // @ts-ignore
    const error = useSelector((state) => state.auth.error);

    const toggleRegisterMode = () => {
        dispatch(setError(null));
        setIsRegistering(!isRegistering);
    };

    const handleSubmit = async () => {
        if (!login || !password) {
            dispatch(setError("Заполните все поля"));
            return;
        }
        if (isRegistering && password !== confirmPassword) {
            dispatch(setError("Пароли не совпадают"));
            return;
        }

        const endpoint = isRegistering ? "/auth/register" : "/auth/login";
        console.log(`так так щас я добавляю пользователя ${login}`);
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:24147/backend/api${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login, password }),
            });

            if (response.ok) {
                console.log("так так пользователь ХОРОШ и добавлен");
                const data = await response.json();
                dispatch(loginSuccess({user: login, token: data.token}));
                navigate("/main");
            } else if (isRegistering && response.status === 409) {
                console.error("Error:", await response.text());
                dispatch(setError("Пользователь с таким логином\n уже существует"));
            } else if (!isRegistering && response.status === 401) {
                console.error("Error:", await response.text());
                dispatch(setError("Неверный логин или пароль"));
            } else {
                console.error("Error:", await response.text());
                const errorText = await response.text();
                dispatch(setError(errorText));
            }
        } catch (error) {
            console.error("Network error:", error);
            dispatch(setError("Network error: " + error.message));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="flex flex-col mr-32 mb-12 justify-center">
            <div className="flex items-center mb-2">
                <label htmlFor="login" className="mr-2 w-1/4">логин</label>
                <input
                    type="text"
                    id="login"
                    className="border border-color-auth text-color-input rounded-md p-2 w-3/4"
                    placeholder="ваш логин"
                    onChange={(e) => setLogin(e.target.value)}
                />
            </div>
            <div className="flex items-center mb-2">
                <label htmlFor="password" className="mr-2 w-1/4">пароль</label>
                <input
                    type="password"
                    id="password"
                    className="border border-color-auth text-color-input rounded-md p-2 w-3/4"
                    placeholder="ваш пароль"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            {isRegistering && (
                <div className="flex items-center mb-2">
                    <label htmlFor="confirmPassword" className="mr-2 w-1/4"></label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="border border-color-auth text-color-input rounded-md p-2 w-3/4 ml-auto"
                        placeholder="повторите пароль"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
            )}
            <div className="space-y-2 flex flex-col grow-0">
                <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    startIcon={isLoading && <CircularProgress size={20} />}
                >
                    {isLoading ? "загрузка..." : (isRegistering ? "зарегистрироваться" : "войти")}
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    onClick={toggleRegisterMode}
                >
                    {isRegistering ? "я уже смешарик" : "я тут первый раз ваще"}
                </Button>
                {error && (
                    <p className="text-red-600 text-center mt-4 break-words whitespace-pre-wrap">{error}</p>
                )}
            </div>
        </form>
    );
};