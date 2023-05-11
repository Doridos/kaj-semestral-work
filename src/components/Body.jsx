import React, {useEffect, useRef, useState} from "react";
import "primereact/resources/themes/lara-light-blue/theme.css"
import "primereact/resources/primereact.min.css"
import './Body.css'
import Canvas from "./Canvas.jsx";
import {ColorPicker} from "primereact/colorpicker";
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

    const [dontShow1, setDontShow1] = useState(true);
    const [dontShow2, setDontShow2] = useState(true);
    const [dontShow3, setDontShow3] = useState(true);
    const [dontShow4, setDontShow4] = useState(true);

    return (
        <div>
        <div className="page">
            <section>

                <nav className="menu">

                    Main menu
                </nav>
                <main>

                    < Canvas width={window.innerWidth -800} height={window.innerHeight} color={color} inputWidth={strokeWidth}/>
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

                </aside>
            </section>
            <footer>
                @My notebook 2023
            </footer>
        </div>
        </div>

    );
}