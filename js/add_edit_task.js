/* start the page with a fresh new task (default state = ToDo) */
let theNewTask = newTask();


/* list of all contacts , filled in function prepareFields() */
let contacts;


/* helper variable for date time picker to disable date times before today */
const today = () => {return new Date().toLocaleDateString('en-ca');};


/**
 * ######################################################################################
 * Main function called from init to update data in selections and colorized some buttons
 * ######################################################################################
 */
async function prepareFields() {
    contacts = await db_LoadContacts();
    if (!contacts) {contacts = [];}

    /* erst mal nur Kontakte anzeigen */
/*     users = await db_LoadUsers();
    if (users) {contacts = contacts.concat(users);}     
 */
    colorizePrioButtons();
    fillAssignedUserCircleContainer();
    buildSubTaskEntries();
    setupClickOutside();
}


/**
 * Function called from html clear button by onclick() to clear all set values
 */
function clearFields() {
    theNewTask = newTask();
    setPrio("medium");
    document.getElementById('inputTaskTitle').value = null;
    document.getElementById('inputTaskDueDate').value = null;
    document.getElementById('inputTaskDescription').value = null;
    document.getElementById('inputCategory').value = null;
    document.getElementById('inputAssignTo').value = null;
    document.getElementById('input-subtask').value = null;
    document.getElementById('inputCategoryHidden').value = null;
    fillAssignedUserCircleContainer();
    buildSubTaskEntries();
    closeDropDownSelectorAssignTo();
    closeDropDownSelectorCategory();
}


/**
 * fill the task fields by the date set in theNewTask when page is opened
 */
function fillFields() {
    document.getElementById('inputTaskTitle').value = theNewTask.title;
    document.getElementById('inputTaskDueDate').value = theNewTask.duedate;
    document.getElementById('inputTaskDescription').value = theNewTask.description;
    switch (theNewTask.category) {
        case "technical task":
            document.getElementById('inputCategory').value = "Technical Task"
            document.getElementById('inputCategoryHidden').value = "Technical Task"
            break;
        case "user story":
            document.getElementById('inputCategory').value = "User Story"        
            document.getElementById('inputCategoryHidden').value = "User Story"        
            break;
        }
}


/**
 * 
 * @param {*} event function called from Add -> addTaskTemplate.html form onsubmit event
 */
async function formAddTask(event) {
    event.preventDefault();
    await db_AddTask(theNewTask);
    /* renderBoard() */
    navigateToBoard();
}


/**
 * 
 * @param {*} event function called from Edit -> addTaskTemplate.html form onsubmit event
 */
async function formChangeTask(event) {
    event.preventDefault();
    await db_ChangeTask(theNewTask);
    /* renderBoard() */
    navigateToBoard();
}


/**
 * function read out title text and store it in actual task
 */
function setTitle() {
    theNewTask.title = document.getElementById('inputTaskTitle').value;
}


/**
 * function read out description text and store it in actual task
 */
function setDescription() {
    let description = document.getElementById('inputTaskDescription').value;
    theNewTask.description = (description) ? description : '';
}


/**
 * function read out category text and store it in actual task
 */
function setCategory(category) {
    theNewTask.category = category;
    closeDropDownSelectorCategory();
    switch (category) {
        case 'technical task':
            document.getElementById('inputCategory').value = 'Technical Task';
            break;
        case 'user story':
            document.getElementById('inputCategory').value = 'User Story';
            break;
    }
    document.getElementById('inputCategoryHidden').value = document.getElementById('inputCategory').value;
}


/**
 * function read out due date text and store it in actual task
 */
function setDueDate() {
    let date = document.getElementById('inputTaskDueDate').value;
    theNewTask.duedate = "";
    if (date) {
        theNewTask.duedate = date;     /* format is set to dd/mm/yyyy by pattern in html file */    
    }
}


/**
 * 
 * @param {*} prioToSet sets the prio (low medum urgent) value and calls the button colorizing function
 */
function setPrio(prioToSet) {
    theNewTask.prio = prioToSet;
    colorizePrioButtons();
}

//#region Category Handling

/**
 * open the category selector and toggle the arrow image in selector
 */
function toggleCategoryArrow(event) {
    if (document.getElementById('container-categoryselector').classList.contains('dnonei')){
        closeDropDownSelectorAssignTo();
        openDropDownSelectorCategory();
        event.stopPropagation();
    }else{
        document.getElementById('inputCategory').value = "";
        closeDropDownSelectorCategory();
    }
}


/**
 * Opens the drop down selector for category
 */
