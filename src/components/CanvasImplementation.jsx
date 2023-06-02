import React, {useEffect, useState} from "react";
import {deleteDB, getPagesCount, storeToNotebook} from "./indexedDB.jsx";
import Canvas, {
    activateImageInput,
    activateTextInput, addImage,
    addNewPage,
    addStep,
    deactivateImageInput,
    deactivateTextInput,
    emptyHistory, redoStep,
    restorePage, setName,
    setPageCanvas, undoStep
} from "./Canvas.jsx";
import {ColorPicker} from "primereact/colorpicker";
import {Menu} from "./Menu.jsx";

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

export function CanvasImplementation(props){
    const [strokeWidth, setStrokeWidth] = useState("none");
    const [color, setColor] = useState("none");
    const [colorPicker1, setColorPicker1] = useState("#000000");
    const [colorPicker2, setColorPicker2] = useState("#03cc03");
    const [colorPicker3, setColorPicker3] = useState("#4691f6");
    const [colorPicker4, setColorPicker4] = useState("#f5942f");
    const [lastColor, setLastColor] = useState("none");
    const [page, setPage] = useState(1)

    const [pagesCount, setPagesCount] = useState(null);
    useEffect(() => {
        getPagesCount(props.name)
            .then((result) => {
                if(result === 0){
                    result = 1
                }

                setPagesCount(result);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);


    const [dontShow1, setDontShow1] = useState(true);
    const [dontShow2, setDontShow2] = useState(true);
    const [dontShow3, setDontShow3] = useState(true);
    const [dontShow4, setDontShow4] = useState(true);




    function highlightEraser(){
        setLastColor(color)
        setColor("#FFFFFF")
        document.querySelector('.svg-icon-pen').classList.remove("highlighted")
        document.querySelector('.text').classList.remove("highlighted")
        document.querySelector('.svg-icon-eraser.img').classList.remove("highlighted")
        document.querySelector('.svg-icon-eraser').classList.add("highlighted")
    }
    function highlightText(){
        setLastColor(color)
        setColor("#FFFFFF")
        document.querySelector('.svg-icon-pen').classList.remove("highlighted")
        document.querySelector('.svg-icon-eraser').classList.remove("highlighted")
        document.querySelector('.svg-icon-eraser.img').classList.remove("highlighted")
        document.querySelector('.text').classList.add("highlighted")
    }
    function highlightPen(){
        deactivateTextInput()
        setColor(lastColor ==="none" ? "#000000" : lastColor)
        document.querySelector('.svg-icon-eraser').classList.remove("highlighted")
        document.querySelector('.text').classList.remove("highlighted")
        document.querySelector('.svg-icon-eraser.img').classList.remove("highlighted")
        document.querySelector('.svg-icon-pen').classList.add("highlighted")

    }
    function highlightImage(){
        document.querySelector('.svg-icon-pen').classList.remove("highlighted")
        document.querySelector('.svg-icon-eraser').classList.remove("highlighted")
        document.querySelector('.text').classList.remove("highlighted")
        document.querySelector('.svg-icon-eraser.img').classList.add("highlighted")

    }
    function deleteCanvas() {
        let text = "Do you want to erase whole canvas?\nIf yes press OK, otherwise press Cancel.";
        if (confirm(text) === true) {
            const canvas = document.querySelector('canvas');
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "white";
            emptyHistory()
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            addStep()
        }
    }

    function download(dataUrl, filename) {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = filename;
        link.click();
    }

    function incrementPage(){
        if(page+1 <= pagesCount) {
            setPage(page+1)
            setPageCanvas(page+1)
        }
    }
    function decrementPage(){
        if(page-1 >= 1){
            setPage(page-1)
            setPageCanvas(page-1)
        }
    }



    return (
        <div>
            <div className="page">
                <div className="notebook-name">{props.name}</div>
                <section>
                    <Menu />

                    < Canvas width={794} height={1123} color={color} inputWidth={strokeWidth} name={props.name}/>
                    <aside className="connection-status hide">
                        <p >You are offline automatic saving is turned off.</p>
                    </aside>
                    <aside className="close-notebook" onClick= {event => {
                        storeToNotebook(props.name, page, document.querySelector('canvas').toDataURL())
                        props.function("")
                        localStorage.removeItem("notebook")
                    }}>
                        <p className="close-text"><svg className="svg-icon-close" viewBox="0 0 20 20">
                            <path d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"></path>
                        </svg>Close</p></aside>
                    <aside className="pages">
                        <p className="count"><span className="arrow" onClick={event => {
                            storeToNotebook(props.name, page, document.querySelector('canvas').toDataURL())
                            decrementPage()

                            if(page-1 >= 1) {
                                restorePage(page-1)
                            }


                        }}>&#8249;</span>{page}/{pagesCount !== null ? pagesCount : "..."}<span className="arrow" onClick={event => {
                            console.log(page)
                            storeToNotebook(props.name, page, document.querySelector('canvas').toDataURL())
                            incrementPage()

                            if(page +1 <= pagesCount) {
                                restorePage(page+1)
                            }

                        }}>&#8250;</span></p>

                        <svg className="svg-icon-undo add-new-page" viewBox="0 0 20 20" onClick={event => {
                            setPage(pagesCount+1)
                            setPageCanvas(pagesCount+1)
                            console.log(page)
                            storeToNotebook(props.name, page, document.querySelector('canvas').toDataURL())
                            addNewPage(pagesCount+1)
                            setPagesCount(pagesCount+1)}}>
                            <path
                                d="M14.613,10c0,0.23-0.188,0.419-0.419,0.419H10.42v3.774c0,0.23-0.189,0.42-0.42,0.42s-0.419-0.189-0.419-0.42v-3.774H5.806c-0.23,0-0.419-0.189-0.419-0.419s0.189-0.419,0.419-0.419h3.775V5.806c0-0.23,0.189-0.419,0.419-0.419s0.42,0.189,0.42,0.419v3.775h3.774C14.425,9.581,14.613,9.77,14.613,10 M17.969,10c0,4.401-3.567,7.969-7.969,7.969c-4.402,0-7.969-3.567-7.969-7.969c0-4.402,3.567-7.969,7.969-7.969C14.401,2.031,17.969,5.598,17.969,10 M17.13,10c0-3.932-3.198-7.13-7.13-7.13S2.87,6.068,2.87,10c0,3.933,3.198,7.13,7.13,7.13S17.13,13.933,17.13,10"></path>
                        </svg>
                        <p className="hide small-text"><span>&#8505;</span>Add new page</p>
                    </aside>
                    <aside>
                        <div className="colorPicker" onClickCapture={e => {
                            highlightPen()
                            if(document.querySelector('div.p-colorpicker-panel')) {
                                document.querySelector('div.p-colorpicker-panel').style.display = "none"
                            }
                            if(dontShow1) {
                                e.stopPropagation()
                                setColor(colorPicker1)
                                setDontShow1(false)
                                setDontShow2(true)
                                setDontShow3(true)
                                setDontShow4(true)
                            }

                        }}><ColorPicker value={colorPicker1} onChange={(e) =>
                        {setColorPicker1("#" + e.value)
                            setColor("#" + e.value)
                        }} /></div>
                        <div className="colorPicker" onClickCapture={e => {
                            highlightPen()
                            if(document.querySelector('div.p-colorpicker-panel')) {
                                document.querySelector('div.p-colorpicker-panel').style.display = "none"
                            }
                            if(dontShow2) {
                                e.stopPropagation()
                                setColor(colorPicker2)
                                setDontShow1(true)
                                setDontShow2(false)
                                setDontShow3(true)
                                setDontShow4(true)
                            }

                        }}><ColorPicker value={colorPicker2} onChange={(e) =>
                        {setColorPicker2("#" + e.value)
                            setColor("#" + e.value)
                        }} /></div>

                        <div className="colorPicker" onClickCapture={e => {
                            highlightPen()
                            if(document.querySelector('div.p-colorpicker-panel')) {
                                document.querySelector('div.p-colorpicker-panel').style.display = "none"
                            }
                            if(dontShow3) {
                                e.stopPropagation()
                                setColor(colorPicker3)
                                setDontShow1(true)
                                setDontShow2(true)
                                setDontShow3(false)
                                setDontShow4(true)
                            }

                        }}><ColorPicker value={colorPicker3} onChange={(e) =>
                        {setColorPicker3("#" + e.value)
                            setColor("#" + e.value)
                        }} /></div>

                        <div className="colorPicker" onClickCapture={e => {
                            highlightPen()
                            if(document.querySelector('div.p-colorpicker-panel')) {
                                document.querySelector('div.p-colorpicker-panel').style.display = "none"
                            }
                            if(dontShow4) {
                                e.stopPropagation()
                                setColor(colorPicker4)
                                setDontShow1(true)
                                setDontShow2(true)
                                setDontShow3(true)
                                setDontShow4(false)
                            }

                        }}><ColorPicker value={colorPicker4} onChange={(e) =>
                        {setColorPicker4("#" + e.value)
                            setColor("#" + e.value)
                        }} /></div>

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
                            deactivateTextInput()
                            deactivateImageInput()
                            highlightPen()
                        }
                        }>
                            <path
                                d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                        </svg>

                        <svg className="svg-icon-eraser" viewBox="0 0 20 20" onClick= {e => {
                            deactivateTextInput()
                            deactivateImageInput()
                            highlightEraser()
                        }}>
                            <path
                                d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm.66 11.34L3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z"/>
                        </svg>

                        <svg className="svg-icon-pen text" viewBox="0 0 20 20" onClick={event => {activateTextInput()
                            highlightText()}}>
                            <path
                                d="M5 2a.5.5 0 0 1 .5-.5c.862 0 1.573.287 2.06.566.174.099.321.198.44.286.119-.088.266-.187.44-.286A4.165 4.165 0 0 1 10.5 1.5a.5.5 0 0 1 0 1c-.638 0-1.177.213-1.564.434a3.49 3.49 0 0 0-.436.294V7.5H9a.5.5 0 0 1 0 1h-.5v4.272c.1.08.248.187.436.294.387.221.926.434 1.564.434a.5.5 0 0 1 0 1 4.165 4.165 0 0 1-2.06-.566A4.561 4.561 0 0 1 8 13.65a4.561 4.561 0 0 1-.44.285 4.165 4.165 0 0 1-2.06.566.5.5 0 0 1 0-1c.638 0 1.177-.213 1.564-.434.188-.107.335-.214.436-.294V8.5H7a.5.5 0 0 1 0-1h.5V3.228a3.49 3.49 0 0 0-.436-.294A3.166 3.166 0 0 0 5.5 2.5.5.5 0 0 1 5 2zm3.352 1.355zm-.704 9.29z"/>
                        </svg>
                        <svg
                            className="svg-icon-eraser img" viewBox="0 0 22 20" onClick={event => {
                            activateImageInput()
                            highlightImage()
                            addImage()
                            setColor("#000000")
                        }}>
                            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                            <path
                                d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
                        </svg>

                        <svg className="svg-icon-undo" viewBox="0 0 20 20" onClick={e =>
                            undoStep()
                        }>
                            <path
                                d="M3.24,7.51c-0.146,0.142-0.146,0.381,0,0.523l5.199,5.193c0.234,0.238,0.633,0.064,0.633-0.262v-2.634c0.105-0.007,0.212-0.011,0.321-0.011c2.373,0,4.302,1.91,4.302,4.258c0,0.957-0.33,1.809-1.008,2.602c-0.259,0.307,0.084,0.762,0.451,0.572c2.336-1.195,3.73-3.408,3.73-5.924c0-3.741-3.103-6.783-6.916-6.783c-0.307,0-0.615,0.028-0.881,0.063V2.575c0-0.327-0.398-0.5-0.633-0.261L3.24,7.51 M4.027,7.771l4.301-4.3v2.073c0,0.232,0.21,0.409,0.441,0.366c0.298-0.056,0.746-0.123,1.184-0.123c3.402,0,6.172,2.709,6.172,6.041c0,1.695-0.718,3.24-1.979,4.352c0.193-0.51,0.293-1.045,0.293-1.602c0-2.76-2.266-5-5.046-5c-0.256,0-0.528,0.018-0.747,0.05C8.465,9.653,8.328,9.81,8.328,9.995v2.074L4.027,7.771z"></path>
                        </svg>

                        <svg className="svg-icon-redo" viewBox="0 0 20 20" onClick={e =>
                            redoStep()
                        }>
                            <path
                                d="M16.76,7.51l-5.199-5.196c-0.234-0.239-0.633-0.066-0.633,0.261v2.534c-0.267-0.035-0.575-0.063-0.881-0.063c-3.813,0-6.915,3.042-6.915,6.783c0,2.516,1.394,4.729,3.729,5.924c0.367,0.189,0.71-0.266,0.451-0.572c-0.678-0.793-1.008-1.645-1.008-2.602c0-2.348,1.93-4.258,4.303-4.258c0.108,0,0.215,0.003,0.321,0.011v2.634c0,0.326,0.398,0.5,0.633,0.262l5.199-5.193C16.906,7.891,16.906,7.652,16.76,7.51 M11.672,12.068V9.995c0-0.185-0.137-0.341-0.318-0.367c-0.219-0.032-0.49-0.05-0.747-0.05c-2.78,0-5.046,2.241-5.046,5c0,0.557,0.099,1.092,0.292,1.602c-1.261-1.111-1.979-2.656-1.979-4.352c0-3.331,2.77-6.041,6.172-6.041c0.438,0,0.886,0.067,1.184,0.123c0.231,0.043,0.441-0.134,0.441-0.366V3.472l4.301,4.3L11.672,12.068z"></path>
                        </svg>



                        <svg className="svg-icon-undo" viewBox="0 0 20 20" onClick={e => {
                            download(document.querySelector('canvas').toDataURL('image/png'), props.name)
                        }}>
                            <path d="M15.608,6.262h-2.338v0.935h2.338c0.516,0,0.934,0.418,0.934,0.935v8.879c0,0.517-0.418,0.935-0.934,0.935H4.392c-0.516,0-0.935-0.418-0.935-0.935V8.131c0-0.516,0.419-0.935,0.935-0.935h2.336V6.262H4.392c-1.032,0-1.869,0.837-1.869,1.869v8.879c0,1.031,0.837,1.869,1.869,1.869h11.216c1.031,0,1.869-0.838,1.869-1.869V8.131C17.478,7.099,16.64,6.262,15.608,6.262z M9.513,11.973c0.017,0.082,0.047,0.162,0.109,0.226c0.104,0.106,0.243,0.143,0.378,0.126c0.135,0.017,0.274-0.02,0.377-0.126c0.064-0.065,0.097-0.147,0.115-0.231l1.708-1.751c0.178-0.183,0.178-0.479,0-0.662c-0.178-0.182-0.467-0.182-0.645,0l-1.101,1.129V1.588c0-0.258-0.204-0.467-0.456-0.467c-0.252,0-0.456,0.209-0.456,0.467v9.094L8.443,9.553c-0.178-0.182-0.467-0.182-0.645,0c-0.178,0.184-0.178,0.479,0,0.662L9.513,11.973z"></path>
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
            </div>
        </div>

    );
}