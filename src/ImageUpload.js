import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';


function ImageUpload(props) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [pixelSize, setPixelSize] = useState(26);
    const canvasRef = useRef(null)

    const { resizeRows, resizeColumns, setGridState } = props

    const handlePixelSizeChange = (e) => {
        setPixelSize(Number(e.target.value))
    }

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        if (selectedImage) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            const image = new Image();
            image.src = selectedImage;

            image.onload = () => {
                // Set canvas dimensions to match the image size
                canvas.width = image.width;
                canvas.height = image.height;

                // Draw the image on the canvas
                ctx.drawImage(image, 0, 0, image.width, image.height);

                const spacing = pixelSize;
                const w = image.width;
                const h = image.height;

                const perlerWidth = Math.ceil(w / spacing)
                const perlerHeight = Math.ceil(h / spacing)

                resizeRows(perlerHeight)
                resizeColumns(perlerWidth)

                let newGridState = Array(0)
                // Pixelate the image
                for (let y = 0; y < h; y += spacing) {
                    for (let x = 0; x < w; x += spacing) {
                        const imageData = ctx.getImageData(x, y, spacing, spacing);
                        const pixelColor = getDominantColor(imageData.data);
                        ctx.fillStyle = `rgb(${pixelColor[0]}, ${pixelColor[1]}, ${pixelColor[2]})`;
                        ctx.fillRect(x, y, spacing, spacing);

                        let hexColor = "#" + componentToHex(pixelColor[0]) + componentToHex(pixelColor[1]) + componentToHex(pixelColor[2]);
                        newGridState.push({ color: hexColor })
                    }
                }
                setGridState(newGridState)
            };
        }
    }, [pixelSize, resizeColumns, resizeRows, selectedImage, setGridState]);

    return (
        <div className="imageUpload">
            <Button
                component="label"
                variant="outlined"
            >Upload Image
                <input hidden type="file" accept="image/*" onChange={handleImageUpload} />
            </Button>
            {selectedImage && <TextField onBlur={handlePixelSizeChange} type="number" id="pixelSize" label="Pixel Size (Performance Issues)" variant="filled" defaultValue={pixelSize} />}
            <div className="uploadedImage">
                {selectedImage && <canvas ref={canvasRef} />}
            </div>
        </div>

    );
}
function getDominantColor(pixelData) {
    const r = pixelData[0];
    const g = pixelData[1];
    const b = pixelData[2];
    return [r, g, b];
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}
export default ImageUpload