function openDropDownSelectorCategory() {
    if (document.getElementById('container-categoryselector')){
        document.getElementById('container-categoryselector').classList.remove('dnonei');
        document.getElementById('container-inputCategory').classList.add('border-highlight');
        document.getElementById('imageArrowCategory').classList.add('imageArrowFlipY');
    }
}


/**
 * Closes the drop down selectors for category
 */
function closeDropDownSelectorCategory() {
    if (document.getElementById('container-categoryselector')){
        document.getElementById('container-categoryselector').classList.add('dnonei');
        document.getElementById('container-inputCategory').classList.remove('border-highlight');
        document.getElementById('imageArrowCategory').classList.remove('imageArrowFlipY');
    }
}

//#endregion

//#region Assign To Handling

/**
 * toggle the arrow in drop down box and opens or closes the box
 */
function toggleAssignToArrow(event) {
    if (document.getElementById('container-assignselector').classList.contains('dnonei')){
        closeDropDownSelectorCategory();
        openDropDownSelectorAssignTo();
        let filterText = document.getElementById('inputAssignTo').value;
        const contactsFiltered = contacts.filter(contact => contact.firstname.toLowerCase().includes(filterText.toLowerCase()) || contact.lastname.toLowerCase().includes(filterText.toLowerCase()));
        fillAssignToDropDown(contactsFiltered);
        event.stopPropagation();
    }else{
        document.getElementById('inputAssignTo').value = "";
        closeDropDownSelectorAssignTo();
    }
}


/**
 * Opens the AssignTo dropDown selektor
 */
function openDropDownSelectorAssignTo() {
    if (document.getElementById('container-assignselector')) {
        document.getElementById('container-assignselector').classList.remove('dnonei');
        document.getElementById('container-inputAssignTo').classList.add('border-highlight');
        document.getElementById('imageArrowAssignTo').classList.add('imageArrowFlipY');
    }
}


/**
 * Closes the AssignTo dropDown selektor
 */
function closeDropDownSelectorAssignTo() {
    if (document.getElementById('container-assignselector')) {
        document.getElementById('container-assignselector').classList.add('dnonei');
        document.getElementById('container-inputAssignTo').classList.remove('border-highlight');
        document.getElementById('imageArrowAssignTo').classList.remove('imageArrowFlipY');
    }
}


/**
 * Handles the onInput from AssignTo input field
 */
async function oninputAssignedTo() {
    fillAssignToDropDown();
    openDropDownSelectorAssignTo();
}


/**
 * If the user click on an entry in the dropdown box AssignTo, the function
 * handles the data set to the new or edited Task
 * @param {*} customerGUID of the clicked contact in drop down list
 */
function assignToEntryClicked(customerGUID, event) {
    if (theNewTask.assignedto == null) {theNewTask.assignedto = []};
    if (theNewTask.assignedto.includes(customerGUID)) {
        theNewTask.assignedto = theNewTask.assignedto.filter(element => element !== customerGUID);
    }else{
        theNewTask.assignedto.push(customerGUID);
    }
    fillAssignToDropDown();
    fillAssignedUserCircleContainer();
    event.stopPropagation();
}


/**
 * function filters the actual contact list by the text that the user given in input field
 * and creates the drop down entries with the filtered user / contact fields
 */
async function fillAssignToDropDown() {
    let inner = ""
    let filterText = document.getElementById('inputAssignTo').value;
    const contactsFiltered = contacts.filter(contact => contact.firstname.toLowerCase().includes(filterText.toLowerCase()) || contact.lastname.toLowerCase().includes(filterText.toLowerCase()));
    contactsFiltered.forEach(contact => {
        if (theNewTask.assignedto && theNewTask.assignedto.includes(contact.guid)) {
            inner += `<div id='assignTo${contact.guid}' onclick="assignToEntryClicked('${contact.guid}', event)" class="assignselector-entry-highlight">${buildContactCircle(contact)}<h6>${contact.firstname} ${contact.lastname}</h6></div>`
        }else{
            inner += `<div id='assignTo${contact.guid}' onclick="assignToEntryClicked('${contact.guid}', event)" class="assignselector-entry">${buildContactCircle(contact)}<h6>${contact.firstname} ${contact.lastname}</h6></div>`
        }
    });
    document.getElementById('container-assignselector').innerHTML = inner;
}


/**
 * function creates user info circles below the assign to drop down box depending on the assigned user in task
 */
function fillAssignedUserCircleContainer() {
    document.getElementById('container-assigned-contact-circles').innerHTML = "";
    contacts.forEach(contact => {
        if (theNewTask.assignedto && theNewTask.assignedto.includes(contact.guid)) {
            document.getElementById('container-assigned-contact-circles').innerHTML += buildContactCircle(contact);
        }
    });
}


