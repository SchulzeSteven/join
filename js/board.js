let maxUsers = 3;
let maxWords = 6;


//#region Board rendering
/**
 * Renders the task board based on filtered tasks and loaded contacts/users.
 * Retrieves the task filter text, loads filtered tasks from the database,
 * loads all contacts and users, combines them if necessary, and renders each
 * column of the task board.
 * 
 * @returns {void}
 */
async function renderBoard() {
    let taskFilterText = document.getElementById('input-find-task').value;
    let tasksFiltered = await db_LoadTasksFiltered(taskFilterText);
    let allContactsAndUsers = await db_LoadUsers();
    if (!allContactsAndUsers) {allContactsAndUsers = [];}
    let allContacts = await db_LoadContacts();
    if (allContacts) {allContactsAndUsers = allContactsAndUsers.concat(allContacts);}

    renderColumn_ToDo(tasksFiltered,allContactsAndUsers);
    renderColumn_InProgress(tasksFiltered,allContactsAndUsers);
    renderColumn_AwaitFeedback(tasksFiltered,allContactsAndUsers);
    renderColumn_Done(tasksFiltered,allContactsAndUsers);
}


/**
 * Renders the "To Do" column in the task board based on filtered tasks and loaded contacts/users.
 * Clears the existing content in the "To Do" column container, iterates through filtered tasks,
 * creates HTML elements for each task, and appends them to the "To Do" column container. If no tasks
 * are found, displays a message indicating there are no tasks to do.
 * 
 * @param {Array} tasksFiltered - The array of tasks filtered based on user input or other criteria.
 * @param {Array} allContactsAndUsers - The array containing all contacts and users retrieved from the database.
 * @returns {void}
 */
function renderColumn_ToDo(tasksFiltered,allContactsAndUsers) {
    document.getElementById("container-column-todo").innerHTML = "";
    let empty = true;
    tasksFiltered.forEach(task => {
        if (task.state == "ToDo") {
            let taskFieldHTML = createTaskField(task,allContactsAndUsers,'container-column-todo');
            document.getElementById("container-column-todo").innerHTML += taskFieldHTML;
            empty = false;
        }
    });
    if (empty) {document.getElementById("container-column-todo").innerHTML = createEmptyTaskField("No tasks to do")}
}


/**
 * Renders the "In Progress" column in the task board based on filtered tasks and loaded contacts/users.
 * Clears the existing content in the "In Progress" column container, iterates through filtered tasks,
 * creates HTML elements for each task in progress, and appends them to the "In Progress" column container. 
 * If no tasks are found in progress, displays a message indicating there are no tasks currently in progress.
 * 
 * @param {Array} tasksFiltered - The array of tasks filtered based on user input or other criteria.
 * @param {Array} allContactsAndUsers - The array containing all contacts and users retrieved from the database.
 * @returns {void}
 */
function renderColumn_InProgress(tasksFiltered,allContactsAndUsers) {
    document.getElementById("container-column-inprogress").innerHTML = "";
    let empty = true;
    tasksFiltered.forEach(task => {
        if (task.state == "InProgress") {
            let taskFieldHTML = createTaskField(task,allContactsAndUsers,'container-column-inprogress');
            document.getElementById("container-column-inprogress").innerHTML += taskFieldHTML;
            empty = false;
        }
    });
    if (empty) {document.getElementById("container-column-inprogress").innerHTML = createEmptyTaskField("No tasks in progress")}
}


/**
 * Renders the "Awaiting Feedback" column in the task board based on filtered tasks and loaded contacts/users.
 * Clears the existing content in the "Awaiting Feedback" column container, iterates through filtered tasks,
 * creates HTML elements for each task awaiting feedback, and appends them to the "Awaiting Feedback" column container. 
 * If no tasks are found awaiting feedback, displays a message indicating there are no tasks currently awaiting feedback.
 * 
 * @param {Array} tasksFiltered - The array of tasks filtered based on user input or other criteria.
 * @param {Array} allContactsAndUsers - The array containing all contacts and users retrieved from the database.
 * @returns {void}
 */
