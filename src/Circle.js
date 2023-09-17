import React, { useState } from 'react';


function Circle(props) {

    const [, setColor] = useState(props.color)

    const handleColorChange = (e, callback) => {
        let newColor = callback(props.index)
        setColor(newColor);
    }

    return (
        <div className="outline" index={`circle${props.index}`} >
            <div style={{ color: props.color }} className="circle" index={`circle${props.index}`}
                onDragOver={(e) => handleColorChange(e, props.callback)}
                onMouseDown={(e) => handleColorChange(e, props.callback)}
                onDragEnter={(e) => handleColorChange(e, props.callback)}
            >
            </div>
        </ div>
    );
}
export default Circle;