/**
 * function create the html code for an element that visualizes the user circle with its initials inside
 * @param {*} contact contact / user to create the info circle from
 * @returns html code element of the user circle
 */
function buildContactCircle(contact) {
    let Initials = calculateInitials(contact);
    let contactColor = contact.color;
    let element;
    if (contact) {
        element = `
        <div class="contactCircle" style="background-color: ${contactColor}">
            <h6>${Initials}</h6>
        </div>`;
    }
    return element;
}
//#endregion


//#region Priority Handling
/**
 * colorized the 3 prio buttons depending on the Task.prio data set
 */
function colorizePrioButtons() {
    switch (theNewTask.prio) {
        case "low":
            highlightButton_PrioLow();
            break;
        case "medium":
            highlightButton_PrioMedium();
            break;
        case "urgent":
            highlightButton_PrioUrgent();
            break;
            }
}


/**
 * function highlights the LOW priority button and un-highlight the others
 */
function highlightButton_PrioLow() {
    /* set seleted css class to low button */
    document.getElementById('btn-prio-low').classList.add('btn-prio-low-selected');
    document.getElementById('btn-prio-low').classList.remove('btn-prio-low-default');
    /* set default css class to all others */
    document.getElementById('btn-prio-medium').classList.remove('btn-prio-medium-selected');
    document.getElementById('btn-prio-medium').classList.add('btn-prio-medium-default');
    document.getElementById('btn-prio-urgent').classList.remove('btn-prio-urgent-selected');
    document.getElementById('btn-prio-urgent').classList.add('btn-prio-urgent-default');
}


/**
 * function highlights the MEDIUM priority button and un-highlight the others
 */
function highlightButton_PrioMedium() {
    /* set seleted css class to medium button */
    document.getElementById('btn-prio-medium').classList.add('btn-prio-medium-selected');
    document.getElementById('btn-prio-medium').classList.remove('btn-prio-medium-default');
    /* set default css class to all others */
    document.getElementById('btn-prio-low').classList.remove('btn-prio-low-selected');
    document.getElementById('btn-prio-low').classList.add('btn-prio-low-default');
    document.getElementById('btn-prio-urgent').classList.remove('btn-prio-urgent-selected');
    document.getElementById('btn-prio-urgent').classList.add('btn-prio-urgent-default');
}


/**
 * function highlights the URGENT priority button and un-highlight the others
 */
function highlightButton_PrioUrgent() {
    /* set seleted css class to urgent button */
    document.getElementById('btn-prio-urgent').classList.add('btn-prio-urgent-selected');
    document.getElementById('btn-prio-urgent').classList.remove('btn-prio-urgent-default');
    /* set default css class to all others */
    document.getElementById('btn-prio-low').classList.remove('btn-prio-low-selected');
    document.getElementById('btn-prio-low').classList.add('btn-prio-low-default');
    document.getElementById('btn-prio-medium').classList.remove('btn-prio-medium-selected');
    document.getElementById('btn-prio-medium').classList.add('btn-prio-medium-default');
}
//#endregion


//#region SubTask Handling
let newSubTaskText;


/**
 * function creates the subtask entries and put the html code into the document
 * calls a sub function for shorter code
 */
function buildSubTaskEntries() {
    document.getElementById('container-input-subtask-list').innerHTML = '';
    if(!theNewTask || !theNewTask.subtasks || theNewTask.subtasks.length == 0) {return;}
    theNewTask.subtasks.forEach((subTask, index) => {
        document.getElementById('container-input-subtask-list').innerHTML += buildSubTaskEntryHTML(subTask, index);
    });
}


/**
 * function creates the html code for each sub task, called by buildSubTaskEntries for each sub task of a task
 * @param {*} subTask the subtask entry of a task
 * @param {*} index the index of that sub task for later event handling
 * @returns the html element that is created to be pushed into the document
 */
function buildSubTaskEntryHTML(subTask, index) {
    let element = /*HTML*/ `
        <div class="subTaskEntryListElement">
            <div class="subTaskEntryListElementInner" style="flex: 1; justify-content: flex-start">
                <h6>• </h6>
                <input id="inputSubTaskTitle_${index}" value="${subTask.title}" class="inputSubTaskTitle" style="flex: 1" type="text" oninput="setSubTaskTitle(${index})">
            </div>
            <div class="subTaskEntryListElementInner" style="width: 100px">
                <img src="./assets/img/icons/edit.svg" class="svg-subtask-element-edit" onclick="document.getElementById('inputSubTaskTitle_${index}').focus()">
                <div class="SubTask-ElementSeparator"></div>
                <img src="./assets/img/icons/delete.svg" class="svg-subtask-element-delete" onclick="deleteSubTask(${index})">
            </div>
        </div>
    `;
    return (element);
}