function renderColumn_AwaitFeedback(tasksFiltered,allContactsAndUsers) {
    document.getElementById("container-column-awaitfeedback").innerHTML = "";
    let empty = true;
    tasksFiltered.forEach(task => {
        if (task.state == "AwaitFeedback") {
            let taskFieldHTML = createTaskField(task,allContactsAndUsers,'container-column-awaitfeedback');
            document.getElementById("container-column-awaitfeedback").innerHTML += taskFieldHTML;
            empty = false;
        }
    });
    if (empty) {document.getElementById("container-column-awaitfeedback").innerHTML = createEmptyTaskField("No tasks awaiting feedback")}
}


/**
 * Renders the "Done" column in the task board based on filtered tasks and loaded contacts/users.
 * Clears the existing content in the "Done" column container, iterates through filtered tasks,
 * creates HTML elements for each task that is done, and appends them to the "Done" column container. 
 * If no tasks are found that are done, displays a message indicating there are no tasks currently marked as done.
 * 
 * @param {Array} tasksFiltered - The array of tasks filtered based on user input or other criteria.
 * @param {Array} allContactsAndUsers - The array containing all contacts and users retrieved from the database.
 * @returns {void}
 */
function renderColumn_Done(tasksFiltered,allContactsAndUsers) {
    document.getElementById("container-column-done").innerHTML = "";
    let empty = true;
    tasksFiltered.forEach(task => {
        if (task.state == "Done") {
            let taskFieldHTML = createTaskField(task,allContactsAndUsers,'container-column-done');
            document.getElementById("container-column-done").innerHTML += taskFieldHTML;
            empty = false;
        }
    });
    if (empty) {document.getElementById("container-column-done").innerHTML = createEmptyTaskField("No tasks done")}
}


/**
 * Creates HTML markup for displaying a task element based on the provided task object and contacts/users data.
 * Constructs a task element with draggable attributes and event handlers for drag-and-drop functionality,
 * and click event for task details. Includes task theme category, title, description, subtask progress,
 * assigned users and priority information within the task element.
 * 
 * @param {Object} task - The task object containing task details such as GUID, title, description, subtasks, assigned users, and priority.
 * @param {Array} allContactsAndUsers - The array containing all contacts and users retrieved from the database.
 * @returns {string} HTML markup representing the task element.
 */
function createTaskField(task,allContactsAndUsers,parentElementID) {
    let taskField = /*HTML*/`<div id='task-${task.guid}' class='taskElement' draggable='true' ondrag='drag(event)' ondragend='dragend(event)' ondragstart='dragstart(event)' onclick='taskClicked("${task.guid}")'>`;
    taskField += taskField_HtmlMoveToPrevCategory(task);
    taskField += '<div class="taskElementInner">';
    taskField += taskField_CreateThemeCategoryString(task);
    taskField += taskField_CreateTitleString(task);
    taskField += taskField_DescriptionString(task);
    taskField += taskField_SubTaskProgressString(task);
    taskField += taskField_AssignedUsersAndPrioString(task,allContactsAndUsers);
    taskField += '</div>';
    taskField += taskField_HtmlMoveToNextCategory(task);
    taskField += `
        </div>
    `;
    return taskField;
}

/**
 * Generates HTML for moving a task to the previous category, if the task is not in 'ToDo' state.
 * 
 * @param {Object} task - The task object.
 * @param {string} task.guid - The unique identifier of the task.
 * @param {string} task.state - The current state of the task.
 * @returns {string} The HTML string for the move button if the task is not in 'ToDo' state, otherwise an empty string.
 */
function taskField_HtmlMoveToPrevCategory(task) {
    if (task.state != 'ToDo') {
        return (`<div id="showMoveToPrevCategory" class="moveToCategory moveToPrevCategory" onclick="moveToPrevCategory(event,'${task.guid}')">^</div>`);
    }
    return '';
}

/**
 * Generates HTML for moving a task to the next category, if the task is not in 'Done' state.
 * 
 * @param {Object} task - The task object.
 * @param {string} task.guid - The unique identifier of the task.
 * @param {string} task.state - The current state of the task.
 * @returns {string} The HTML string for the move button if the task is not in 'Done' state, otherwise an empty string.
 */
