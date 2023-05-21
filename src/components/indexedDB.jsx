export function createNotebook(name){
    let r = indexedDB.open("notebooks", 1)
    r.onupgradeneeded = function(e) {
        let db = e.target.result
        db.createObjectStore(name, {autoIncrement:true})
        console.log("created")
    }
}

export function storeToNotebook(name, page, data) {
    let r = indexedDB.open("notebooks", 1);
    r.onsuccess = function (e) {
        let db = e.target.result;
        let objectStore = db.transaction([name], "readwrite").objectStore(name);

        const request = objectStore.get(page);

        request.onsuccess = () => {
            let pageData = request.result;

            if (pageData) {
                // Key exists, update the value
                pageData.data = 'AAAAA';

                const updateRequest = objectStore.put(pageData, page);

                updateRequest.onsuccess = () => {
                    console.log("Record updated successfully");
                }

                updateRequest.onerror = () => {
                    console.log("Error updating the record");
                };
            } else {
                // Key doesn't exist, create a new record
                const newPageData = {data: 'Fulanito' };

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
export function getFromNotebook(name, page){
    let r = indexedDB.open("notebooks", 1);
    r.onsuccess = function (e) {
        let db = e.target.result;
        let objectStore = db.transaction([name], "readonly").objectStore(name);

        const countRequest = objectStore.count();
        countRequest.onsuccess = () => {
            console.log(countRequest.result);
        }
        const request = objectStore.get(page);

        request.onsuccess = () => {
            let pageData = request.result;

            if (pageData) {
                console.log("Retrieved data:", pageData);
            } else {
                console.log("Data not found");
            }
        }

        request.onerror = () => {
            console.log("Error retrieving the record");
        }
    }

}
export function deleteDB() {
    let request =
        window.indexedDB.open("notebooks", 1);
    let DBDeleteReq =
        window.indexedDB.deleteDatabase("notebooks");
    DBDeleteReq.onsuccess = function (event) {
        console.log("Database deleted successfully")
    }
}