/**
 * function handles the onInput event of the subTask input field
 * if min one char is typed into the field, it shows the check and cancel buttons
 * otherwise it shows a simple add symbol
 */
function inputSubTaskOnInput() {
    let text = document.getElementById('input-subtask').value;
    if (!text || text.length == 0) {
        inputSubTaskShowSymbol_Add();
        return;
    }else{
        newSubTaskText = text;
        inputSubTaskShowSymbols_CheckCancel();
    }
}


/**
 * handling of different css styles for the add symbol in subTask edit field
 */
function inputSubTaskShowSymbol_Add() {
    document.getElementById('svg-subtask-add').classList.remove('dnone');
    document.getElementById('svg-subtask-check').classList.add('dnone');
    document.getElementById('svg-subtask-cancel').classList.add('dnone');
    document.getElementById('separator-subtask').classList.add('dnone');
}


/**
 * handling of different css styles for the check and cancel symbols in subTask edit field
 */
function inputSubTaskShowSymbols_CheckCancel() {
    document.getElementById('svg-subtask-add').classList.add('dnone');
    document.getElementById('svg-subtask-check').classList.remove('dnone');
    document.getElementById('svg-subtask-cancel').classList.remove('dnone');
    document.getElementById('separator-subtask').classList.remove('dnone');
}


/**
 * function handles the focus and lost focus (onBlur) events to set the border color of the input sub task fields
 * @param {*} event onFocus event
 * @param {*} hasFocus flag if the element has the focus
 */
function inputSubTaskOnFocus(event, hasFocus = false) {
    if (hasFocus){
        let text = document.getElementById('container-input-subtask').classList.add('highlight-border');
    }else{
        let text = document.getElementById('container-input-subtask').classList.remove('highlight-border');
    }
}


/**
 * handles the cancel button click event if user cancels the sub task editing
 */
function svgInputSubTaskCancel() {
    document.getElementById('input-subtask').value = null;
    inputSubTaskShowSymbol_Add();
    newSubTaskText = null;
}


/**
 * handles the add subtask button click event if user edited a sub task name to store it
 */
function svgInputSubTaskAdd() {
    if (!theNewTask.subtasks) {theNewTask.subtasks = []}
    let newSubTaskEntry = {
        "title": newSubTaskText,
        "done": "false",
        "guid": generateGUID()
    };
    theNewTask.subtasks.push(newSubTaskEntry);
    buildSubTaskEntries();
    document.getElementById('input-subtask').value = null;
}


/**
 * handles the delete button click event if user deletes the sub task
 */
function deleteSubTask(subTaskIndex) {
    theNewTask.subtasks.splice(subTaskIndex,1);
    buildSubTaskEntries();
}


/**
 * function read out the sub task title and store it into task data
 */
function setSubTaskTitle(subTaskIndex) {
    let val = document.getElementById("inputSubTaskTitle_" + subTaskIndex).value;
    if (val) {
        theNewTask.subtasks[subTaskIndex].title = val;
    }
}
//#endregion


/**
 * main function to create the add task html code
 * it calls the createAddTaskHTMLCode() function for smaller code blocks
 */
function createAddTask() {
    let AddTaskHTMLCode = createAddTaskHTMLCode();
    let taskDiv = document.getElementById('task');
    if (taskDiv) {taskDiv.innerHTML += AddTaskHTMLCode}
}


/**
 * this function creates the complete html code to create the add task page
 * function called from board if user want to add a task or from AddTask html page
 * @returns the html code that will be pushed into the main page container or popup
 */