function taskField_HtmlMoveToNextCategory(task) {
    if (task.state != 'Done') {
        return (`<div id="showMoveToNextCategory" class="moveToCategory moveToNextCategory" onclick="moveToNextCategory(event,'${task.guid}')">^</div>`);
    }
    return '';
}

/**
 * Moves a task to the previous category based on its current state.
 * 
 * @param {Event} event - The event object triggered by the user interaction.
 * @param {string} taskGUID - The unique identifier of the task.
 * @returns {Promise<void>} A promise that resolves when the task state has been updated and the board has been re-rendered.
 */
async function moveToPrevCategory(event,taskGUID) {
    event.stopPropagation();
    theNewTask = await db_GetTaskByGUID(taskGUID);
    if (theNewTask) {
        switch (theNewTask.state) {
            case 'InProgress':
                theNewTask.state = 'ToDo';
                break;
            case 'AwaitFeedback':
                theNewTask.state = 'InProgress';
                break;
            case 'Done':
                theNewTask.state = 'AwaitFeedback';
                break;
        }
    }
    await db_ChangeTask(theNewTask);
    await renderBoard();
    showInfoPopup('Task moved');
}

/**
 * Moves a task to the next category based on its current state.
 * 
 * @param {Event} event - The event object triggered by the user interaction.
 * @param {string} taskGUID - The unique identifier of the task.
 * @returns {Promise<void>} A promise that resolves when the task state has been updated and the board has been re-rendered.
 */
async function moveToNextCategory(event,taskGUID) {
    event.stopPropagation();
    theNewTask = await db_GetTaskByGUID(taskGUID);
    if (theNewTask) {
        switch (theNewTask.state) {
            case 'ToDo':
                theNewTask.state = 'InProgress';
                break;
            case 'InProgress':
                theNewTask.state = 'AwaitFeedback';
                break;
            case 'AwaitFeedback':
                theNewTask.state = 'Done';
                break;
        }
    }
    await db_ChangeTask(theNewTask);
    await renderBoard();
    showInfoPopup('Task moved');
}


/**
 * Creates HTML markup for an empty task field with specified text.
 * Constructs a div element with a class 'taskElementEmpty' containing the provided text.
 * 
 * @param {string} textInField - The text to display inside the empty task field.
 * @returns {string} HTML markup representing the empty task field.
 */
function createEmptyTaskField(textInField) {
    return(`<div class='taskElementEmpty'>${textInField}</div>`);
}


/**
 * Creates HTML markup for displaying the theme category of a task based on the task's category attribute.
 * Constructs an h6 element with class 'taskElementCategory' and applies background color based on the task's category.
 * 
 * @param {Object} task - The task object containing details such as category.
 * @returns {string} HTML markup representing the theme category of the task.
 */
function taskField_CreateThemeCategoryString(task) {
    if (task.category == "user story"){
        return `<h6 class='taskElementCategory' style="background-color: var(--userstory-color)">User Story</h6>`;
    }else{
        return `<h6 class='taskElementCategory' style="background-color: var(--technicaltask-color)">Technical Task</h6>`;
    }
}


/**
 * Creates HTML markup for displaying the title of a task.
 * Constructs an h6 element with class 'taskElementTitle' containing the task's title.
 * 
 * @param {Object} task - The task object containing details such as title.
 * @returns {string} HTML markup representing the title of the task.
 */
function taskField_CreateTitleString(task) {
    return `<h6 class='taskElementTitle'>${task.title}</h6>`;
}


/**
 * Generates HTML markup for displaying a truncated description of a task.
 * If the description exceeds 6 words, it appends '...' at the end.
 *
 * @param {Object} task - The task object containing a 'description' property.
 * @returns {string} - HTML markup with truncated description wrapped in an <h6> element.
 */
function taskField_DescriptionString(task) {
    let words = task.description.split(' ');
    let shortDescription = words.slice(0, maxWords).join(' ');
    if (words.length > maxWords) {
        shortDescription += ' ...';
    }
    return `<h6 class='taskElementDescription'>${shortDescription}</h6>`;
}


