export function createNotebook(name, version) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(localStorage.getItem("user"), version);
        request.onupgradeneeded = function (e) {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(name)) {
                db.createObjectStore(name, { autoIncrement: true });
            }
        };
        request.onerror = function (e) {
            reject("Error opening/creating the database");
        };
        request.onsuccess = function () {
            resolve(); // Resolve the promise when the object store is created
        };
    });
}

export function storeToNotebook(name, page, data) {
    const request = indexedDB.open(localStorage.getItem("user"));
    request.onsuccess = function (e) {
        const db = e.target.result;
        if (db.objectStoreNames.contains(name)) {
            const objectStore = db.transaction([name], "readwrite").objectStore(name);

            const getRequest = objectStore.get(page);

            getRequest.onsuccess = () => {
                let pageData = getRequest.result;

                if (pageData) {
                    // Key exists, update the value
                    pageData.data = data;

                    const updateRequest = objectStore.put(pageData, page);

                    updateRequest.onsuccess = () => {
                        console.log("Record updated successfully");
                    };

                    updateRequest.onerror = () => {
                        console.log("Error updating the record");
                    };
                } else {
                    // Key doesn't exist, create a new record
                    const newPageData = { data: data };

                    const addRequest = objectStore.add(newPageData);

                    addRequest.onsuccess = () => {
                        console.log("New record added successfully");
                    };

                    addRequest.onerror = () => {
                        console.log("Error adding the new record");
                    };
                }
            };

            getRequest.onerror = () => {
                console.log("Error retrieving the record");
            };
        }
    };
}

export function getFromNotebook(name, page) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(localStorage.getItem("user"));
        request.onsuccess = function (e) {
            const db = e.target.result;
            if (db.objectStoreNames.contains(name)) {
                const transaction = db.transaction([name], "readonly");
                const objectStore = transaction.objectStore(name);
                const getRequest = objectStore.get(page);
                getRequest.onsuccess = function (e) {
                    const imageData = e.target.result ? e.target.result.data : null;
                    if (imageData) {
                        resolve(imageData); // Resolve the promise with the image data
                    } else {
                        reject("Data not found"); // Reject the promise if data is not found
                    }
                };
                getRequest.onerror = function (e) {
                    reject("Error retrieving the image data"); // Reject the promise on error
                };
            }
        };
        request.onerror = function (e) {
            reject("Error opening the database"); // Reject the promise if there's an error opening the database
        };
    });
}

export function deleteDB() {
    const DBDeleteReq = indexedDB.deleteDatabase(localStorage.getItem("user"));
    DBDeleteReq.onsuccess = function (event) {
        console.log("Database deleted successfully");
    };
    localStorage.removeItem("notebookNames");
}

export async function getPagesCount(name) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(localStorage.getItem("user"));
        request.onsuccess = function (e) {
            const db = e.target.result;
            if (db.objectStoreNames.contains(name)) {
                const objectStore = db.transaction([name], "readonly").objectStore(name);
                const countRequest = objectStore.count();
                countRequest.onsuccess = () => {
                    resolve(countRequest.result);
                };
            }
        };
        request.onerror = function (e) {
            reject("Error opening the database"); // Reject the promise if there's an error opening the database
        };
    });
}
