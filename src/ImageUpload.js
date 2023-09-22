import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import yuiLogo from "./yui.gif"

function ImageUpload(props) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [pixelSize, setPixelSize] = useState(26);
    const canvasRef = useRef(null)
    const [sourceUrl, setSourceUrl] = useState(null)
    const [scale, setScale] = useState(0.5)
    const [isImageLoading, setIsImageLoading] = useState(false)
    const [waifuButtonText, setWaifuButtonText] = useState("Waifu Button")
    const [didImageFailToLoad, setDidImageFailToLoad] = useState(false)

    const { resizeRows, resizeColumns, setGridState } = props

    const handlePixelSizeChange = (e) => {
        setPixelSize(Number(e.target.value))
    }

    const handleScaleChange = (e) => {
        setScale(Number(e.target.value))
    }

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            setSourceUrl(null)
        }
    };

    const handleImageFetch = () => {
        let url = `https://api.waifu.im/search?${new Date().getTime()}`
        const params = {};
        const queryParams = new URLSearchParams(params);
        const requestUrl = `${url}?${queryParams}`;
        setIsImageLoading(true)
        fetch(requestUrl)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Request failed with status code: ' + response.status);
                }
            })
            .then(data => {
                setSourceUrl(data.images[0].source)
                setSelectedImage(data.images[0].url)
            })
            .catch(error => {
                setIsImageLoading(false)
                setDidImageFailToLoad(true)
                console.error('An error occurred:', error.message);
            });
    }

    useEffect(() => {
        if (selectedImage) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            const image = new Image();
            image.setAttribute('crossOrigin', '');
            image.src = selectedImage;

            image.onload = () => {
                setWaifuButtonText("Waifu Button")
                setDidImageFailToLoad(false)
                setIsImageLoading(false)
                image.width *= scale
                image.height *= scale

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
            image.onerror = () => {
                setWaifuButtonText("Try Another image")
                setIsImageLoading(false)
                setDidImageFailToLoad(true)
            }
        }
    }, [pixelSize, resizeColumns, resizeRows, selectedImage, setGridState, scale]);

    return (
        <Box className="imageUpload" sx={{ '& button': { m: 1 } }}>
            <Button
                variant="outlined"
            >Upload Image
                <input hidden type="file" accept="image/*" onChange={handleImageUpload} />
            </Button>
            <Button
                color={didImageFailToLoad ? "error" : "success"}
                variant="outlined"
                disabled={isImageLoading}
                onClick={handleImageFetch}
            >{isImageLoading ? "Loading..." : waifuButtonText}
            </Button>
            {selectedImage && <TextField onChange={handleScaleChange} type="number" value={scale} inputProps={{ min: 0.1, max: 1, step: "0.1" }} label="Scaling" variant="filled" />}
            {selectedImage && <TextField onBlur={handlePixelSizeChange} type="number" id="pixelSize" label="Pixel Size (Performance Issues)" variant="filled" defaultValue={pixelSize} />}
            <div className="uploadedImage">
                <div>
                    {!!sourceUrl && <div>Source: <a href={sourceUrl}>{sourceUrl}</a></div>}
                    {isImageLoading && <CircularProgress />}
                </div>
                {didImageFailToLoad && <div className="errorScreen">
                    <div>Could not Load image</div>
                    <img src={yuiLogo} alt="" />
                </div>}
                {selectedImage && <canvas ref={canvasRef} />}
            </div>
        </Box>
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