/**
 * 
 * @param {*} task task to use to get subtask info from
 * @returns a html5 element as progress bar or empty if no sub task exists
 */
function taskField_SubTaskProgressString(task) {
    let numSubTasks = taskNumberOfSubTasks(task);
    if (numSubTasks == 0) {return(``)}
    let numDone = taskNumberOfSubTasks_Done(task);
    let widthPercent = 100 / numSubTasks * numDone;
    let element = `
        <div class='taskElementSubTasks'>
            <div class='taskElementProgressBar'>
                <div id='taskElementProgressBar-Progress' class='taskElementProgressBar-Progress' style='width: ${widthPercent}%' ></div>
            </div>
            <h7 class='taskElementProgressText'>${numDone}/${numSubTasks} Subtasks</h7>
        </div>
    `;
    return element;
}


/**
 * Generates HTML markup for displaying assigned users and priority of a task.
 * It includes a container div with flex layout for alignment purposes.
 *
 * @param {Object} task - The task object containing 'assignedto' and 'priority' properties.
 * @param {Object[]} allContactsAndUsers - An array of all contacts and users.
 * @returns {string} - HTML markup representing assigned users and priority wrapped in a container div.
 */
function taskField_AssignedUsersAndPrioString(task,allContactsAndUsers) {
    let element = `<div class='taskElementAssignedAndPrio'>`;
    /* div drum herum immer wegen einfacher flex Ausrichtung */
    element += '<div class="AssignedUsers">';
    if (task.assignedto && task.assignedto.length > 0) {element += taskField_AssignedUsers(task,allContactsAndUsers);}
    element += '</div>';

    element += taskField_AssignedPrio(task);
    element += `</div>`;
    return element;
}


/**
 * Generates HTML markup for displaying assigned users of a task.
 * Limits the display to a maximum number of users (`maxUsers`).
 * If there are more assigned users than `maxUsers`, adds an ellipsis hint.
 *
 * @param {Object} task - The task object containing 'assignedto' property as an array of GUIDs.
 * @param {Object[]} allContactsAndUsers - An array of all contacts and users.
 * @returns {string} - HTML markup representing assigned users with user circles and an ellipsis hint if applicable.
 */
function taskField_AssignedUsers(task, allContactsAndUsers) {
    let element = '';
    let count = 0;
    task.assignedto.every(GUID => {
        let userContactElement = taskField_AssignedUserCircle(GUID, allContactsAndUsers);
        if (userContactElement) {
            element += userContactElement;
            count++;
            if(count > maxUsers) {
                return false;
            }
        }
        return true;
    });
    if (count >= maxUsers) {
        element += `<div class="taskUserCircle" style="background-color: var(--disabled-color);"><h6>...</h6></div>`;
    }
    return element;
}


/**
 * Generates HTML markup for displaying a user circle based on GUID.
 * Uses data from `allContactsAndUsers` to find the user with matching GUID.
 *
 * @param {string} GUID - The GUID of the user to display.
 * @param {Object} allContactsAndUsers - An object containing all contacts and users.
 * @returns {string|null} - HTML markup representing the user circle, or null if user not found.
 */
function taskField_AssignedUserCircle(GUID, allContactsAndUsers) {
    let usercontact = allContactsAndUsers ? Object.values(allContactsAndUsers).find(u => u.guid === GUID) : null;
    if (usercontact) {
        let Initials = calculateInitials(usercontact);
        let usercontactColor = usercontact.color;
        return `
            <div class="taskUserCircle" style="background-color: ${usercontactColor}">
                <h6>${Initials}</h6>
            </div>`;
    }
    return null;
}


/**
 * Generates HTML markup for displaying the priority of a task.
 * Depending on the task's priority (`task.prio`), inserts an SVG icon representing the priority level.
 *
 * @param {Object} task - The task object containing priority information.
 * @returns {string} - HTML string representing the priority icon.
 */
