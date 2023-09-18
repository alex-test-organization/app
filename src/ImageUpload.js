import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    convertToPixelCrop,
} from 'react-image-crop'

import 'react-image-crop/dist/ReactCrop.css'

function ImageUpload(props) {

    const canvasRef = useRef(null)
    const [selectedImage, setSelectedImage] = useState(null);
    const [pixelSize, setPixelSize] = useState(26);
    const [crop, setCrop] = useState(undefined);
    const [aspect, setAspect] = useState(undefined)
    const [completedCrop, setCompletedCrop] = useState(undefined)

    const { resizeRows, resizeColumns, setGridState } = props

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setCrop(undefined)
            setSelectedImage(URL.createObjectURL(file));
            setAspect(16 / 9)
        }
    };

    const centerAspectCrop = (mediaWidth, mediaHeight, aspect) => {
        return centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 90,
                },
                aspect,
                mediaWidth,
                mediaHeight,
            ),
            mediaWidth,
            mediaHeight,
        )
    }

    const onImageLoad = (event) => {
        if (aspect) {
            const { width, height } = event.currentTarget
            const newCrop = centerAspectCrop(width, height, 16 / 9)
            setCrop(newCrop)
            setCompletedCrop(convertToPixelCrop(newCrop, width, height))
        }
    }

    const handlePixelSizeChange = (e) => {
        setPixelSize(Number(e.target.value))
    }

    useEffect(() => {
        if (selectedImage && completedCrop) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });

            const image = new Image();
            image.src = selectedImage;

            const scaleX = image.naturalWidth / image.width
            const scaleY = image.naturalHeight / image.height
            const pixelRatio = window.devicePixelRatio
            canvas.width = Math.floor(completedCrop.width * scaleX * pixelRatio)
            canvas.height = Math.floor(completedCrop.height * scaleY * pixelRatio)

            ctx.scale(pixelRatio, pixelRatio)
            // const rotateRads = rotate * TO_RADIANS
            const centerX = image.naturalWidth / 2
            const centerY = image.naturalHeight / 2

            ctx.save()
            const cropX = completedCrop.x * scaleX
            const cropY = completedCrop.y * scaleY

            // 5) Move the crop origin to the canvas origin (0,0)
            ctx.translate(-cropX, -cropY)
            // 4) Move the origin to the center of the original position
            ctx.translate(centerX, centerY)
            // 3) Rotate around the origin
            // 2) Scale the image
            const scale = 1
            ctx.scale(scale, scale)
            // 1) Move the center of the image to the origin (0,0)
            ctx.translate(-centerX, -centerY)

            image.onload = () => {
                ctx.drawImage(
                    image,
                    0,
                    0,
                    image.naturalWidth,
                    image.naturalHeight,
                    0,
                    0,
                    image.naturalWidth,
                    image.naturalHeight,
                )
                ctx.restore()

                const spacing = pixelSize;
                const w = completedCrop.width;
                const h = completedCrop.height;

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
    }, [completedCrop, pixelSize, resizeColumns, resizeRows, selectedImage, setGridState]);

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
                {selectedImage && <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                >
                    <img
                        ref={canvasRef}
                        alt="Crop me"
                        src={selectedImage}
                        onLoad={onImageLoad}
                    />
                </ReactCrop>}
                {selectedImage && completedCrop && <canvas ref={canvasRef} style={{
                    border: '1px solid black',
                    objectFit: 'contain',
                    width: completedCrop.width,
                    height: completedCrop.height,
                }} />}
            </div>
        </div>
    )
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
