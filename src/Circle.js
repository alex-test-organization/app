import React, { useState } from 'react';


function Circle(props) {

    const [color, setColor] = useState(props.color)

    const handleColorChange = (e) => {
        setColor(props.color);
    }

    return (
        <div className="outline">
            <div style={{ color: color }} className="circle"
                onDragOver={handleColorChange}
                onMouseDown={handleColorChange}
                onDragEnter={handleColorChange}
            >
            </div>
        </div>
    );
}
export default Circle;