function createAddTaskHTMLCode() {
    AddTaskHTMLCode = /*HTML*/`
        <div id="addTaskTemplate" class="content-inside addTaskTemplate">
            <section class="container-headline">
                <h1>Add Task</h1>
            </section>
            <form class="task-data-form" onsubmit="formAddTask(event)">
                <section class="container-form-upper-parts">
                    <!-- Linker Teil der Task Daten -->
                    <div id="container-parameter-left" class="container-parameter-left">
                        <div class="container-parameter-part">
                            <h6>Title<span style="color: var(--error-color);">*</span></h6>
                            <input id="inputTaskTitle" class="task-input" name="title" type="text" placeholder="Enter a title" required oninput="setTitle()">
                        </div>
                        <div class="container-parameter-part">
                            <h6>Description</h6>
                            <textarea id="inputTaskDescription" class="task-textarea" name="description" placeholder="Enter a description" oninput="setDescription()"></textarea>
                        </div>
                        <div class="container-parameter-part">
                            <h6>Assigned to</h6>
                            <div class="wrapper-assign-to">
                                <div id="container-inputAssignTo" class="container-inputAssignTo task-input" onclick="toggleAssignToArrow(event)">
                                    <input class="inputAssignTo" id="inputAssignTo" name="AssignTo" type="text" placeholder="Select contacts to assign" oninput="oninputAssignedTo()">
                                    <img id="imageArrowAssignTo" class="imageArrow" src="./assets/img/icons/arrow_down.svg" alt="">
                                </div>
                                <div id="container-assignselector" class="container-assignselector dnonei"></div>
                            </div>
                        </div>
                        <div class="container-assigned-contact-circles" id="container-assigned-contact-circles">
                            <!-- filled by js -->
                        </div>
                    </div>

                    <div id="task-separator" class="task-separator"></div>

                    <!-- Rechter Teil der Task Daten -->
                    <div id="container-parameter-right" class="container-parameter-right">
                        <div class="container-parameter-part">
                            <h6>Due date<span style="color: var(--error-color);">*</span></h6>
                            <input id="inputTaskDueDate" class="task-input" name="duedate" type="date" min="${today()}" onchange="setDueDate()" required>
                        </div>
                        <div class="container-parameter-part">
                            <h6>Prio</h6>
                            <div class="prio-btns">
                                <div class="btn-prio btn-prio-urgent-default" id="btn-prio-urgent" onclick="setPrio('urgent')">
                                    <h6 style="padding-bottom: 0px">Urgent</h6>
                                    <div class="img-btn-prio-urgent"></div>
                                </div>
                                <div class="btn-prio btn-prio-medium-default" id="btn-prio-medium" onclick="setPrio('medium')">
                                    <h6 style="padding-bottom: 0px">Medium</h6>
                                    <div class="img-btn-prio-medium"></div>
                                </div>
                                <div class="btn-prio btn-prio-low-default" id="btn-prio-low" onclick="setPrio('low')">
                                    <h6 style="padding-bottom: 0px">Low</h6>
                                    <div class="img-btn-prio-low"></div>
                                </div>
                            </div>
                        </div>
                        <div class="container-parameter-part">
                            <h6>Category<span style="color: var(--error-color);">*</span></h6>
                            
                            <div class="wrapper-category">
                                <div id="container-inputCategory" class="container-inputCategory task-input" onclick="toggleCategoryArrow(event)">
                                    <input class="inputCategory" id="inputCategory" name="Category" type="text" placeholder="Select task category" oninput="oninputCategory()" readonly>
                                    <img id="imageArrowCategory" class="imageArrow" src="./assets/img/icons/arrow_down.svg" alt="">
                                </div>
                                <div id="container-categoryselector" class="container-categoryselector dnonei">
                                    <div id='assignTo-TechnicalTask' onclick="setCategory('technical task')" class="categoryselector-entry"><h6>Technical Task</h6></div>
                                    <div id='assignTo-UserStory' onclick="setCategory('user story')" class="categoryselector-entry"><h6>User Story</h6></div>
                                </div>
                            </div>
                            <input class="inputCategoryHidden" id="inputCategoryHidden" name="Category" type="text" required>
                        </div>
                        <div class="container-parameter-part">
                            <h6>Subtasks</h6>
                            <div class="container-input-subtask" id="container-input-subtask">
                                <div class="left-input-area">
                                    <input id="input-subtask" class="input-subtask add-logo" name="subtasks" type="text" placeholder="Add new subtask" onfocus="inputSubTaskOnFocus(event, true)" onblur="inputSubTaskOnFocus(event,false)" oninput="inputSubTaskOnInput()">
                                </div>

                                <div class="right-images-area">
                                    <img src="./assets/img/icons/add.svg" id="svg-subtask-add" class="svg-subtask-add">
                                    <img src="./assets/img/task/check.svg" alt="check" id="svg-subtask-check" class="svg-subtask-check dnone" onclick="svgInputSubTaskAdd()">
                                    <div id="separator-subtask" class="separator-input-subtask dnone"></div>
                                    <img src="./assets/img/icons/cancel.svg" alt="cancel" id="svg-subtask-cancel" class="svg-subtask-cancel dnone" onclick="svgInputSubTaskCancel()">
                                </div>

                            </div>

                            <div class="container-input-subtask-list" id="container-input-subtask-list">
                                <!-- filled dynamically from task data, different edit modes possible -->
                            </div>

                        </div>
                    </div>
                </section>
                <!-- Unterer Teil der Task Daten -->
                <div class="container-parameter-bottom">
                    <h6><span style="color: var(--error-color);">*</span>This field is required</h6>
                    <div class="task-btns">
                        <button class="cancel-btn" type="button" onclick="clearFields()">
                            Clear
                            <!-- <img src="assets/img/icons/cancel.svg" alt="cancel""> -->
                            <svg width="14" height="13" viewBox="0 0 14 13" stroke="#2A3647" fill="none">
                                <path d="M7.001 6.50008L12.244 11.7431M1.758 11.7431L7.001 6.50008L1.758 11.7431ZM12.244 1.25708L7 6.50008L12.244 1.25708ZM7 6.50008L1.758 1.25708L7 6.50008Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <button class="create-btn fbold bfill" type="submit">
                            Create Task
                            <!-- <img src="assets/img/task/check.svg" alt="check"> -->
                            <svg width="38" height="30" viewBox="0 0 38 30" fill="none" stroke="white">
                                <path d="M4.02832 15.0001L15.2571 26.0662L33.9717 3.93408" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>                        
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `;
    return AddTaskHTMLCode;
}


