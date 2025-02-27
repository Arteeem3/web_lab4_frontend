import React, { useState } from 'react';
import { Slider } from 'primereact/slider';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/mira/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import {Button, CircularProgress} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {CheckOutlined} from "@mui/icons-material";
import { useSelector } from "react-redux";

interface CoordinatesFormProps {
    onAddResult: (result: any) => void;
}

export default function CoordinatesForm ({ onAddResult, onRadiusChange }: CoordinatesFormProps & { onRadiusChange: (r: number) => void }){
    const [x, setX] = useState<number>(0);
    const [y, setY] = useState<string>('');
    const [r, setR] = useState<number>(1);
    const [error, setError] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem('token');

    const handleYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numValue = parseFloat(value);
        if (numValue >= -3 && numValue <= 3) {
            setY(value);
            setError(false);
            e.target.setCustomValidity("");
            e.target.reportValidity();
        } else {
            e.target.setCustomValidity("Y должен быть числом от -3 до 3");
            e.target.reportValidity();
            setY(value);
            setError(true);
        }
    };

    const handleRadiusChange = (e: any) => {
        const newRadius = e.value as number;
        setR(newRadius);
        onRadiusChange(newRadius);
    };

    const handleSubmit = async () => {
        const url = `http://localhost:24147/backend/api/results`;
        setIsLoading(true);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ x, y, r }),
            });

            if (response.ok) {
                const data = await response.json();
                onAddResult(data);
            } else {
                console.log(`Ошибка: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.log(`Произошла ошибка: ${error}`);
        }
        setIsLoading(false);
    };

    return (
        <div className="p-d-flex p-flex-column p-ai-start space-y-4" style={{width: '300px', gap: '1rem'}}>
            <div id="x-fields" className="p-field flex h-15">
                <label htmlFor="x-slider">x</label>
                <Slider
                    id="x-slider"
                    value={x}
                    onChange={(e) => setX(e.value as number)}
                    min={-3}
                    max={5}
                    step={0.1}
                    className="w-3/4 ml-6 mt-3"
                />
            </div>
            <p className="w-3/4 text-center ml-8">{x}</p>

            <div id="y-fields" className="p-field flex h-15">
                <label htmlFor="y-input">y</label>
                <InputText
                    id="y-input"
                    value={y}
                    className="w-3/4 ml-6 h-7 text-center"
                    keyfilter="num"
                    placeholder="-3...3"
                    onChange={handleYChange}
                />
            </div>

            <div className="p-field flex h-15">
                <label htmlFor="radius-slider">r</label>
                <Slider
                    id="radius-slider"
                    value={r}
                    onChange={handleRadiusChange}
                    min={0.1}
                    max={5}
                    step={0.1}
                    className="w-3/4 ml-6 mt-3"
                />
            </div>
            <p className="w-3/4 text-center ml-8">{r}</p>

            <div className="flex justify-between">
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    color="secondary"
                    size="medium"
                    disabled={isLoading || !!error}
                    startIcon={isLoading ? <CircularProgress size={20}/> : <CheckOutlined />}
                >
                    проверить
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    size="medium"
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                        setX(0);
                        setY('');
                        setR(1);
                        setError(true);
                        handleRadiusChange({ value: 1 });
                    }}
                >
                    очистить
                </Button>
            </div>
        </div>
    );
};
