import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import Circle from './Circle';
import Result from './Result'
import SaveDialogForm from './SaveDialogForm';
import LoadDialogForm from './LoadDialogForm';
import ImageUpload from './ImageUpload';

const boundary = {
    inputProps: {
        max: 50, min: 1
    }
}

function Canvas() {
    const [color, setColor] = useState("white");
    const [rowSize, setRowSize] = useState(30)
    const [colSize, setColSize] = useState(30)
    const [stepNumber, setStepNumber] = useState(0)
    const [gridHistory, setGridHistory] = useState([Array(rowSize * colSize).fill({ color: color })]);
    const [gridState, setGridState] = useState(gridHistory[0])
    const [savedItems, setSavedItems] = useState(Object.keys({ ...localStorage }))

    const updateCanvasState = (i, currentColor) => {
        if (currentColor === color) {
            return currentColor
        }

        setStepNumber(stepNumber + 1)
        let copy = [...gridState]
        let item = { ...copy[i] }
        item.color = color
        copy[i] = item

        setGridState(copy)
        const nextHistory = [...gridHistory.slice(0, gridHistory.length), copy];
        setGridHistory(nextHistory);
        return color
    }

    const goBack = () => {
        if (stepNumber > 0) {
            setStepNumber(stepNumber - 1)
            let copy = [...gridHistory[stepNumber - 1]]
            setGridState(copy)
        }
    }

    const goForward = () => {
        if (stepNumber < gridHistory.length) {
            setStepNumber(stepNumber + 1)
            let copy = [...gridHistory[stepNumber + 1]]
            setGridState(copy)
        }
    }

    const handleColorChange = (e) => {
        setColor(e.target.value)
    }

    const handleRowSizeChange = (e) => {
        if (e.target.value === undefined || e.target.value === 0) {
            return
        }
        resizeRows(e.target.value)
    }
    const resizeRows = useCallback((newRows) => {
        setRowSize(newRows)
        setGridHistory([Array(newRows * colSize).fill({ color: "white" })])
        setGridState(Array(newRows * colSize).fill({ color: "white" }))
    }, [colSize])
    const handleColSizeChange = (e) => {
        if (e.target.value === undefined || e.target.value === 0) {
            return
        }
        resizeColumns(e.target.value)
    }
    const resizeColumns = useCallback((newCols) => {
        setColSize(newCols)
        setGridHistory([Array(rowSize * newCols).fill({ color: "white" })])
        setGridState(Array(rowSize * newCols).fill({ color: "white" }))
    }, [rowSize])

    const resetGrid = e => {
        setGridState(new Array(rowSize * colSize).fill({ color: 'white' }))
        const nextHistory = [...gridHistory.slice(0, gridHistory.length), new Array(rowSize * colSize).fill({ color: 'white' })];
        setGridHistory(nextHistory);
        setStepNumber(stepNumber + 1)
    }

    const saveGridInfo = (saveName) => {
        let grid = JSON.stringify({
            rows: rowSize,
            columns: colSize,
            gridState: gridState
        })
        localStorage.setItem(saveName, grid)
        setSavedItems([...savedItems, saveName])
    }

    const loadGridInfo = (info) => {
        let data = localStorage.getItem(info)
        let values = JSON.parse(data)
        setStepNumber(0)
        setRowSize(values.rows)
        setColSize(values.columns)
        setGridState(values.gridState)
        setGridHistory([Array(rowSize * colSize).fill({ color: color })])
    }

    const deleteCallback = (saveName) => {
        localStorage.removeItem(saveName)
        setSavedItems(savedItems.filter(e => e !== saveName))
    }

    useEffect(() => {
        setColor("#000000")
    }, []);

    const resultCounts = gridState.reduce((acc, cur) => {
        if (acc[cur.color]) {
            acc[cur.color]++
        } else {
            acc[cur.color] = 1
        }
        return acc
    }, {})


    return (
        <div className="form">
            <Box className="controlPanel" sx={{ '& button': { m: 1 } }}>
                <Typography variant="h3" gutterBottom>
                    Perler App: {stepNumber}
                </Typography>
                <TextField InputProps={boundary} onChange={handleRowSizeChange} type="number" id="rows" label="Rows" variant="filled" value={rowSize} />
                <TextField InputProps={boundary} onChange={handleColSizeChange} type="number" id="cols" label="Columns" variant="filled" value={colSize} />
                <TextField disabled id="total" label="Total" variant="filled" value={rowSize * colSize} />
                <input type="color" id="colorPicker" onChange={handleColorChange} />
                <Button onClick={resetGrid} variant="outlined" color="error" size="small">Reset</Button>
                <Button disabled={stepNumber === 0} onClick={goBack} variant="outlined" size="small" >{"<"}</Button>
                <Button disabled={stepNumber === gridHistory.length - 1} onClick={goForward} variant="outlined" size="small">{">"}</Button>
                <SaveDialogForm callback={saveGridInfo} deleteCallback={deleteCallback} loadableItems={savedItems} />
                <LoadDialogForm callback={loadGridInfo} deleteCallback={deleteCallback} loadableItems={savedItems} />
                <ImageUpload resizeRows={resizeRows} resizeColumns={resizeColumns} setGridState={setGridState} />
            </Box>

            <div className="grid" style={{ "gridTemplateColumns": `repeat(${colSize}, 2fr)` }}>
                {gridState.map((val, index) => (
                    <Circle index={index} key={index} color={val.color} callback={updateCanvasState} />
                ))}
            </div>
            <div className="result-container" style={{ "gridTemplateColumns": `repeat(8, 2fr)` }}>
                {Object.entries(resultCounts).sort(compareResults).map((element, index) => {
                    return (<Result key={index} count={element[1]} color={element[0]} />)
                })}
            </div>
        </div >
    );
}


function compareResults(a, b) {
    if (a[1] < b[1]) {
        return 1
    } else if (a[1] === b[1]) {
        return 0
    } else {
        return -1
    }
}
export default Canvas;