/**
 * this function creates the complete html code to create the edit task page
 * its called from board if user want to edit a given task
 * @returns the html code that will be pushed into the main page container or popup
 */
function createEditTaskHTMLCode() {
    EditTaskHTMLCode = /*HTML*/`
        <div id="addTaskTemplate" class="content-inside addTaskTemplate">
            <section class="container-headline">
                <h1>Edit Task</h1>
            </section>
            <form class="task-data-form" onsubmit="formChangeTask(event)">
                <section class="container-form-upper-parts">
                    <!-- Linker Teil der Task Daten -->
                    <div id="container-parameter-left" class="container-parameter-left">
                        <div class="container-parameter-part">
                            <h6>Title<span style="color: var(--error-color);">*</span></h6>
                            <input id="inputTaskTitle" class="task-input" name="title" type="text" placeholder="Enter a title" required oninput="setTitle()">
                        </div>
                        <div class="container-parameter-part">
                            <h6>Description</h6>
                            <textarea id="inputTaskDescription" class="task-textarea" name="description" placeholder="Enter a description" oninput="setDescription()"></textarea>
                        </div>
                        <div class="container-parameter-part">
                            <h6>Assigned to</h6>
                            <div class="wrapper-assign-to">
                                <div id="container-inputAssignTo" class="container-inputAssignTo task-input" onclick="toggleAssignToArrow(event)">
                                    <input class="inputAssignTo" id="inputAssignTo" name="AssignTo" type="text" placeholder="Select contacts to assign" oninput="oninputAssignedTo()">
                                    <img id="imageArrowAssignTo" class="imageArrow" src="./assets/img/icons/arrow_down.svg" alt="">
                                </div>
                                <div id="container-assignselector" class="container-assignselector dnonei"></div>
                            </div>
                        </div>
                        <div class="container-assigned-contact-circles" id="container-assigned-contact-circles">
                            <!-- filled by js -->
                        </div>
                    </div>

                    <div id="task-separator" class="task-separator"></div>

                    <!-- Rechter Teil der Task Daten -->
                    <div id="container-parameter-right" class="container-parameter-right">
                        <div class="container-parameter-part">
                            <h6>Due date<span style="color: var(--error-color);">*</span></h6>
                            <input id="inputTaskDueDate" class="task-input" name="duedate" type="date" min="${today()}" onchange="setDueDate()" required>
                        </div>
                        <div class="container-parameter-part">
                            <h6>Prio</h6>
                            <div class="prio-btns">
                                <div class="btn-prio btn-prio-urgent-default" id="btn-prio-urgent" onclick="setPrio('urgent')">
                                    <h6 style="padding-bottom: 0px">Urgent</h6>
                                    <div class="img-btn-prio-urgent"></div>
                                </div>
                                <div class="btn-prio btn-prio-medium-default" id="btn-prio-medium" onclick="setPrio('medium')">
                                    <h6 style="padding-bottom: 0px">Medium</h6>
                                    <div class="img-btn-prio-medium"></div>
                                </div>
                                <div class="btn-prio btn-prio-low-default" id="btn-prio-low" onclick="setPrio('low')">
                                    <h6 style="padding-bottom: 0px">Low</h6>
                                    <div class="img-btn-prio-low"></div>
                                </div>
                            </div>
                        </div>
                        <div class="container-parameter-part">
                            <h6>Category<span style="color: var(--error-color);">*</span></h6>
                            
                            <div class="wrapper-category">
                                <div id="container-inputCategory" class="container-inputCategory task-input" onclick="toggleCategoryArrow(event)">
                                    <input class="inputCategory" id="inputCategory" name="Category" type="text" placeholder="Select task category" oninput="oninputCategory()" readonly>
                                    <img id="imageArrowCategory" class="imageArrow" src="./assets/img/icons/arrow_down.svg" alt="">
                                </div>
                                <div id="container-categoryselector" class="container-categoryselector dnonei">
                                    <div id='assignTo-TechnicalTask' onclick="setCategory('technical task')" class="categoryselector-entry"><h6>Technical Task</h6></div>
                                    <div id='assignTo-UserStory' onclick="setCategory('user story')" class="categoryselector-entry"><h6>User Story</h6></div>
                                </div>
                            </div>
                            <input class="inputCategoryHidden" id="inputCategoryHidden" name="Category" type="text" required>
                        </div>
                        <div class="container-parameter-part">
                            <h6>Subtasks</h6>
                            <div class="container-input-subtask" id="container-input-subtask">
                                <div class="left-input-area">
                                    <input id="input-subtask" class="input-subtask add-logo" name="subtasks" type="text" placeholder="Add new subtask" onfocus="inputSubTaskOnFocus(event, true)" onblur="inputSubTaskOnFocus(event,false)" oninput="inputSubTaskOnInput()">
                                </div>

                                <div class="right-images-area">
                                    <img src="../assets/img/icons/add.svg" id="svg-subtask-add" class="svg-subtask-add">
                                    <img src="../assets/img/task/check.svg" alt="check" id="svg-subtask-check" class="svg-subtask-check dnone" onclick="svgInputSubTaskAdd()">
                                    <div id="separator-subtask" class="separator-input-subtask dnone"></div>
                                    <img src="../assets/img/icons/cancel.svg" alt="cancel" id="svg-subtask-cancel" class="svg-subtask-cancel dnone" onclick="svgInputSubTaskCancel()">
                                </div>

                            </div>

                            <div class="container-input-subtask-list" id="container-input-subtask-list">
                                <!-- filled dynamically from task data, different edit modes possible -->
                            </div>

                        </div>
                    </div>
                </section>
                <!-- Unterer Teil der Task Daten -->
                <div class="container-parameter-bottom">
                    <h6><span style="color: var(--error-color);">*</span>This field is required</h6>
                    <div class="task-btns">
                        <button class="create-btn fbold bfill" type="submit">
                            OK
                            <!-- <img src="assets/img/task/check.svg" alt="check"> -->
                            <svg width="38" height="30" viewBox="0 0 38 30" fill="none" stroke="white">
                                <path d="M4.02832 15.0001L15.2571 26.0662L33.9717 3.93408" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>                        
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `;
    return EditTaskHTMLCode;
}


