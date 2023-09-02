import React, { useState } from 'react';


function Circle(props) {

    const [color, setColor] = useState(props.color)

    const handleColorChange = (e) => {

        setColor(props.color);
    }

    return (
        <div style={{ color: color }} className="circle"
            onDragOver={handleColorChange}
            onMouseDown={handleColorChange}
            onDragEnter={handleColorChange}
        >
            <p className="text"> </p>
        </div>
    );
}
export default Circle;