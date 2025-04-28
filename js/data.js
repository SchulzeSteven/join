/* Um möglichst mit merhreren Usern nahezu gleichzeitig auf den Daten arbeiten zu können,
   ist die Idee, bei jeder Datenänderung, z.B. hinzufügen eines Users, vorher die 
   Gesamtliste aus der Datenbank zu laden, dann den User hinzufügen und wieder speichern.
   Das gleiche mit Tasks. Wir arbeiten dabei niemals auf lokalen Arrays */

/* ################################     User Handling       ################################################## */
//#region User Handling
/**
 * 
 * Stores the given complete users[] entry in firebase database
 */
async function db_SaveUsers(users = []) {
    //PUT ersetzt bei bekanntem Eintragskey, erzeugt sonst einen neuen Eintrag
    let result = await putData("/users", users);
}


/**
 * 
 * Loads the complete users JSON array from firebase DB
 */
async function db_LoadUsers() {
    let users = await loadData("/users");
    return users;
}


/**
 * 
 * Loads the complete users JSON array from firebase DB
 * user the filter string to return only matching users
 */
async function db_LoadUsersFilteredByName(filter = "") {
    let users = await loadData("/users");
    let filteredUsers = [];
    let lowercaseFilter = filter.toLowerCase();
    users.forEach(user => {
        let username = user.name.toLowerCase();
        if (username.includes(lowercaseFilter)){
            filteredUsers.push(user);
        }
    });
    return filteredUsers;
}


/**
 * @param {string} userGUID
 * @returns a user JSON array if found by matching GUID
 */
async function db_GetUserByGUID(userGUID) {
    if (userGUID == null) {return null}
    if (userGUID.length == 0) {return null}
    let users = await db_LoadUsers();
    if (users == null) {return null}
    let user = Object.values(users).find(u => u.guid === userGUID);
    return user;
}


/**
 * 
 * Deletes the complete users entry in firebase database ! Attention when use !
 */
async function db_DeleteUsers_complete() {
    let result = await deleteData("/users");
}


/**
 * 
 * @param {*} usermail 
 * Deletes the user with matches to the mail from database 
 * complete rewrite database to prevent empty entries
 */
async function db_DeleteUserByEmail(usermail) {
    let users = await loadData("/users");
    let filteredUsers = [];
    let usermailLowercase = usermail.toLowerCase();
    users.forEach(user => {
        if (user.email.toLowerCase() != usermailLowercase){
            filteredUsers.push(user);
        }
    });
    if (filteredUsers.length == 0){
        await db_DeleteUsers_complete();
    }else{
        await db_SaveUsers(filteredUsers);
    }
}


/**
 * @returns true if stored, false if any problem
 * @param {any[]} [newUser=[]] the user as JSON Array to add in db
 * Add a user to the users collection
 */
async function db_AddUser(newUser = []) {
    if (newUser == null) {return false}
    if (newUser.length == 0) {return false}
    let users = await db_LoadUsers();
    if (users == null) {users = []}
    users.push(newUser);
    await db_SaveUsers(users);
    return true;
}


/**
 * @param {any[]} [userToChange=[]] input is the user that should be changed in database
 * @returns true if user changed, otherwise false
 * Changes a user in users collection
 */
async function db_ChangeUser(userToChange = []) {
    if (userToChange == null || userToChange.length == 0 || userToChange.guid == null || userToChange.guid.length == 0) {return}
    let users = await db_LoadUsers();
    if (users){
        for (let index = 0; index < users.length; index++) {
            if (users[index].guid == userToChange.guid){
                users[index] = userToChange;
                await db_SaveUsers(users);
                return true;
            }
        }
    }
    return false;
}


/**
 * 
 * @returns a new user JSON array with automatically filled guid
 * Example:
 * let myNewUser = newUser();
 */
function newUser() {
    let newUser = {
        "lastname": "",
        "firstname": "",
        "email": "",
        "phone": "",
        "password": "",
        "guid": generateGUID(),
        "color": randomColor(),
        "isguest": false
    };
    return newUser;
}
//#endregion


/* ################################     Contact Handling       ################################################## */
//#region Contact Handling
/**
 * 
 * Stores the given complete contacts[] entry in firebase database
 */
async function db_SaveContacts(contacts = []) {
    //PUT ersetzt bei bekanntem Eintragskey, erzeugt sonst einen neuen Eintrag
    let result = await putData("/contacts", contacts);
}


/**
 * 
 * Loads the complete contacts JSON array from firebase DB
 */
async function db_LoadContacts() {
    let contacts = await loadData("/contacts");
    return contacts;
}


/**
 * @param {string} contactGUID
 * @returns a contact JSON array if found by matching GUID
 */
