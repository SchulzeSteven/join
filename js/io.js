const BASE_URL = "https://join-7e9c5-default-rtdb.europe-west1.firebasedatabase.app/";

/* Unterste Ebene der Datenbank Zugriffs Funktionen , alle Funktionen sollten AUSSCHLIESSLICH aus der Data.js aufgerufen werden */


/**
 * 
 * @param {*} path zu den Datenbank Einträgen, typische Nutzung /user oder /tasks
 * @returns json array aus der Datenbank
 */
async function loadData(path=""){
    let response = await fetch(BASE_URL + path + ".json");
    return responseToJson = await response.json();
}


/**
 * Function to push a data array to the database
 * @param {*} path zur Datenbank Liste
 * @param {*} data json Datenarray das in die Datenbank geschrieben werden soll
 * @returns gibt das response json array zurück zur Auswertung
 */
async function postData(path="", data={}){
    let response = await fetch(BASE_URL + path + ".json",{
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json();
}


/**
 * Function to delete the complete list in database
 * @param {*} path to the database json list
 * @returns response to check the result outside
 */
async function deleteData(path=""){
    let response = await fetch(BASE_URL + path + ".json",{
        method: "DELETE"
    });
    return responseToJson = await response.json();
}


/**
 * Function to push a data array to the database
 * @param {*} path to the database json list
 * @param {*} data json data array to put into the database
 * @returns response json to handle result
 */
async function putData(path="", data={}){
    let response = await fetch(BASE_URL + path + ".json",{
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json();
}
