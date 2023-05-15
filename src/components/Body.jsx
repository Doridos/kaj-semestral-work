import React, {useEffect, useRef, useState} from "react";
import "primereact/resources/themes/lara-light-blue/theme.css"
import "primereact/resources/primereact.min.css"
import './Body.css'
import Canvas from "./Canvas.jsx";
import {ColorPicker} from "primereact/colorpicker";
import canvas from "./Canvas.jsx";
function Slider({ value, min, max, step, onChange }) {
    return (
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
        />
    );
}

export function Body(){
    const [strokeWidth, setStrokeWidth] = useState("none");
    const [color, setColor] = useState("none");
    const [colorPicker1, setColorPicker1] = useState("#000000");
    const [colorPicker2, setColorPicker2] = useState("#03cc03");
    const [colorPicker3, setColorPicker3] = useState("#4691f6");
    const [colorPicker4, setColorPicker4] = useState("#f5942f");
    const [lastColor, setLastColor] = useState("none");


    const [dontShow1, setDontShow1] = useState(true);
    const [dontShow2, setDontShow2] = useState(true);
    const [dontShow3, setDontShow3] = useState(true);
    const [dontShow4, setDontShow4] = useState(true);

    let pathHistory = []
    let steps = 0



    function highlightEraser(){
        setLastColor(color)
        setColor("#FFFFFF")
        document.querySelector('.svg-icon-pen').classList.remove("highlighted")
        document.querySelector('.svg-icon-eraser').classList.add("highlighted")
    }
    function highlightPen(){
        setColor(lastColor ==="none" ? "#000000" : lastColor)
        document.querySelector('.svg-icon-eraser').classList.remove("highlighted")
        document.querySelector('.svg-icon-pen').classList.add("highlighted")

    }
    function deleteCanvas() {
        let text = "Do you want to erase whole canvas?\nIf yes press OK, otherwise press Cancel.";
        if (confirm(text) === true) {
            const canvas = document.querySelector('canvas');
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }

    function drawPaths(){

        // if (steps === 0) {
        //     return
        // }
        const canvas = document.querySelector('canvas');
        const ctx = canvas.getContext("2d");
        ctx.restore()
        // // delete everything
        // console.log(pathHistory)
        // ctx.clearRect(0,0,canvas.width,canvas.height);
        // // draw all the paths in the paths array
        // for (let i = 0; i < pathHistory.length - 1; i++) {
        //     let path = pathHistory[i]
        //     ctx.beginPath();
        //     ctx.moveTo(path[0].x,path[0].y);
        //     for(let i = 1; i < path.length; i++){
        //         ctx.lineTo(path[i].x,path[i].y);
        //     }
        //     ctx.stroke();
        // }
    }

    function download(dataUrl, filename) {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = filename;
        link.click();
    }
    function setSteps(stepsParam){
        steps = stepsParam
    }


    return (
        <div>
        <div className="page">
            <section>

                <nav className="menu">

                    Main menu
                </nav>
                <main>
                    < Canvas width={window.innerWidth -800} height={window.innerHeight} color={color} inputWidth={strokeWidth} steps={steps} setSteps={setSteps} pathHistory={pathHistory}/>
                </main>
                <aside>
                    <span onClickCapture={e => {
                        if(dontShow1) {
                            e.stopPropagation()
                            setColor(colorPicker1)
                            setDontShow1(false)
                            setDontShow2(true)
                            setDontShow3(true)
                            setDontShow4(true)
                            document.querySelector('.svg-icon-eraser').classList.remove("highlighted")
                            document.querySelector('.svg-icon-pen').classList.add("highlighted")
                            if(document.querySelector('div.p-colorpicker-panel')) {
                                document.querySelector('div.p-colorpicker-panel').style.display = "none"
                            }
                        }

                    }}><ColorPicker value={colorPicker1} onChange={(e) =>
                    {setColorPicker1("#" + e.value)
                        setColor("#" + e.value)
                    }} /></span>
                    <span onClickCapture={e => {
                        if(dontShow2) {
                            e.stopPropagation()
                            setColor(colorPicker2)
                            setDontShow1(true)
                            setDontShow2(false)
                            setDontShow3(true)
                            setDontShow4(true)
                            document.querySelector('.svg-icon-eraser').classList.remove("highlighted")
                            document.querySelector('.svg-icon-pen').classList.add("highlighted")
                            if(document.querySelector('div.p-colorpicker-panel')) {
                                document.querySelector('div.p-colorpicker-panel').style.display = "none"
                            }
                        }

                    }}><ColorPicker value={colorPicker2} onChange={(e) =>
                    {setColorPicker2("#" + e.value)
                        setColor("#" + e.value)
                    }} /></span>

                    <span onClickCapture={e => {
                        if(dontShow3) {
                            e.stopPropagation()
                            setColor(colorPicker3)
                            setDontShow1(true)
                            setDontShow2(true)
                            setDontShow3(false)
                            setDontShow4(true)
                            document.querySelector('.svg-icon-eraser').classList.remove("highlighted")
                            document.querySelector('.svg-icon-pen').classList.add("highlighted")
                            if(document.querySelector('div.p-colorpicker-panel')) {
                                document.querySelector('div.p-colorpicker-panel').style.display = "none"
                            }
                        }

                    }}><ColorPicker value={colorPicker3} onChange={(e) =>
                    {setColorPicker3("#" + e.value)
                        setColor("#" + e.value)
                    }} /></span>

                    <span onClickCapture={e => {
                        if(dontShow4) {
                            e.stopPropagation()
                            setColor(colorPicker4)
                            setDontShow1(true)
                            setDontShow2(true)
                            setDontShow3(true)
                            setDontShow4(false)
                            document.querySelector('.svg-icon-eraser').classList.remove("highlighted")
                            document.querySelector('.svg-icon-pen').classList.add("highlighted")
                            if(document.querySelector('div.p-colorpicker-panel')) {
                                document.querySelector('div.p-colorpicker-panel').style.display = "none"
                            }
                        }

                    }}><ColorPicker value={colorPicker4} onChange={(e) =>
                    {setColorPicker4("#" + e.value)
                        setColor("#" + e.value)
                    }} /></span>

                    <hr/>

                    <Slider value={strokeWidth==="none" ? 0 : strokeWidth} min={0} max={20} step={1} onChange={e => {setStrokeWidth(e)
                    if(document.querySelector('.circle')){
                        let elementStyle = document.querySelector('.circle').style
                        elementStyle.width = strokeWidth + 30 +"px"
                        elementStyle.height = strokeWidth +"px"
                    }
                    }} />
                    <div className="circle-holder"><div className="circle"></div></div>

                    <hr className="below-thickness"/>


                    <svg className="svg-icon-pen" viewBox="0 0 20 20" onClick={e => {
                        highlightPen()

                    }
                    }>
                        <path
                            d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                    </svg>

                    <svg className="svg-icon-eraser" viewBox="0 0 20 20" onClick= {e => {
                        highlightEraser()
                    }}>
                        <path
                            d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm.66 11.34L3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z"/>
                    </svg>

                    <svg className="svg-icon-undo" viewBox="0 0 20 20" onClick={e =>{
                        steps += 1
                        drawPaths(pathHistory, steps)
                    }}>
                        <path
                            d="M3.24,7.51c-0.146,0.142-0.146,0.381,0,0.523l5.199,5.193c0.234,0.238,0.633,0.064,0.633-0.262v-2.634c0.105-0.007,0.212-0.011,0.321-0.011c2.373,0,4.302,1.91,4.302,4.258c0,0.957-0.33,1.809-1.008,2.602c-0.259,0.307,0.084,0.762,0.451,0.572c2.336-1.195,3.73-3.408,3.73-5.924c0-3.741-3.103-6.783-6.916-6.783c-0.307,0-0.615,0.028-0.881,0.063V2.575c0-0.327-0.398-0.5-0.633-0.261L3.24,7.51 M4.027,7.771l4.301-4.3v2.073c0,0.232,0.21,0.409,0.441,0.366c0.298-0.056,0.746-0.123,1.184-0.123c3.402,0,6.172,2.709,6.172,6.041c0,1.695-0.718,3.24-1.979,4.352c0.193-0.51,0.293-1.045,0.293-1.602c0-2.76-2.266-5-5.046-5c-0.256,0-0.528,0.018-0.747,0.05C8.465,9.653,8.328,9.81,8.328,9.995v2.074L4.027,7.771z"></path>
                    </svg>

                    <svg className="svg-icon-redo" viewBox="0 0 20 20">
                        <path
                            d="M16.76,7.51l-5.199-5.196c-0.234-0.239-0.633-0.066-0.633,0.261v2.534c-0.267-0.035-0.575-0.063-0.881-0.063c-3.813,0-6.915,3.042-6.915,6.783c0,2.516,1.394,4.729,3.729,5.924c0.367,0.189,0.71-0.266,0.451-0.572c-0.678-0.793-1.008-1.645-1.008-2.602c0-2.348,1.93-4.258,4.303-4.258c0.108,0,0.215,0.003,0.321,0.011v2.634c0,0.326,0.398,0.5,0.633,0.262l5.199-5.193C16.906,7.891,16.906,7.652,16.76,7.51 M11.672,12.068V9.995c0-0.185-0.137-0.341-0.318-0.367c-0.219-0.032-0.49-0.05-0.747-0.05c-2.78,0-5.046,2.241-5.046,5c0,0.557,0.099,1.092,0.292,1.602c-1.261-1.111-1.979-2.656-1.979-4.352c0-3.331,2.77-6.041,6.172-6.041c0.438,0,0.886,0.067,1.184,0.123c0.231,0.043,0.441-0.134,0.441-0.366V3.472l4.301,4.3L11.672,12.068z"></path>
                    </svg>



                    <svg className="svg-icon-undo" viewBox="0 0 20 20" onClick={e => {
                        download(document.querySelector('canvas').toDataURL('image/png'), "test")
                    }}>
                        <path
                              d="M8.416,3.943l1.12-1.12v9.031c0,0.257,0.208,0.464,0.464,0.464c0.256,0,0.464-0.207,0.464-0.464V2.823l1.12,1.12c0.182,0.182,0.476,0.182,0.656,0c0.182-0.181,0.182-0.475,0-0.656l-1.744-1.745c-0.018-0.081-0.048-0.16-0.112-0.224C10.279,1.214,10.137,1.177,10,1.194c-0.137-0.017-0.279,0.02-0.384,0.125C9.551,1.384,9.518,1.465,9.499,1.548L7.76,3.288c-0.182,0.181-0.182,0.475,0,0.656C7.941,4.125,8.234,4.125,8.416,3.943z M15.569,6.286h-2.32v0.928h2.32c0.512,0,0.928,0.416,0.928,0.928v8.817c0,0.513-0.416,0.929-0.928,0.929H4.432c-0.513,0-0.928-0.416-0.928-0.929V8.142c0-0.513,0.416-0.928,0.928-0.928h2.32V6.286h-2.32c-1.025,0-1.856,0.831-1.856,1.856v8.817c0,1.025,0.832,1.856,1.856,1.856h11.138c1.024,0,1.855-0.831,1.855-1.856V8.142C17.425,7.117,16.594,6.286,15.569,6.286z"></path>
                    </svg>

                    <svg className="svg-icon-undo" viewBox="0 0 20 20" onClick={e => {
                        deleteCanvas()
                    }}>
                        <path
                            d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417
                            M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68
                            M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"></path>
                    </svg>

                </aside>
            </section>
            <footer>
                @My notebook 2023
            </footer>
        </div>
        </div>

    );
}