import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import Circle from './Circle';
import Result from './Result'


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

    const updateCanvasState = (i) => {

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
        setRowSize(e.target.value)
        setGridHistory([Array(e.target.value * colSize).fill({ color: "white" })])
        setGridState(Array(e.target.value * colSize).fill({ color: "white" }))
    }

    const handleColSizeChange = (e) => {
        if (e.target.value === undefined || e.target.value === 0) {
            return
        }
        setColSize(e.target.value)
        setGridHistory([Array(rowSize * e.target.value).fill({ color: "white" })])
        setGridState(Array(rowSize * e.target.value).fill({ color: "white" }))
    }

    const resetGrid = e => {
        setGridState(new Array(rowSize * colSize).fill({ color: 'white' }))
        const nextHistory = [...gridHistory.slice(0, gridHistory.length), new Array(rowSize * colSize).fill({ color: 'white' })];
        setGridHistory(nextHistory);
        setStepNumber(stepNumber + 1)
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
                <TextField InputProps={boundary} onChange={handleRowSizeChange} type="number" id="rows" label="Rows" variant="filled" defaultValue={rowSize} />
                <TextField InputProps={boundary} onChange={handleColSizeChange} type="number" id="cols" label="Columns" variant="filled" defaultValue={colSize} />
                <input type="color" id="colorPicker" onChange={handleColorChange} />
                <Button onClick={resetGrid} variant="outlined" color="error" size="small">Reset</Button>
                <Button disabled={stepNumber === 0} onClick={goBack} variant="outlined" size="small" >{"<"}</Button>
                <Button disabled={stepNumber === gridHistory.length - 1} onClick={goForward} variant="outlined" size="small">{">"}</Button>
            </Box>

            <div className="grid" style={{ "gridTemplateColumns": `repeat(${colSize}, 2fr)` }}>
                {gridState.map((val, index) => (
                    <Circle index={index} key={index} color={val.color} callback={updateCanvasState} />
                ))}
            </div>
            <div className="result-container" style={{ "gridTemplateColumns": `repeat(8, 2fr)` }}>
                {Object.entries(resultCounts).map((element) => {
                    return (<Result count={element[1]} color={element[0]} />)
                })}
            </div>
        </div >
    );
}
export default Canvas;