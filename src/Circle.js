import React, { useState } from 'react';


function Circle(props) {

    const [, setColor] = useState(props.color)

    const handleColorChangeOnEnter = (e) => {
        if (e.buttons === 1) {
            handleColorChangeClick(e)
        }
    }

    const handleColorChangeClick = (e) => {
        let newColor = props.callback(props.index)
        setColor(newColor);
    }

    return (
        <div style={{ color: props.color }} className="circle" index={`circle${props.index}`}
            onPointerDown={handleColorChangeClick}
            onPointerEnter={handleColorChangeOnEnter}
        >
        </div>
    );
}
export default Circle;