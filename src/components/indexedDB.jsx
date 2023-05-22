import {addStep} from "./Canvas.jsx";

export function createNotebook(name, version) {

    return new Promise((resolve, reject) => {
        let r = indexedDB.open(localStorage.getItem("user"), version);
        r.onupgradeneeded = function (e) {
            let db = e.target.result;
            if (!db.objectStoreNames.contains(name)){
                db.createObjectStore(name, { autoIncrement: true });
            }

            console.log("created");
            resolve(); // Resolve the promise when object store is created
        };
        r.onerror = function (e) {
            reject("Error opening/creating the database");
        };
    });
}

export function storeToNotebook(name, page, data) {
    let r = indexedDB.open(localStorage.getItem("user"));
    r.onsuccess = function (e) {
        let db = e.target.result;
        if (db.objectStoreNames.contains(name)){
            let objectStore = db.transaction([name], "readwrite").objectStore(name);

            const request = objectStore.get(page);

            request.onsuccess = () => {
                let pageData = request.result;

                if (pageData) {
                    // Key exists, update the value
                    pageData.data = data;

                    const updateRequest = objectStore.put(pageData, page);

                    updateRequest.onsuccess = () => {
                        console.log(name)
                        console.log("Record updated successfully");
                    }

                    updateRequest.onerror = () => {
                        console.log("Error updating the record");
                    };
                } else {
                    // Key doesn't exist, create a new record
                    const newPageData = {data: data };

                    const addRequest = objectStore.add(newPageData);

                    addRequest.onsuccess = () => {
                        console.log("New record added successfully");
                    }

                    addRequest.onerror = () => {
                        console.log("Error adding the new record");
                    }
                }
            }

            request.onerror = () => {
                console.log("Error retrieving the record");
            }
        }

    }
}
export function getFromNotebook(name, page) {
    return new Promise((resolve, reject) => {
        let r = indexedDB.open(localStorage.getItem("user"));
        r.onsuccess = function (e) {
            let db = e.target.result;
            let t
            if (db.objectStoreNames.contains(name)){
               t = db.transaction([name], "readonly");
                let objectStore = t.objectStore(name);
                let r = objectStore.get(page);
                r.onsuccess = function (e) {
                    const imageData = e.target.result ? e.target.result.data : null;
                    if (imageData) {
                        resolve(imageData); // Resolve the promise with the image data
                    } else {
                        reject("Data not found"); // Reject the promise if data is not found
                    }
                };
                r.onerror = function (e) {
                    reject("Error retrieving the image data"); // Reject the promise on error
                };
            }
        };
        r.onerror = function (e) {
            reject("Error opening the database"); // Reject the promise if there's an error opening the database
        };
    });
}
export function deleteDB() {
    let request =
        window.indexedDB.open(localStorage.getItem("user"));
    let DBDeleteReq =
        window.indexedDB.deleteDatabase(localStorage.getItem("user"));
    DBDeleteReq.onsuccess = function (event) {
        console.log("Database deleted successfully")
    }
    localStorage.removeItem("notebookNames")
}
export async function getPagesCount(name) {
    return new Promise((resolve, reject) => {
        try {
            let r = indexedDB.open(localStorage.getItem("user"));
            r.onsuccess = function (e) {
                let db = e.target.result;
                if (db.objectStoreNames.contains(name)) {
                    let objectStore = db.transaction([name], "readonly").objectStore(name);

                    const countRequest = objectStore.count();
                    countRequest.onsuccess = () => {
                        resolve(countRequest.result);
                    };
                }

            };
        } catch (error) {
            reject(error);
        }
    });
}
