import {useRef, useState} from "react";
import {addStep} from "./Canvas.jsx";
import {getFromNotebook, storeToNotebook} from "./IndexedDB.jsx";

// Component used for drawing on canvas.
export function useOnDraw(onDraw, name){

    const canvasRef = useRef(null)

    const isDrawingRef = useRef(false)


    const touchMovePreventDefaultListenerRef = useRef(null)
    const touchMoveListenerRef = useRef(null)
    const touchStartListenerRef = useRef(null)
    const touchEndListenerRef = useRef(null)
    const mouseMoveListenerRef = useRef(null)
    const mouseDownListenerRef = useRef(null)
    const mouseUpListenerRef = useRef(null)
    const previousPointRef = useRef(null)
    const [init, setInit] = useState(true);

    useState(() => {
        return () => {
            if(mouseMoveListenerRef.current){
                window.removeEventListener('mousemove', mouseMoveListenerRef.current);
            }
            if(mouseUpListenerRef.current){
                window.removeEventListener('mouseup', mouseUpListenerRef.current);
            }
        }
    });
    function setCanvasReference(reference) {
        if (!reference) return;
        if (canvasRef.current) {
            canvasRef.current.removeEventListener("mousedown", mouseDownListenerRef.current);
        }
        canvasRef.current = reference;
        if (init) {
            let ctx = canvasRef.current.getContext("2d");
            getFromNotebook(name, 1)
                .then((imageData) => {
                    let restorePicture = new Image();
                    restorePicture.src = imageData;
                    restorePicture.onload = function () {
                        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                        ctx.drawImage(restorePicture, 0, 0);
                        addStep()
                    };
                })
                .catch((error) => {
                    ctx.fillStyle = "white";
                    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    addStep()
                })
                .finally(() => {
                    // addStep()
                });

            setInit(false);
            document.querySelector(".svg-icon-pen").classList.add("highlighted");
        }
        initMouseMoveListener();
        initMouseDownListener();
        initMouseUpListener();
        initTouchMoveListener();
        initTouchStartListener();
        initTouchEndListener();
        initTouchMovePreventDefaultListener();
    }

    function initTouchMovePreventDefaultListener() {
        const touchMovePreventDefaultListener = (e) => {
            if (isDrawingRef.current) {
                e.preventDefault();
            }
        };
        touchMovePreventDefaultListenerRef.current = touchMovePreventDefaultListener;
        window.addEventListener("touchmove", touchMovePreventDefaultListener, {
            passive: false,
        });
    }
    function initTouchMoveListener() {
        const touchMoveListener = (e) => {
            if (isDrawingRef.current) {
                const touch = e.touches[0];
                const point = convertToPointInCanvas(touch.clientX, touch.clientY);
                const ctx = canvasRef.current.getContext("2d");
                if (onDraw) onDraw(ctx, point, previousPointRef.current);
                previousPointRef.current = point;
            }
        };
        touchMoveListenerRef.current = touchMoveListener;
        window.addEventListener("touchmove", touchMoveListener);
    }

    function initTouchStartListener() {
        const touchStartListener = (e) => {
            isDrawingRef.current = true;
            const touch = e.touches[0];
            const point = convertToPointInCanvas(touch.clientX, touch.clientY);
            previousPointRef.current = point;
        };
        touchStartListenerRef.current = touchStartListener;
        canvasRef.current.addEventListener("touchstart", touchStartListener);
    }

    function initTouchEndListener() {
        const touchEndListener = () => {
            isDrawingRef.current = false;
            previousPointRef.current = null;
        };
        touchEndListenerRef.current = touchEndListener;
        window.addEventListener("touchend", touchEndListener);
    }

    function initMouseMoveListener(){
        const mouseMoveListener = (e) => {
            if(isDrawingRef.current){
                const point = convertToPointInCanvas(e.clientX, e.clientY)
                const ctx = canvasRef.current.getContext('2d')
                if(onDraw) onDraw(ctx, point, previousPointRef.current)
                previousPointRef.current = point
            }
        }
        mouseMoveListenerRef.current = mouseMoveListener
        window.addEventListener('mousemove', mouseMoveListener)
    }

    function initMouseDownListener(){
        if(!canvasRef.current) return;
        const listener = () => {
            isDrawingRef.current = true;
        }
        mouseDownListenerRef.current = listener
        canvasRef.current.addEventListener('mousedown', listener)
    }

    function initMouseUpListener(){
        const listener = () => {
            isDrawingRef.current = false;
            previousPointRef.current = null
        }
        mouseUpListenerRef.current = listener
        window.addEventListener('mouseup', listener)
    }


    function convertToPointInCanvas(clientX, clientY){
        if(canvasRef.current){
            const boundingRect = canvasRef.current.getBoundingClientRect();
            return{
                x: clientX - boundingRect.left ,
                y: clientY - boundingRect.top
            }
        } else {
            return null;
        }
    }

    return setCanvasReference;
}