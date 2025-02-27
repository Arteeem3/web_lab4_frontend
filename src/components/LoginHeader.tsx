import React from "react";
import ThemeSwitch from "./ThemeSwitch";

export default function LoginHeader() {
    return (
        <header className="text-center">
            <div className="flex fixed w-full items-baseline ml-6 mt-2">
                <ThemeSwitch />
            </div>
            <h1>Лабораторная работа №4</h1>
            <h1>Соколов Артём Олегович P3218, вариант 8746</h1>
        </header>
    )
}