import React, {useState} from "react";
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    CircularProgress,
    TablePagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface Result {
    x: number;
    y: number;
    r: number;
    isHit: boolean;
    scriptTime: number;
    startTime: string;
}

interface ResultTableProps {
    results: Result[];
    onClearResults: () => void;
    onClearGraph: () => void;
}

export default function ResultTable({ results, onClearResults, onClearGraph }: ResultTableProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
    };

    const handleClose = () => {
        setDeleteDialogOpen(false);
    };

    const handleConfirmDelete = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:9119/backend/api/results", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                onClearResults();
                onClearGraph();
                setDeleteDialogOpen(false);
            } else {
                console.error("Ошибка удаления результатов:", response.statusText);
            }
        } catch (error) {
            console.error("Произошла ошибка при удалении результатов:", error);
        }
        setIsLoading(false);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div className="mr-4 space-y-4">
            <TableContainer component={Paper} className="mt-16" style={{ backgroundColor: "var(--table-color)"}}>
            <Table style={{ backgroundColor: "var(--table-color)"}}>
                <TableHead>
                    <TableRow>
                        <TableCell style={{ color: "var(--table-text-color" }}>x</TableCell>
                        <TableCell style={{ color: "var(--table-text-color" }}>y</TableCell>
                        <TableCell style={{ color: "var(--table-text-color" }}>r</TableCell>
                        <TableCell style={{ color: "var(--table-text-color" }}>результат</TableCell>
                        <TableCell style={{ color: "var(--table-text-color" }}>время (мс)</TableCell>
                        <TableCell style={{ color: "var(--table-text-color" }}>дата и время</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody style={{ color: "var(--table-text-color" }}>
                    {results
                        .slice()
                        .reverse()
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((result, index) => (
                            <TableRow key={index}>
                                <TableCell style={{ color: "var(--table-text-color" }}>{result.x}</TableCell>
                                <TableCell style={{ color: "var(--table-text-color" }}>{result.y}</TableCell>
                                <TableCell style={{ color: "var(--table-text-color" }}>{result.r}</TableCell>
                                <TableCell style={{ color: "var(--table-text-color" }}>{result.isHit ? "попадание" : "мимо"}</TableCell>
                                <TableCell style={{ color: "var(--table-text-color" }}>{result.scriptTime}</TableCell>
                                <TableCell className="break-words" style={{ color: "var(--table-text-color" }}>{result.startTime}</TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={results.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            </TableContainer>
            <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteClick}
            >
                удалить
            </Button>

            <Dialog open={deleteDialogOpen} onClose={handleClose}>
                <DialogTitle>Удалить все результаты?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Вы уверены, что хотите удалить все свои результаты? Это действие нельзя отменить.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Отмена
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        disabled={isLoading}
                        startIcon={isLoading && <CircularProgress size={20} />}
                    >
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}