import React, { useState } from "react";
import { FormControlLabel, Switch, styled } from "@mui/material";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { useTheme } from "./ThemeContext";

const StyledSwitch = styled(Switch)(({theme}) => ({
    width: 70,
    height: 29,
    padding: 7,
    "& .MuiSwitch-switchBase": {
        margin: 1,
        padding: 0,
        transform: "translateX(3px)",
        "&.Mui-checked": {
            color: "#343435",
            transform: "translateX(40px)",
            "& + .MuiSwitch-track": {
                backgroundColor: "#aab4be",
            },
        },
    },
    "& .MuiSwitch-thumb": {
        backgroundColor: "#1e1f26",
        width: 32,
        height: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "& svg": {
            fontSize: "20px",
            color: "#1e1f26",
        },
    },
    "& .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#aab4be",
        borderRadius: 20 / 2,
    },
}));

export default function ThemeSwitch() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <FormControlLabel
            control={
                <StyledSwitch
                    checked={isDark}
                    onChange={toggleTheme}
                    className="mr-2"
                    icon={
                    <div style={{borderRadius: "50%", backgroundColor: "#343435", padding: "2px"}}>
                        <LightModeOutlinedIcon className="-mt-0.5"/>
                    </div>
                }
                    checkedIcon={
                    <div style={{borderRadius: "50%", backgroundColor: "#dde4e6", padding: "2px"}}>
                        <DarkModeOutlinedIcon className="-mt-0.5"/>
                    </div>
                }
                />
            }
            label=""
        />
    );
}
