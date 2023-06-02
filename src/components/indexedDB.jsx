import React from 'react';
import { PDFDocument } from 'pdf-lib';

export async function createPDFFromDBRecords(objectKey) {
    const pdfDoc = await PDFDocument.create();

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(localStorage.getItem('user'));

        request.onsuccess = function (e) {
            const db = e.target.result;
            const transaction = db.transaction('notebookNames');
            const objectStore = transaction.objectStore('notebookNames');

            const getRequest = objectStore.get(objectKey);

            getRequest.onsuccess = async (e) => {
                const object = e.target.result;
                console.log(object);
                if (object) {
                    const pages = object.pages; // Assuming pages is an array of data URLs

                    for (const pageData of pages) {
                        const imageData = pageData.split(',')[1]; // Extract base64 image data
                        const bytes = Uint8Array.from(atob(imageData), (c) => c.charCodeAt(0)); // Convert base64 to Uint8Array
                        const image = await pdfDoc.embedPng(bytes);
                        const page = pdfDoc.addPage();

                        page.drawImage(image, {
                            x: 0,
                            y: 0,
                            width: page.getWidth(),
                            height: page.getHeight(),
                            opacity: 1,
                        });
                    }

                    const pdfBytes = await pdfDoc.save();
                    resolve(new Blob([pdfBytes], { type: 'application/pdf' }));
                } else {
                    reject(new Error(`Object with key '${objectKey}' not found in object store.`));
                }
            };

            getRequest.onerror = (e) => {
                reject(e.target.error);
            };
        };

        request.onerror = (e) => {
            reject(e.target.error);
        };
    });
}

export function storeToNotebook(name, page, data) {
    console.log("Storing page " + page )
    let r = indexedDB.open(localStorage.getItem("user"))
    r.onsuccess = function(e) {
        let db = e.target.result
        let t = db.transaction(["notebookNames"], "readwrite")
        let r = t.objectStore("notebookNames").get(name)
        r.onsuccess = function(e) {
            const record = e.target.result  // {some: "data"}
            if(record.pages[page-1]){
                record.pages[page - 1] = data
            }
            else {
                record.pages.push(data)
            }
            console.log(record.pages)
            const updateRequest = t.objectStore("notebookNames").put(record);

            updateRequest.onsuccess = function(event) {
                console.log('Record updated successfully');
            };

            updateRequest.onerror = function(event) {
                console.log('Error updating record: ' + event.target.error);
            };
        }
    }
}

export function getFromNotebook(name, page) {
    page -= 1
    let user = localStorage.getItem("user")
    console.log("getfromNote")
    return new Promise((resolve, reject) => {
        let r = indexedDB.open(user)
        r.onsuccess = function(e) {
            let db = e.target.result
            if(db.objectStoreNames.contains("notebookNames")){
                let t = db.transaction(["notebookNames"], "readonly")
                let r = t.objectStore("notebookNames").get(name)
                r.onsuccess = function(e) {
                    console.log(e.target.result)
                    if(e.target.result){
                        const record = e.target.result.pages[page]

                        const imageData = record  ? record : null;
                        if (imageData) {
                            resolve(imageData); // Resolve the promise with the image data
                        } else {
                            reject("Data not found"); // Reject the promise if data is not found
                        }
                    }
                }
            }
            else {
                console.log("getFromNotebook: ObjectStore doesnt exist")
            }

        };
        r.onerror = function (e) {
            reject("Error opening the database"); // Reject the promise if there's an error opening the database
        };
    });
}

export function deleteDB() {
    let notebookNames
    notebookNames = JSON.parse(localStorage.getItem("notebookNames"));
    let r = indexedDB.open(localStorage.getItem('user'));
    r.onsuccess = function (e) {
        let db = e.target.result;
        let t = db.transaction(['notebookNames'], 'readwrite');
        let objectStore = t.objectStore('notebookNames');
        const notebooksToDelete = notebookNames.filter(n => n.username === localStorage.getItem("user"));
        notebooksToDelete.forEach(function (notebookName) {
            let request = objectStore.delete(notebookName.notebookName);
            request.onsuccess = function (e) {
                if (localStorage.getItem("notebookNames")) {
                    const filteredNotebookNames = notebookNames.filter(n => n.username !== localStorage.getItem("user"));
                    localStorage.setItem('notebookNames', JSON.stringify(filteredNotebookNames));
                }
            };
        });
    }
}

export async function getPagesCount(name) {
    return new Promise((resolve, reject) => {
        let r = indexedDB.open(localStorage.getItem("user"))
        r.onsuccess = function(e) {
            let db = e.target.result
            try {
                let t = db.transaction(["notebookNames"], "readonly")
                let r = t.objectStore("notebookNames").get(name)
                r.onsuccess = function(e) {
                    if(e.target.result){
                        resolve(e.target.result.pages.length)
                    }
                    else {
                        resolve(1)
                    }
                }
                r.onerror = function (e){
                    console.log("Object store is being created")
                }
            } catch (e){
                console.log("Object store is being created")
            }

        };
    });
}
