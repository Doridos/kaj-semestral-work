import React, { useEffect, useRef, useState } from "react";
import "./theme.css";
import "primereact/resources/primereact.min.css";
import "./Body.css";

import { CanvasImplementation } from "./CanvasImplementation.jsx";
import {addNewPage, addStep, setName, setPageCanvas} from "./Canvas.jsx";

export function Body(props) {

    let notebookNames = [];
    if (localStorage.getItem("notebookNames")) {
        notebookNames = JSON.parse(localStorage.getItem("notebookNames"));
    } else {
        localStorage.setItem("notebookNames", JSON.stringify(notebookNames));
    }
    function updateNotebookNames(name) {
        let username = localStorage.getItem("user")

        if (!notebookNames.some((notebook) => notebook.notebookName === name)) {
            setIsLoading(true);
            notebookNames.push({
                username: username,
                notebookName: name,
            });
            localStorage.setItem("notebookNames", JSON.stringify(notebookNames));

            let r = indexedDB.open(username, 2)
            r.onupgradeneeded = function(e) {
                let db = e.target.result
                db.createObjectStore("notebookNames", {keyPath: 'name'})
                console.log("created")
            }
            r.onsuccess = function (e){
                let db = e.target.result
                let t = db.transaction(["notebookNames"], "readwrite")
                t.objectStore("notebookNames").add({
                    name: name,
                    pages: []
                })
                addStep()
                setIsLoading(false);
            }
        }
    }

    const [notebookName, setNotebookName] = useState(
        localStorage.getItem("notebook")
    );
    const [pages, setPages] = useState(1)
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newNotebookName, setNewNotebookName] = useState("");
    const inputRef = useRef(null); // Add a useRef for the input element

    useEffect(() => {
        if (isModalOpen) {
            inputRef.current.focus(); // Manually focus the input element when the modal is opened
        }
    }, [isModalOpen]);

    useEffect(() => {
        if (notebookName) {
            updateNotebookNames(notebookName);
            let r = indexedDB.open(localStorage.getItem("user"))
            r.onsuccess = function(e) {
                let db = e.target.result
                let t = db.transaction(["notebookNames"], "readwrite")
                let r = t.objectStore("notebookNames").get(notebookName)
                r.onsuccess = function (e) {
                    console.log(e.target.result.pages.length+1)

                    setPages(e.target.result.pages.length+1)
                }
            }
        }
        setName(notebookName);
    }, [notebookName]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewNotebookName("");
    };

    const handleCreateNotebook = () => {
        if (newNotebookName.trim() !== "") {
            setNotebookName(newNotebookName);
            closeModal();
        } else {
            alert("Please enter a valid notebook name.");
        }
    };

    return (
        <div>
            {isLoading && <div className="loading-circle"></div>}

            <div className={`page ${isLoading ? "loading" : ""}`}>
                {notebookName ? (
                    <CanvasImplementation
                        name={notebookName}
                        function={setNotebookName}
                        pages={pages}
                    />
                ) : (
                    <div>
                        <nav className="menu">

                            Main menu
                        </nav>
                        <div className="notebook-grid">
                            {notebookNames.filter((notebook) => notebook.username === localStorage.getItem("user")).map((notebook, index) => (
                                <div
                                    className="notebook-item"
                                    key={index}
                                    onClick={(e) => {
                                        localStorage.setItem("notebook", notebook.notebookName);
                                        setNotebookName(notebook.notebookName);
                                    }}
                                >
                                    {notebook.notebookName}
                                </div>
                            ))}
                            <div className="notebook-item create-notebook" onClick={openModal}>
                                <svg className="svg-icon-new-notebook" viewBox="0 0 20 20">
                                    <path
                                        d="M14.613,10c0,0.23-0.188,0.419-0.419,0.419H10.42v3.774c0,0.23-0.189,0.42-0.42,0.42s-0.419-0.189-0.419-0.42v-3.774H5.806c-0.23,0-0.419-0.189-0.419-0.419s0.189-0.419,0.419-0.419h3.775V5.806c0-0.23,0.189-0.419,0.419-0.419s0.42,0.189,0.42,0.419v3.775h3.774C14.425,9.581,14.613,9.77,14.613,10 M17.969,10c0,4.401-3.567,7.969-7.969,7.969c-4.402,0-7.969-3.567-7.969-7.969c0-4.402,3.567-7.969,7.969-7.969C14.401,2.031,17.969,5.598,17.969,10 M17.13,10c0-3.932-3.198-7.13-7.13-7.13S2.87,6.068,2.87,10c0,3.933,3.198,7.13,7.13,7.13S17.13,13.933,17.13,10"></path>
                                </svg>
                            </div>
                        </div>
                        <div className={`modal ${isModalOpen ? "open" : ""}`}>
                            <div className="modal-content">
                <span className="close" onClick={closeModal}>
                  &times;
                </span>
                                <h2>Create new notebook</h2>
                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        handleCreateNotebook();
                                    }}
                                >
                                    <label htmlFor="notebookName">Notebook name:</label>
                                    <input
                                        ref={inputRef}
                                        id="notebookName"
                                        name="notebookName"
                                        type="text"
                                        placeholder="Enter notebook name"
                                        autoComplete="new-password"
                                        value={newNotebookName}
                                        onChange={(event) => {
                                            setNewNotebookName(event.target.value);
                                            localStorage.setItem("notebook", event.target.value);
                                        }}
                                    ></input>
                                    <button type="submit">Create</button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                <footer>
                    <div className="content-container">@My notebook 2023</div>
                </footer>
            </div>
        </div>
    );
}
