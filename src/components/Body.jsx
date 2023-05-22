import React, { useEffect, useRef, useState } from "react";
import "./theme.css";
import "primereact/resources/primereact.min.css";
import "./Body.css";

import { CanvasImplementation } from "./CanvasImplementation.jsx";
import {createNotebook, deleteDB} from "./indexedDB.jsx";
import { setName } from "./Canvas.jsx";

export function Body() {
    let notebookNames = [];
    if (localStorage.getItem("notebookNames")) {
        notebookNames = JSON.parse(localStorage.getItem("notebookNames"));
    } else {
        localStorage.setItem("notebookNames", JSON.stringify(notebookNames));
    }

    function addText(){
        const loadingCircle = document.querySelector('.loading-circle');
        loadingCircle.style.content = "'Modifying content via JS'";
    }


    function updateNotebookNames(name) {
        if (!notebookNames.includes(name)) {
            setIsLoading(true);
            notebookNames.push(name);
            localStorage.setItem("notebookNames", JSON.stringify(notebookNames));
            console.log("sss");
        }
    }

    const [notebookName, setNotebookName] = useState(localStorage.getItem("notebook"));
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        if (notebookName) {
            console.log(notebookNames.length);
            updateNotebookNames(notebookName);
            createNotebook(notebookName, notebookNames.length + 1)
                .then(() => {
                    console.log(notebookNames.length);
                    console.log(notebookName);
                    indexedDB.open("notebooks").onsuccess = function (sender, args) {
                        console.log(sender.target.result.objectStoreNames);
                    };
                    console.log("Notebook created successfully");
                })
                .catch((error) => {
                    console.error("Error creating notebook:", error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }

        setName(notebookName);
    }, [notebookName]);

    return (
        <div>
            {isLoading && (
                <div className="loading-circle"></div>
            )}

            <div className={`page ${isLoading ? "loading" : ""}`}>
                {notebookName ? (
                    <CanvasImplementation name={notebookName} function={setNotebookName} />
                ) : (
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();

                            let formField = document.querySelector("#name");
                            let submitName = new FormData(event.currentTarget).get("name");
                            if (submitName === "") {
                                console.log(formField);
                                alert("Please enter your username.");
                                formField.classList.add("red-border");
                            }
                            localStorage.setItem("notebook", submitName);
                            setNotebookName(submitName);
                        }}
                    >
                        <label htmlFor="username">Username:</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your username"
                            autoComplete="new-password"
                            autoFocus
                        ></input>
                        <button type="submit">Login</button>
                    </form>
                )}

                <footer>@My notebook 2023</footer>
            </div>
        </div>
    );
}