/**
 * Creates the complete html code tro be visualized in popup to preview a task
 * its called from board page if the user clicks on a given task
 * @param {*} allContactsAndUsers contact list, and optional users to create the assigned user circles inside
 * @returns html code of the complete page
 */
function createPreviewTaskHTMLCode(allContactsAndUsers) {

    let previewTaskHTMLCode = '<div id="previewTask" class="previewTask">';
    /* create category */    
    if (theNewTask.category == "user story"){
        previewTaskHTMLCode += /* html */ `<div class='previewTaskElementCategory' style="background-color: var(--userstory-color)">
                                    <h5>User Story</h5>
                                </div>`;
    }else{
        previewTaskHTMLCode += /* html */ `<div class='previewTaskElementCategory' style="background-color: var(--technicaltask-color)">
                                    <h5>Technical Task</h5>
                                </div>`;
    }
    /* create title */
    previewTaskHTMLCode +=  `<h1 style="overflow-wrap: break-word;">${theNewTask.title}</h1>`;
    /* create description */
    previewTaskHTMLCode +=  `<h5>${theNewTask.description}</h5>`;
    /* due date */
    previewTaskHTMLCode +=  `<h5>Due date: ${theNewTask.duedate}</h5>`;
    /* priority */
    switch (theNewTask.prio) {
        case "low":
            previewTaskHTMLCode += /* html */  `<h5>Priority: Low
                                                    <img src="assets/img/task/prio_low.svg">
                                                </h5>`;
            break;
        case "medium":
            previewTaskHTMLCode += /* html */  `<h5>Priority: Medium
                                                    <img src="assets/img/task/prio_medium.svg">
                                                </h5>`;
            break;
        case "urgent":
            previewTaskHTMLCode += /* html */  `<h5>Priority: Urgent
                                                    <img src="assets/img/task/prio_urgent.svg">
                                                </h5>`;
            break;
    }
    /* assign to */
    previewTaskHTMLCode +=  `<h5>Assigned to:</h5>`;
    previewTaskHTMLCode +=  `<div class="container-PreviewTaskAssignedTo">`;
    if (theNewTask.assignedto && theNewTask.assignedto.length > 0) {
        theNewTask.assignedto.forEach(GUID => {
            let userContactElement = taskPreview_AssignedUserEntry(GUID, allContactsAndUsers);
            if (userContactElement) {previewTaskHTMLCode += userContactElement;}
        });
    }
    previewTaskHTMLCode +=  `</div>`;
    /* subtasks */
    previewTaskHTMLCode +=  `<h5>Subtasks</h5>`;
    previewTaskHTMLCode +=  `<div class="container-PreviewSubTasks">`;
    if (theNewTask.subtasks && theNewTask.subtasks.length > 0) {
        for (let index = 0; index < theNewTask.subtasks.length; index++) {
            let subTaskElement = taskPreview_SubTaskEntry(theNewTask.subtasks[index],index);
            if (subTaskElement) {previewTaskHTMLCode += subTaskElement;}
        }
    }
    previewTaskHTMLCode +=  `</div>`;
    /* Delete Edit */
    previewTaskHTMLCode += /* html */`<div class='previewTaskDeleteEditButtons'>
                                <div class="previewTaskEditDeleteButton" onclick="deleteTask()">
                                    <img src="assets/img/icons/delete.svg">
                                    <h6>Delete</h6>
                                </div>
                                <div class="spacerDeleteEdit"></div>
                                <div class="previewTaskEditDeleteButton" onclick="openEditTaskPopup()">
                                    <img src="assets/img/icons/edit.svg">
                                    <h6>Edit</h6>
                                </div>
                            </div>`;

    previewTaskHTMLCode += `</div>`;

    return previewTaskHTMLCode;
}


