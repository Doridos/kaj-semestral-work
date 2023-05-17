import './Canvas.css'
import {useOnDraw} from './Hooks.jsx'

let history = [];
let steps = -1;
const Canvas = ({
    width,
    height,
    color,
    inputWidth
}) => {if(width !== undefined && height !== undefined){


    const setCanvasRef = useOnDraw(onDraw)
    function onDraw(ctx, point, previousPoint){
        drawLine(previousPoint, point, ctx, color, inputWidth)
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
                   onMouseUp={event => {
                       addStep()
                   }}
    ></canvas>
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
    document.title = steps + ":" + history.length;
}
export default Canvas;