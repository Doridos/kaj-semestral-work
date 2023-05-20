import './Canvas.css'
import {useOnDraw} from './Hooks.jsx'

let history = [];
let steps = -1;
let isTextInputMode = false;
let isDragging = false;
let isImageInputMode = true;
const Canvas = ({
    width,
    height,
    color,
    inputWidth
}) => {if(width !== undefined && height !== undefined){


    const setCanvasRef = useOnDraw(onDraw)
    function onDraw(ctx, point, previousPoint){
        if (!isDragging){
            drawLine(previousPoint, point, ctx, color, inputWidth)
        }

    }

    function drawLine(start,
                      end,
                      ctx,
                      color,
                      strokeWidth
    ){
        start = start ?? end;
        ctx.beginPath();
        ctx.lineWidth = inputWidth;
        ctx.strokeStyle = color;
        ctx.lineJoin = "round"; // Creates a rounded corner when lines meet
        ctx.lineCap = "round"; // Round the ends of the lines to create a smoother appearance
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.fill();

    }

    return <canvas width={width}
                   height={height}
                   ref={setCanvasRef}
                   onClick={e => {renderText(e)
                   }}
                   onMouseUp={event => {
                       if(!isTextInputMode) {
                           addStep()
                       }
                   }}
    ></canvas>
}
}
function renderText(e){
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext("2d");
    if (isTextInputMode) {
        let input = document.createElement("input");
        input.type = "text";
        input.id = "input-text"
        input.style.position = "absolute";
        input.style.top = e.clientY + 35 + "px";
        input.style.left = e.clientX + "px";

        input.addEventListener("keydown", function(event) {
            if (event.key === "Enter" || event.key === "Escape") { // Enter key
                event.preventDefault();
                ctx.font = "15px Helvetica";
                ctx.fillStyle = "black";
                ctx.fillText(input.value, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                if(document.body.querySelector('#input-text')){
                    document.body.removeChild(input);
                }
                addStep()
            }
        });
        input.addEventListener("focusout", e => {
            if(input.value === ""){
                document.body.removeChild(input);
            }
        })

        document.body.appendChild(input);
        input.focus();
    }
}
export function undoStep() {
    if (steps > 0) {
        const ctx = document.querySelector('canvas').getContext("2d");
        steps--;
        let restorePicture = new Image();
        restorePicture.src = history[steps];
        restorePicture.onload = function () { ctx.drawImage(restorePicture, 0, 0); }
    }
}
export function redoStep() {
    if (steps < history.length-1) {
        const ctx = document.querySelector('canvas').getContext("2d");
        steps++;
        let restorePicture = new Image();
        restorePicture.src = history[steps];
        restorePicture.onload = function () { ctx.drawImage(restorePicture, 0, 0); }
    }
}
export function addStep() {
    steps++;
    if (steps < history.length) { history.length = steps; }
    history.push(document.querySelector('canvas').toDataURL());
}

export function activateTextInput(){
    isTextInputMode = true
    document.querySelector('canvas').style.cursor = "text"
}
export function deactivateTextInput(){
    isTextInputMode = false
    document.querySelector('canvas').style.cursor = "crosshair"
}
export function emptyHistory(){
    history = []
    steps = -1
}
export function addImage() {
    deactivateTextInput()
    const restorePicture = new Image();
    restorePicture.src = history[steps];

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = function (e) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            const img = new Image();
            img.onload = function () {
                const canvas = document.querySelector("canvas");
                const ctx = canvas.getContext("2d");

                let offsetX = 0;
                let offsetY = 0;

                canvas.onmousedown = function (e) {
                    if (!isDragging) {
                        let mouseX = e.clientX - canvas.offsetLeft;
                        let mouseY = e.clientY - canvas.offsetTop;

                        if (
                            mouseX >= offsetX &&
                            mouseX <= offsetX + img.width &&
                            mouseY >= offsetY &&
                            mouseY <= offsetY + img.height
                        ) {
                            isDragging = true;
                        }
                    }
                };

                canvas.onmousemove = function (e) {
                    if (isDragging) {
                        let mouseX = e.clientX - canvas.offsetLeft;
                        let mouseY = e.clientY - canvas.offsetTop;

                        offsetX = mouseX - img.width / 2;
                        offsetY = mouseY - img.height / 2;
                        ctx.drawImage(restorePicture, 0, 0)
                        ctx.strokeRect(offsetX, offsetY, img.width, img.height)
                        canvas.style.cursor = "grab"
                        ctx.drawImage(img, offsetX, offsetY);
                    }
                };

                canvas.onmouseup = function () {
                    if (isDragging) {
                        isDragging = false;

                        let finalX = offsetX < 0 ? 0 : offsetX;
                        let finalY = offsetY < 0 ? 0 : offsetY;
                        ctx.drawImage(restorePicture, 0, 0)
                        ctx.drawImage(img, finalX, finalY);
                        canvas.style.cursor = "crosshair"

                    }
                    canvas.onmousedown = null;
                    canvas.onmousemove = null;
                    canvas.onmouseup = null;
                };
                ctx.drawImage(img, 0, 0);
                ctx.strokeRect(offsetX, offsetY, img.width, img.height)
            };
            img.src = event.target.result;
        };

        reader.readAsDataURL(file);
    };

    fileInput.click();
}

export default Canvas;