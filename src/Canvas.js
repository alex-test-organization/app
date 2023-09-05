import React, { useState, useEffect } from 'react';

import Circle from './Circle';

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
    }

    const handleColSizeChange = (e) => {
        if (e.target.value === undefined || e.target.value === 0) {
            return
        }
        setColSize(e.target.value)
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

    return (
        <div className="form">
            <h2>Perler App {stepNumber}</h2>
            <label>Rows</label>
            <input label="Rows" value={rowSize} onChange={handleRowSizeChange} />
            <label>Columns</label>
            <input value={colSize} onChange={handleColSizeChange} />
            <label>Color</label>
            <input type="color" id="colorPicker" onChange={handleColorChange} />
            <button onClick={resetGrid}>Reset</button>
            <button disabled={stepNumber === 0} onClick={goBack}>Go Back</button>
            <button disabled={stepNumber === gridHistory.length - 1} onClick={goForward}>Go Foward</button>

            <div className="grid" style={{ "gridTemplateColumns": `repeat(${rowSize}, 2fr)` }}>
                {gridState.map((val, index) => (
                    <Circle index={index} key={index} color={val.color} callback={updateCanvasState} />
                ))}
            </div>
        </div>
    );
}
export default Canvas;