import React, {useState, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import Graph from "../components/Graph";
import CoordinatesForm from "../components/CoordinatesForm";
import MainHeader from "../components/MainHeader";
import ResultTable from "../components/ResultTable";

export default function MainPage(){
    const [results, setResults] = useState([]);
    const [radius, setRadius] = useState<number>(1);
    const token = localStorage.getItem("token");
    const graphRef = useRef<{ clearGraph: () => void } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/");
        }

        const fetchResults = async () => {
            try {
                const response = await fetch("http://localhost:9119/backend/api/results", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setResults(data);
                } else {
                    console.error("Ошибка получения результатов:", response.statusText);
                }
            } catch (error) {
                console.error("Произошла ошибка при получении результатов:", error);
            }
        };

        fetchResults();
    }, [navigate]);

    const handleAddResult = (result: any) => {
        setResults((prevResults) => [...prevResults, result]);
    };

    const handleClearResults = () => {
        setResults([]);
    };

    const handleClearGraph = () => {
        graphRef.current?.clearGraph();
    };

    return (
        <div className="flex justify-between w-screen h-screen">
            <div className="fixed top-0 left-0 w-full header-shadow z-50">
                <MainHeader/>
            </div>
            <div className="flex ml-10 flex-col justify-center">
                <CoordinatesForm onAddResult={handleAddResult}
                                 onRadiusChange={(newRadius) => setRadius(newRadius)}
                />
            </div>
            <div className="flex flex-col justify-center grow-0 space-y-4">
                <Graph
                    ref={graphRef}
                    width={300}
                    height={300}
                    radius={radius}
                    results={results}
                    onAddResult={handleAddResult}
                    token={token}
                />
            </div>
            <div>
                <ResultTable
                    results={results}
                    onClearResults={handleClearResults}
                    onClearGraph={handleClearGraph}
                />
            </div>
        </div>
    )
}