function taskField_AssignedPrio(task) {
    let element = '<div class="AssignedPrio">';
    switch (task.prio) {
        case "low":
            element += `<svg width="21" height="16" viewBox="0 0 21 16" fill="#7AE229" xmlns="low.svg">
            <path d="M10.2485 9.50589C10.0139 9.5063 9.7854 9.43145 9.59655 9.29238L0.693448 2.72264C0.57761 2.63708 0.47977 2.52957 0.405515 2.40623C0.33126 2.28289 0.282043 2.14614 0.260675 2.00379C0.217521 1.71631 0.290421 1.42347 0.463337 1.1897C0.636253 0.955928 0.895022 0.800371 1.18272 0.757248C1.47041 0.714126 1.76347 0.786972 1.99741 0.95976L10.2485 7.04224L18.4997 0.95976C18.6155 0.874204 18.7471 0.812285 18.8869 0.777538C19.0266 0.742791 19.1719 0.735896 19.3144 0.757248C19.4568 0.7786 19.5937 0.82778 19.7171 0.901981C19.8405 0.976181 19.9481 1.07395 20.0337 1.1897C20.1194 1.30545 20.1813 1.43692 20.2161 1.57661C20.2509 1.71629 20.2578 1.86145 20.2364 2.00379C20.215 2.14614 20.1658 2.28289 20.0916 2.40623C20.0173 2.52957 19.9195 2.63708 19.8036 2.72264L10.9005 9.29238C10.7117 9.43145 10.4831 9.5063 10.2485 9.50589Z"/>
            <path d="M10.2485 15.2544C10.0139 15.2548 9.7854 15.18 9.59655 15.0409L0.693448 8.47117C0.459502 8.29839 0.30383 8.03981 0.260675 7.75233C0.217521 7.46485 0.290421 7.17201 0.463337 6.93824C0.636253 6.70446 0.895021 6.54891 1.18272 6.50578C1.47041 6.46266 1.76347 6.53551 1.99741 6.7083L10.2485 12.7908L18.4997 6.7083C18.7336 6.53551 19.0267 6.46266 19.3144 6.50578C19.602 6.54891 19.8608 6.70446 20.0337 6.93824C20.2066 7.17201 20.2795 7.46485 20.2364 7.75233C20.1932 8.03981 20.0376 8.29839 19.8036 8.47117L10.9005 15.0409C10.7117 15.18 10.4831 15.2548 10.2485 15.2544Z" fill="#7AE229"/>
            </svg>`;
            break;
        case "medium":
            element += `<svg width="21" height="8" viewBox="0 0 21 8" fill="#FFA800" xmlns="medium.svg">
            <path d="M19.1526 7.72528H1.34443C1.05378 7.72528 0.775033 7.60898 0.569514 7.40197C0.363995 7.19495 0.248535 6.91419 0.248535 6.62143C0.248535 6.32867 0.363995 6.0479 0.569514 5.84089C0.775033 5.63388 1.05378 5.51758 1.34443 5.51758H19.1526C19.4433 5.51758 19.722 5.63388 19.9276 5.84089C20.1331 6.0479 20.2485 6.32867 20.2485 6.62143C20.2485 6.91419 20.1331 7.19495 19.9276 7.40197C19.722 7.60898 19.4433 7.72528 19.1526 7.72528Z"/>
            <path d="M19.1526 2.48211H1.34443C1.05378 2.48211 0.775033 2.36581 0.569514 2.1588C0.363995 1.95179 0.248535 1.67102 0.248535 1.37826C0.248535 1.0855 0.363995 0.804736 0.569514 0.597724C0.775033 0.390712 1.05378 0.274414 1.34443 0.274414L19.1526 0.274414C19.4433 0.274414 19.722 0.390712 19.9276 0.597724C20.1331 0.804736 20.2485 1.0855 20.2485 1.37826C20.2485 1.67102 20.1331 1.95179 19.9276 2.1588C19.722 2.36581 19.4433 2.48211 19.1526 2.48211Z"/>
            </svg>`;
            break;
        case "urgent":
            element += `<svg width="21" height="16" viewBox="0 0 21 16" fill="#FF3D00" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_178814_1741)">
            <path d="M19.6528 15.2547C19.4182 15.2551 19.1896 15.1803 19.0007 15.0412L10.7487 8.958L2.49663 15.0412C2.38078 15.1267 2.24919 15.1887 2.10939 15.2234C1.96959 15.2582 1.82431 15.2651 1.68184 15.2437C1.53937 15.2223 1.40251 15.1732 1.27906 15.099C1.15562 15.0247 1.04801 14.927 0.96238 14.8112C0.876751 14.6954 0.814779 14.5639 0.780002 14.4243C0.745226 14.2846 0.738325 14.1394 0.759696 13.997C0.802855 13.7095 0.958545 13.4509 1.19252 13.2781L10.0966 6.70761C10.2853 6.56802 10.5139 6.49268 10.7487 6.49268C10.9835 6.49268 11.212 6.56802 11.4007 6.70761L20.3048 13.2781C20.4908 13.415 20.6286 13.6071 20.6988 13.827C20.7689 14.0469 20.7678 14.2833 20.6955 14.5025C20.6232 14.7216 20.4834 14.9124 20.2962 15.0475C20.1089 15.1826 19.8837 15.2551 19.6528 15.2547Z"/>
            <path d="M19.6528 9.50568C19.4182 9.50609 19.1896 9.43124 19.0007 9.29214L10.7487 3.20898L2.49663 9.29214C2.26266 9.46495 1.96957 9.5378 1.68184 9.49468C1.39412 9.45155 1.13532 9.29597 0.962385 9.06218C0.789449 8.82838 0.716541 8.53551 0.7597 8.24799C0.802859 7.96048 0.95855 7.70187 1.19252 7.52906L10.0966 0.958588C10.2853 0.818997 10.5139 0.743652 10.7487 0.743652C10.9835 0.743652 11.212 0.818997 11.4007 0.958588L20.3048 7.52906C20.4908 7.66598 20.6286 7.85809 20.6988 8.07797C20.769 8.29785 20.7678 8.53426 20.6955 8.75344C20.6232 8.97262 20.4834 9.16338 20.2962 9.29847C20.1089 9.43356 19.8837 9.50608 19.6528 9.50568Z"/>
            </g>
            <defs>
            <clipPath id="clip0_178814_1741">
            <rect width="20" height="14.5098" transform="translate(0.748535 0.745117)"/>
            </clipPath>
            </defs>
            </svg>`;
            break;
    }
    element += '</div>';
    return element;
}
//#endregion


