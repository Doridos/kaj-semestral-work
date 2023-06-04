import React, { useEffect, useRef, useState } from "react";
import "./theme.css";
import "primereact/resources/primereact.min.css";
import "./body.css";

import { CanvasImplementation } from "./CanvasImplementation.jsx";
import {addNewPage, addStep, setName, setPageCanvas} from "./Canvas.jsx";
import {deleteDB} from "./IndexedDB.jsx";
import {Menu} from "./Menu.jsx";
// This is some basic component in application, which is made mainly for Canvas functionality.
export function Body() {
    let r = indexedDB.open(localStorage.getItem('user'), 2)
    r.onupgradeneeded = function(e) {
        let db = e.target.result
        db.createObjectStore("notebookNames", {keyPath: 'name'})
        db.close()
    }

    let notebookNames = [];
    if (localStorage.getItem("notebookNames")) {
        notebookNames = JSON.parse(localStorage.getItem("notebookNames"));
    } else {
        localStorage.setItem("notebookNames", JSON.stringify(notebookNames));
    }
    function updateNotebookNames(name) {
        let username = localStorage.getItem("user")

        if (!notebookNames.some((notebook) => notebook.notebookName === name && notebook.username === username)) {
            setIsLoading(true);
            notebookNames.push({
                username: username,
                notebookName: name,
            });
            localStorage.setItem("notebookNames", JSON.stringify(notebookNames));

            let r = indexedDB.open(username)

            r.onsuccess = function (e){
                let db = e.target.result
                let t = db.transaction(["notebookNames"], "readwrite")
                t.objectStore("notebookNames").add({
                    name: name,
                    pages: []
                })
            }
            r.onerror = function (e) {
                console.log("Unable to add new notebook")
            }
            addStep()
            setTimeout(() => {
                setIsLoading(false);
            }, 400);
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
    const [deletedNotebooks, setDeletedNotebooks] = useState([]);
    const handleChange = (event) => {
        const value = event.target.value;
        setNewNotebookName(value);
    };

    const isExceeded = newNotebookName.length > 49;

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
            if(newNotebookName === 'todo-1-items' || newNotebookName === 'audio-1-items'){
                alert("This name is not allowed")
            }
            else {
                setNotebookName(newNotebookName);
                localStorage.setItem('notebook', newNotebookName);
                closeModal();
            }
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
                                    <span className="trash" onClick={ e=> {
                                        e.stopPropagation()
                                        let text = `Do you want to delete notebook ${notebook.notebookName}?\nIf yes press OK, otherwise press Cancel.`;
                                        if (confirm(text) === true) {
                                            let r = indexedDB.open(localStorage.getItem('user'));
                                            r.onsuccess = function (e) {
                                                let db = e.target.result;
                                                let t = db.transaction(['notebookNames'], 'readwrite');
                                                let objectStore = t.objectStore('notebookNames');
                                                let request = objectStore.delete(notebook.notebookName);

                                                request.onsuccess = function (e) {
                                                    const index = notebookNames.findIndex(n => n.notebookName === notebook.notebookName);
                                                    if (index !== -1) {
                                                        // Remove the record from the notebookNames array
                                                        notebookNames.splice(index, 1);
                                                        // Update the local storage with the modified notebookNames array
                                                        localStorage.setItem('notebookNames', JSON.stringify(notebookNames));
                                                        setDeletedNotebooks([deletedNotebooks.push(notebook.notebookName)])
                                                        setNotebookName("")
                                                    }
                                                };
                                            };

                                            r.onerror = function (e) {
                                                reject('Failed to open database');
                                            };
                                        }
                                    }}>
                                        <svg className="trash-icon" viewBox="0 0 20 20">
							    <path
                                d="M17.114,3.923h-4.589V2.427c0-0.252-0.207-0.459-0.46-0.459H7.935c-0.252,0-0.459,0.207-0.459,0.459v1.496h-4.59c-0.252,0-0.459,0.205-0.459,0.459c0,0.252,0.207,0.459,0.459,0.459h1.51v12.732c0,0.252,0.207,0.459,0.459,0.459h10.29c0.254,0,0.459-0.207,0.459-0.459V4.841h1.511c0.252,0,0.459-0.207,0.459-0.459C17.573,4.127,17.366,3.923,17.114,3.923M8.394,2.886h3.214v0.918H8.394V2.886z M14.686,17.114H5.314V4.841h9.372V17.114z M12.525,7.306v7.344c0,0.252-0.207,0.459-0.46,0.459s-0.458-0.207-0.458-0.459V7.306c0-0.254,0.205-0.459,0.458-0.459S12.525,7.051,12.525,7.306M8.394,7.306v7.344c0,0.252-0.207,0.459-0.459,0.459s-0.459-0.207-0.459-0.459V7.306c0-0.254,0.207-0.459,0.459-0.459S8.394,7.051,8.394,7.306"></path>
						        </svg>
                                    </span>
                                </div>
                            ))}
                            <div className="notebook-item create-notebook" onClick={openModal}>
                                {notebookNames.length === 0 ? "Click to create notebook" : ""}
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
                                        maxLength={50}
                                        onChange={handleChange}
                                    />
                                    {isExceeded && (
                                        <p className="small-text-alert">Character limit exceeded (50 characters maximum).</p>
                                    )}
                                    <button type="submit">Create</button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
