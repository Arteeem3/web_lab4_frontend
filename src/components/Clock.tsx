import React, {useEffect, useState } from "react";
import '../assets/clock.css';

export default function Clock() {
    const [date, setDate] = useState(new Date());
    useEffect(() => {
        let timer = setInterval(() => setDate(new Date()), 1000);
        return function cleanup() {
            clearInterval(timer);
        }
    }, []);

    const deg = 6;
    let day = date;
    let hh = day.getHours() * 30;
    let mm = day.getMinutes() * deg;
    let ss = day.getSeconds() * deg;

    return (
        <div className="flex flex-col ml-32">
            <div className="clock">
                <div className="hour" style={{transform: `rotateZ(${hh + mm / 12}deg)`}}></div>
                <div className="min" style={{transform: `rotateZ(${mm}deg)`}}></div>
                <div className="sec" style={{transform: `rotateZ(${ss}deg)`}}></div>
            </div>
        </div>
    )
}