/**
 * Calculates the number of subtasks in a given task object.
 * Checks if the task object has a 'subtasks' property and returns its length.
 * Returns 0 if the task object does not have 'subtasks' or if 'subtasks' is empty.
 *
 * @param {Object} task - The task object containing subtasks.
 * @returns {number} - The number of subtasks in the task object.
 */
function taskNumberOfSubTasks(task) {
    if (task.subtasks) {
        return task.subtasks.length;
    }else{
        return 0;
    }
}


/**
 * Calculates the number of completed subtasks in a given task object.
 * Checks if the task object has a 'subtasks' property and counts subtasks with 'done' status as true.
 * Returns 0 if the task object does not have 'subtasks' or if 'subtasks' is empty.
 *
 * @param {Object} task - The task object containing subtasks.
 * @returns {number} - The number of completed subtasks in the task object.
 */
function taskNumberOfSubTasks_Done(task) {
    if (task.subtasks) {
        let numDone = 0;            
        task.subtasks.forEach(subtask => {
            if (subtask.done == 'true') {
                numDone++;
            }
        });
        return numDone;
    }else{
        return 0;
    }
}


/**
 * handles the task clicked things, get the task by given GUID from database and opens trhe preview popup
 * @param {*} taskGUID guid of the task to be showed in preview page
 */
async function taskClicked(taskGUID) {
    theNewTask = await db_GetTaskByGUID(taskGUID);
    if (theNewTask) {
        /* openEditTaskPopup(); */
        openPreviewTaskPopup();
    }
}


/**
 * function called to delete a task, it stores the actual task in database and navigates back to board
 */
async function deleteTask() {
    if (theNewTask) {
        await db_DeleteTask(theNewTask);
        navigateToBoard();
    }
}


