import './Canvas.css'
import {useOnDraw} from './Hooks.jsx'
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
    ></canvas>
}

}
export default Canvas;