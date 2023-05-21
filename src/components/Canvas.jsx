import './Canvas.css'
import {useOnDraw} from './Hooks.jsx'
import {createNotebook, deleteDB, getFromNotebook, storeToNotebook} from "./indexedDB.jsx";

let history = [];
let steps = -1;
let isTextInputMode = false;
let isDragging = false;
let isImageInputMode = false;
let page = 1;
let canvas
let ctx
    window.addEventListener("load", e => {
    canvas = document.querySelector('canvas')
    ctx = canvas.getContext("2d");
})




const Canvas = ({
    width,
    height,
    color,
    inputWidth
}) => {if(width !== undefined && height !== undefined){

    const setCanvasRef = useOnDraw(onDraw)
    function onDraw(ctx, point, previousPoint){
        if (!isDragging && !isImageInputMode){
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
                       if(!isTextInputMode && !isImageInputMode) {
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
        input.style.top = e.clientY + "px";
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
                if(document.querySelector('.info')) {
                    const span = document.querySelector('.info')
                    document.body.removeChild(span)
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
        steps--;
        let restorePicture = new Image();
        restorePicture.src = history[steps];
        console.log(history)
        console.log(restorePicture)
        console.log(steps)
        restorePicture.onload = function () { ctx.drawImage(restorePicture, 0, 0); console.log("aaaa")}
    }
}
export function redoStep() {
    deleteDB()
    if (steps < history.length-1) {
        steps++;
        let restorePicture = new Image();
        restorePicture.src = history[steps];
        restorePicture.onload = function () { ctx.drawImage(restorePicture, 0, 0); }
    }
}
export function addStep() {
    steps++;
    if (steps < history.length) {
        history.splice(steps);
    }
    if (document.querySelector("canvas")) {
        history.push(canvas.toDataURL());
    }

    console.log(history);
}

export function activateTextInput(){
    const span = document.createElement("span")
    span.classList.add("info")
    span.innerText = "Hint \n Click anywhere on canvas \n and enter the text."
    document.body.append(span)
    isTextInputMode = true
    document.querySelector('canvas').style.cursor = "text"
}
export function deactivateTextInput(){
    isTextInputMode = false
    document.querySelector('canvas').style.cursor = "crosshair"
}

export function activateImageInput(){
    isImageInputMode = true
    document.querySelector('canvas').style.cursor = "crosshair"
}
export function deactivateImageInput(){
    isImageInputMode = false
    document.querySelector('canvas').style.cursor = "crosshair"
}
export function emptyHistory(){
    history = []
    steps = -1
}

export function addImage() {
    if(document.querySelector('.info')) {
        const span = document.querySelector('.info')
        document.body.removeChild(span)
    }

    isImageInputMode = true
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
                const rect = canvas.getBoundingClientRect()
                const span = document.createElement("span")
                span.classList.add("info")
                span.innerText = "Hint \n To place the image you have to move it and then \n the border will disappear."
                document.body.append(span)
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
                    let mouseX = e.clientX - canvas.offsetLeft;
                    let mouseY = e.clientY - canvas.offsetTop;
                    if (
                        mouseX >= offsetX &&
                        mouseX <= offsetX + img.width &&
                        mouseY >= offsetY &&
                        mouseY <= offsetY + img.height
                    ) {
                        canvas.style.cursor = "grab"
                    }
                    else {
                        canvas.style.cursor = "crosshair"
                    }

                    if (isDragging) {
                        let mouseX = e.clientX - canvas.offsetLeft;
                        let mouseY = e.clientY - canvas.offsetTop;

                        offsetX = mouseX - img.width / 2;
                        offsetY = mouseY - img.height / 2;
                        ctx.drawImage(restorePicture, 0, 0)
                        ctx.strokeRect(offsetX, offsetY, img.width, img.height)
                        canvas.style.cursor = "grabbing"
                        ctx.drawImage(img, offsetX, offsetY);
                    }
                };

                canvas.onmouseup = function () {
                    if (isDragging) {
                        isDragging = false;

                        let finalX = offsetX < 0 ? 0 : offsetX;
                        let finalY = offsetY < 0 ? 0 : offsetY;
                        ctx.strokeRect(offsetX, offsetY, img.width, img.height)
                        ctx.drawImage(restorePicture, 0, 0)
                        ctx.drawImage(img, finalX, finalY);
                        canvas.style.cursor = "crosshair"
                        if(document.querySelector('.info')){
                            document.body.removeChild(span)
                            canvas.onmouseup = null
                            canvas.onmousedown = null
                            canvas.onmousemove = null
                        }
                        isImageInputMode = false

                        document.onmousedown = null
                        document.querySelector('.svg-icon-eraser').classList.remove("highlighted")
                        document.querySelector('.text').classList.remove("highlighted")
                        document.querySelector('.svg-icon-eraser.img').classList.remove("highlighted")
                        document.querySelector('.svg-icon-pen').classList.add("highlighted")
                    }
                };
                ctx.strokeRect(offsetX, offsetY, img.width, img.height)
                ctx.drawImage(img, 0, 0);
            };
            img.src = event.target.result;

        };
        if(file){
            document.onmousedown =  e =>{
                if(isImageInputMode && !isDragging){
                    e.stopPropagation()
                    alert("You have to place your image!")
                }
            }

            reader.readAsDataURL(file);
        }

    };

    fileInput.click();
}
// export function addNewPage(page){
//     const canvas = document.querySelector('canvas')
//     const ctx = canvas.getContext('2d')
//     ctx.fillStyle = "white";
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//     console.log(page)
//     storeToNotebook("test", page, document.querySelector('canvas').toDataURL())
// }


export default Canvas;