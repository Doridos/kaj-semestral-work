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
    console.log(page)
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
    const DBDeleteReq = indexedDB.deleteDatabase(localStorage.getItem("user"));
    DBDeleteReq.onsuccess = function (event) {
        console.log("Database deleted successfully");
    };
    DBDeleteReq.onerror = function (e) {
        console.log(e.target.error)
    }
    localStorage.removeItem("notebookNames");
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