/**
 * function created the user info circle of the specific user to be visualized in task preview page
 * @param {*} GUID of the specific user the user info circle will be created from
 * @param {*} allContactsAndUsers list of all contacts and users to get the specific user data from
 * @returns html code for the user circle or null if user is not found
 */
function taskPreview_AssignedUserEntry(GUID, allContactsAndUsers) {
    let usercontact = allContactsAndUsers ? Object.values(allContactsAndUsers).find(u => u.guid === GUID) : null;
    if (usercontact) {
        let Initials = calculateInitials(usercontact);
        let usercontactColor = usercontact.color;
        return `
            <div class="container-previewTaskAssignedUser">
                <div class="taskUserCircle" style="background-color: ${usercontactColor}">
                    <h6>${Initials}</h6>
                </div>
                <h5>${usercontact.firstname} ${usercontact.lastname}</h5>
            </div>`;
    }
    return null;
}


/**
 * creates the html code of the sub task entry that will be shown in task preview page by given :
 * @param {*} subTask sub task the html code is created from (title and state ..)
 * @param {*} index index of the sub task in subtask list inside the task
 * @returns html element for the given sub task
 */
function taskPreview_SubTaskEntry(subTask,index) {
    let htmlElement = "";
    htmlElement += `<div class="container-previewSubTaskEntry">`;
    if (subTask.done == 'true') {
        htmlElement += `<input type="checkbox" id="scales" checked="checked" onchange="changeSubTaskState(${index})"`;
    }else{
        htmlElement += `<input type="checkbox" id="scales" onchange="changeSubTaskState(${index})"`;
    }
    htmlElement += `<h6>${subTask.title}</h6>`;
    htmlElement += `</div>`;
    return htmlElement;
}


/**
 * toggles the subtask state if the user clicks the checkbox in front of the sub task entry in prevciew page
 * @param {*} index of the clicked sub task entry
 */
async function changeSubTaskState(index) {
    if (theNewTask.subtasks[index].done == 'true') {
        theNewTask.subtasks[index].done = 'false';
    }else{
        theNewTask.subtasks[index].done = 'true';
    }
    await db_ChangeTask(theNewTask);
}


/**
 * helper function to close the drop down selectors if the user clicks anywhere outside of the drop down boxes
 */
function setupClickOutside() {
    window.addEventListener("click", (event) => {
        closeDropDownSelectorAssignTo();
        closeDropDownSelectorCategory();
    });
}
