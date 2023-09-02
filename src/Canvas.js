import React, { useState } from 'react';

import Circle from './Circle';


function Canvas() {
    // Declare a new state variable, which we'll call "count"
    const [color, setColor] = useState("red");
    const [size, setSize] = useState(18)

    const handleColorChange = (e) => {
        setColor(e.target.value)
    }
    const handleSizeChange = (ev) => {
        if(ev.target.value === undefined || ev.target.value === 0) {
            return
        }
        setSize(ev.target.value)
    }
    
    const gridCanvas = Array(size).fill(Array(size))

    for (let i = 0; i < size; i += 1) {
        for (let j = 0; j < size; j += 1) {
            gridCanvas[i][j] = <Circle key={`${i} ${j}`} color={color} />
        }
    }

    return (
        <div className="form">
            <input value={size} onChange={handleSizeChange}/>
            <select name="color" id="colors" onChange={handleColorChange}>
                <option value="red">Red</option>
                <option value="black">Black</option>
                <option value="green">Green</option>
                <option value="yellow">Yellow</option>
            </select>

            <div className="grid" style={{ "gridTemplateColumns": `repeat(${size}, 2fr)` }}>
                {gridCanvas}
            </div>
        </div>
    );
}
export default Canvas;