import {useEffect, useRef, useState} from "react";

export function useOnDraw(onDraw){

    const canvasRef = useRef(null)

    const isDrawingRef = useRef(false)

    const mouseMoveListenerRef = useRef(null)
    const mouseDownListenerRef = useRef(null)
    const mouseUpListenerRef = useRef(null)
    const previousPointRef = useRef(null)

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
    function setCanvasReference(reference){
        if(!reference) return;
        if(canvasRef.current){
            canvasRef.current.removeEventListener('mousedown', mouseDownListenerRef.current)
        }
        canvasRef.current = reference;
        initMouseMoveListener()
        initMouseDownListener()
        initMouseUpListener()
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