//#region AddTask EditTask as Popup
/**
 * Opens a new task popup on the website with optional preset state.
 * Fetches HTML content from './assets/templates/addTaskTemplate.html' and inserts it into the website dialog.
 * Calls timeDelay("addTaskTemplate") and prepareFields() functions after inserting the template.
 * Sets the initial state of the new task based on the provided state preset.
 * Removes the "dnone" class from the overlay element to display the popup.
 *
 * @param {string} [statePreset="ToDo"] - Optional. The initial state preset for the new task.
 * @returns {Promise<void>} - A Promise that resolves once the popup is opened and prepared.
 */
async function openNewTaskPopup(statePreset = "ToDo") {
    let dialog = document.getElementById("website");
    dialog.innerHTML += createAddTaskHTMLCode();
    timeDelay("addTaskTemplate");
    prepareFields();                            /* muss hier auch aufgerufen werden */
    theNewTask.state = statePreset;             /* Status voreinstellen wenn man über die kleinen + Zeichen kommt */
    setPrio("medium");
    document.getElementById('overlay').classList.remove("dnone");
  }


/**
 * Opens a edit task popup on the website with optional preset state.
 * Calls timeDelay("addTaskTemplate") and prepareFields() functions after inserting the template.
 * Removes the "dnone" class from the overlay element to display the popup.
 *
 * @returns {Promise<void>} - A Promise that resolves once the popup is opened and prepared.
 */
async function openEditTaskPopup() {
    closePopUp();
    let dialog = document.getElementById("website");
    dialog.innerHTML += createEditTaskHTMLCode();
    timeDelay("addTaskTemplate");
    prepareFields();                            /* muss hier auch aufgerufen werden */
    fillFields();                               /* füllen mit vorhandenen Werten */
    document.getElementById('overlay').classList.remove("dnone");
}
  

/**
 * Opens a preview task popup on the website with optional preset state.
 * Calls timeDelay("addTaskTemplate") and prepareFields() functions after inserting the template.
 * Removes the "dnone" class from the overlay element to display the popup.
 *
 * @returns {Promise<void>} - A Promise that resolves once the popup is opened and prepared.
 */
async function openPreviewTaskPopup() {
    let dialog = document.getElementById("website");
    /* erst mal die User raus lassen */
    let allContactsAndUsers = [];   /* await db_LoadUsers(); */
    if (!allContactsAndUsers) {allContactsAndUsers = [];}
    let allContacts = await db_LoadContacts();
    if (allContacts) {allContactsAndUsers = allContactsAndUsers.concat(allContacts);}
    dialog.innerHTML += createPreviewTaskHTMLCode(allContactsAndUsers);
    timeDelay("previewTask");
    document.getElementById('overlay').classList.remove("dnone");
}


/**
* Adds a slide-in animation to the element with the specified ID after a delay.
*
* @function timeDelay
* @param {string} id - The ID of the element to add the animation to.
*/
function timeDelay(id) {
    setTimeout(() => {
      document.getElementById(id).classList.add("slide-in");
    }, 10);
}


/**
 * Removes the "add task" popup from the website.
 * Finds the DOM elements by their IDs and removes the child element.
 * Assumes the existence of elements with IDs "website" (parent dialog) and "addTaskTemplate" (child to remove).
 */
function removeTaskPopup() {
    let dialog = document.getElementById("website");
    if (document.getElementById("addTaskTemplate")) {
        dialog.removeChild(document.getElementById("addTaskTemplate"));  
    }
    if (document.getElementById("previewTask")) {
        dialog.removeChild(document.getElementById("previewTask"));  
    }
}


/**
 * Closes the popup by removing CSS classes and invoking a function to remove DOM elements.
 * Removes the "slide-in" class from the "addTaskTemplate" element and adds "dnone" class to the "overlay" element.
 * Calls `removeTaskPopup()` function to remove the popup from the DOM.
 */
function closePopUp() {
    if (document.getElementById('addTaskTemplate')) {
        document.getElementById('addTaskTemplate').classList.remove("slide-in");
    }
    if (document.getElementById('previewTask')) {
        document.getElementById('previewTask').classList.remove("slide-in");
    }
    document.getElementById('overlay').classList.add("dnone");
    removeTaskPopup();
    renderBoard();
}
//#endregion
