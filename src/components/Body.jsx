import React, {useEffect, useRef, useState} from "react";
import "./theme.css"
import "primereact/resources/primereact.min.css"
import './Body.css'

import {CanvasImplementation} from "./CanvasImplementation.jsx";
import {createNotebook, getPagesCount} from "./indexedDB.jsx";
import {setName} from "./Canvas.jsx";



export function Body() {

    const [notebookName, setNotebookName] = useState(localStorage.getItem("notebook"))
    let countOfNotebooks = 3


    useEffect(() => {
        if (notebookName) {
            console.log(countOfNotebooks)
            createNotebook(notebookName, countOfNotebooks)
                .then(() => {
                    console.log(notebookName);
                    indexedDB.open("notebooks").onsuccess = function (sender, args) {
                        console.log(sender.target.result.objectStoreNames);
                    };
                    // Code to execute after createNotebook completes successfully
                    console.log("Notebook created successfully");
                })
                .catch((error) => {
                    // Code to handle errors
                    console.error("Error creating notebook:", error);
                });
        }

        // Update the value in setName function every time setNotebookName is called
        setName(notebookName);
    }, [notebookName]);

    return (
        <div>
        <div className="page">
            {notebookName ? (
                < CanvasImplementation name={notebookName} function={setNotebookName}/>): (<form onSubmit={event => {
                event.preventDefault()

                let formField = document.querySelector("#name")
                let submitName = new FormData(event.currentTarget).get("name")
                if(submitName==="") {

                    console.log(formField)
                    alert("Please enter your username.")
                    formField.classList.add('red-border')
                }
                localStorage.setItem("notebook",submitName)
                setNotebookName(submitName)

            }}>
                <label htmlFor="username">Username:</label>
                <input id="name" name="name" type="text" placeholder="Enter your username" autoComplete="new-password"
                       autoFocus></input>
                <button type="submit">Login</button>
            </form>)

            }


            <footer>
                @My notebook 2023
            </footer>
        </div>
        </div>

    );
}