async function db_GetContactByGUID(contactGUID) {
    if (contactGUID == null) {return null}
    if (contactGUID.length == 0) {return null}
    let contacts = await db_LoadContacts();
    if (contacts == null) {return null}
    let contact = Object.values(contacts).find(u => u.guid === contactGUID);
    return contact;
}


/**
 * 
 * Deletes the complete contacts entry in firebase database ! Attention when use !
 */
async function db_DeleteContacts_complete() {
    let result = await deleteData("/contacts");
}


/**
 * 
 * @param {*} contactmail 
 * Deletes the contact with matches to the mail from database 
 * complete rewrite database to prevent empty entries
 */
async function db_DeleteContactByEmail(guid) {
    let contacts = await db_LoadContacts();
    let filteredcontacts = [];
    let guidLowercase = guid.toLowerCase();
    contacts.forEach(contact => {
        if (contact.guid.toLowerCase() != guidLowercase){
            filteredcontacts.push(contact);
        }
    });
    if (filteredcontacts.length == 0){
        await db_DeleteContacts_complete();
    }else{
        await db_SaveContacts(filteredcontacts);
    }
}


/**
 * @returns true if stored, false if any problem
 * @param {any[]} [newContact=[]] the contact as JSON Array to add in db
 * Add a contact to the contacts collection
 */
async function db_AddContact(newContact = []) {
    if (newContact == null) {return false}
    if (newContact.length == 0) {return false}
    let contacts = await db_LoadContacts();
    if (contacts == null) {contacts = []}
    contacts.push(newContact);
    await db_SaveContacts(contacts);
    return true;
}


/**
 * @param {any[]} [contactToChange=[]] input is the contact that should be changed in database
 * @returns true if contact changed, otherwise false
 * Changes a contact in contacts collection
 */
async function db_ChangeContact(contactToChange = []) {
    if (contactToChange == null || contactToChange.length == 0 || contactToChange.guid == null || contactToChange.guid.length == 0) {return}
    let contacts = await db_LoadContacts();
    if (contacts){
        for (let index = 0; index < contacts.length; index++) {
            if (contacts[index].guid == contactToChange.guid){
                contacts[index] = contactToChange;
                await db_SaveContacts(contacts);
                return true;
            }
        }
    }
    return false;
}

/**
 * 
 * @returns a new contact JSON array with automatically filled guid
 * Example:
 * let myNewContact = newContact();
 */
function newContact() {
    let newContact = {
        "lastname": "",
        "firstname": "",
        "email": "",
        "phone": "",
        "guid": generateGUID(),
        "color": randomColor(),
    };
    return newContact;
}
//#endregion


/* ################################     Task Handling       ################################################## */
//#region Task Handling

/**
 * 
 * Stores the given complete tasks[] entry in firebase database
 */
async function db_SaveTasks(tasks = []) {
    //PUT ersetzt bei bekanntem Eintragskey, erzeugt sonst einen neuen Eintrag
    let result = await putData("/tasks", tasks);
}


/**
 * 
 * Loads the complete tasks JSON array from firebase DB
 */
async function db_LoadTasks() {
    let tasks = await loadData("/tasks");
    if (tasks == null) {tasks = []}
    return tasks;
}


/**
 * 
 * @param {*} task
 * Deletes the task with matches to the guid from database 
 * complete rewrite database to prevent empty entries
 */
async function db_DeleteTask(taskToDelete) {
    let tasks = await db_LoadTasks();
    let filteredtasks = [];
    tasks.forEach(task => {
        if (task.guid != taskToDelete.guid){
            filteredtasks.push(task);
        }
    });
    if (filteredtasks.length == 0){
        await db_DeleteTasks_complete();
    }else{
        await db_SaveTasks(filteredtasks);
    }
}


/**
 * 
 * @returns JSON Array of tasks that matches the given filter string
 * @param {string} [filter=""] string to get only tasks with the string in title or description
 * Loads the complete tasks JSON array from firebase DB
 * uses the filter string to return only matching tasks
 */
async function db_LoadTasksFiltered(filter = "") {
    let tasks = await loadData("/tasks");
    let filteredTasks = [];
    let lowercaseFilter = filter.toLowerCase();
    if (tasks && tasks.length > 0) {
        tasks.forEach(task => {
            let checkString = task.title.toLowerCase() + task.description.toLowerCase();
            if (checkString.includes(lowercaseFilter)){
                filteredTasks.push(task);
            }
        });
     }
    return filteredTasks;
}


/**
 * 
 * Deletes the complete tasks entry in firebase database ! Attention when use !
 */
async function db_DeleteTasks_complete() {
    let result = await deleteData("/tasks");
    console.log(result);
}


