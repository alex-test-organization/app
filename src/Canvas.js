import React, { useState, useEffect } from 'react';

import Circle from './Circle';

function Canvas() {
    const [color, setColor] = useState("white");
    const [rowSize, setRowSize] = useState(30)
    const [colSize, setColSize] = useState(30)

    const handleColorChange = (e) => {
        console.log(e.target.value)
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
        window.location.reload();
    }

    let gridCanvas = Array(rowSize * colSize)
    for (let i = 0; i < rowSize * colSize; i += 1) {
        gridCanvas[i] = <Circle key={`${i}`} color={color} />
    }

    useEffect(() => {
        setColor("#000000")
    }, []);


    return (
        <div className="form">
            <h2>Perler App</h2>
            <label>Rows</label>
            <input label="Rows" value={rowSize} onChange={handleRowSizeChange} />
            <label>Columns</label>
            <input value={colSize} onChange={handleColSizeChange} />
            <label>Color</label>
            <input type="color" id="colorPicker" onBlur={handleColorChange} />
            <button onClick={resetGrid}>Reset</button>
            <div className="grid" style={{ "gridTemplateColumns": `repeat(${rowSize}, 2fr)` }}>
                {gridCanvas}
            </div>
        </div>
    );
}
export default Canvas;