/**
 * @returns true if task added, otherwise false
 * Add a tasks to the tasks collection
 */
async function db_AddTask(taskToAdd = []) {
    let result = false;
    if (taskToAdd == null) {return}
    if (taskToAdd.length == 0) {return}
    let tasks = await db_LoadTasks();
    if (tasks == null){tasks = [];}
    tasks.push(taskToAdd);
    await db_SaveTasks(tasks);
    result = true;
    return result;
}


/**
 * @param {any[]} [taskToChange=[]] input is the task that should be changed in database
 * @returns true if task changed, otherwise false
 * Changes a tasks in tasks collection
 */
async function db_ChangeTask(taskToChange = []) {
    if (taskToChange == null || taskToChange.length == 0 || taskToChange.guid == null || taskToChange.guid.length == 0) {return}
    let tasks = await db_LoadTasks();
    if (tasks){
        for (let index = 0; index < tasks.length; index++) {
            if (tasks[index].guid == taskToChange.guid){
                tasks[index] = taskToChange;
                await db_SaveTasks(tasks);
                return true;
            }
        }
    }
    return false;
}


/**
 * @param {string} taskGUID 
 * @returns a task JSON array if found by matching GUID
 */
async function db_GetTaskByGUID(taskGUID) {
    if (taskGUID == null) {return null}
    if (taskGUID.length == 0) {return null}
    let tasks = await db_LoadTasks();
    if (tasks == null) {return null}
    let task = Object.values(tasks).find(t => t.guid === taskGUID);
    return task;
}


/**
 * 
 * @returns a new task JSON array with automatically filled guid
 * Example:
 * let myNewTask = newTask();
 * 
 * state can be : ToDo (default) / InProgress / AwaitFeedback / Done
 * if a task is type of sub task, the parenttaskid is filled with the id of the parent task
 * assignedto is an array of IDs of assigned users
 * prio can be urgent / medium / low (default)
 * category can be technical task or user story (default)
 * subtasks is an array of String for name and state for done or not
 */
function newTask() {
    let newTask = {
        "title": "",
        "description": "",
        "state": "ToDo",
        "guid": generateGUID(),
        "assignedto": [],
        "duedate": 0,
        "prio": "medium",
        "category": "user story",
        "subtasks": []
    };
    return newTask;
}
//#endregion


// ############################      Logged In User Speicherung WÄHREND der Sitzung oder in Local Storage    ##########################
//#region Logged In User Speicherung

// Benutzer-Informationen in localStorage
// aber nur eine minimized User Info, also email und das Remember Me Flag
function setLoggedInUserMail_LS(userMail = "") {
    localStorage.setItem('loggedInUserMail', userMail);
}


// Benutzer-Informationen aus localStorage abrufen
function getLoggedInUserMail_LS() {
    return localStorage.getItem('loggedInUserMail');
}


// Benutzer-Informationen aus localStorage löschen
function deleteLoggedInUserMail_LS() {
    localStorage.removeItem('loggedInUserMail');
}


// Benutzer-Informationen in sessionStorage
// aber nur eine minimized User Info, also email und das Remember Me Flag
function setLoggedInUserMail_SS(userMail = "") {
    sessionStorage.setItem('loggedInUserMail', userMail);
}


function setLoggedInUserRememberMe_SS(rememberMe = false) {
    sessionStorage.setItem('loggedInUserRememberMe', rememberMe);
}


// Benutzer-Informationen aus sessionStorage abrufen
function getLoggedInUserMail_SS() {
    return sessionStorage.getItem('loggedInUserMail');
}


function getLoggedInUserRememberMe_SS() {
    return sessionStorage.getItem('loggedInUserRememberMe');
}

// Benutzer-Informationen aus sessionStorage löschen
function deleteLoggedInUserMail_SS() {
    sessionStorage.removeItem('loggedInUserMail');
}


function deleteLoggedInUserRememberMe_SS() {
    sessionStorage.removeItem('loggedInUserRememberMe');
}
//#endregion


/* ################################    Helper Functions     ################################################## */
//#region Helper

/**
 * 
 * @returns a generated GUID hex string
 * Example:
 * let myGUID = generateGUID();
 */
function generateGUID() {
    // 16 zufällige Bytes erzeugen
    const buf = new Uint8Array(16);
    crypto.getRandomValues(buf);

    // Die Werte gemäß RFC 4122 manipulieren
    buf[6] = (buf[6] & 0x0f) | 0x40; // Version 4
    buf[8] = (buf[8] & 0x3f) | 0x80; // Variant 10

    const hex = Array.from(buf).map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Hexadezimale Werte zum UUID-Format zusammenfügen
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
//#endregion
