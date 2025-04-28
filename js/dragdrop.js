/* boolean flag to check if really a drop has been done to render the board at the end or not */
let dragDropDone = false;

/* boolean flag for internal use to set opacity of the drop item because of a timing lag between drop and dragend
   working medium nice... */
let lastAllowDropResult = false;


/**
 * Handles the drop event, find out the task ID and the task to change the task
 * destination state, set it and stores the task list back to database
 * @param {*} ev given event, used to determine the destination element
 */
async function drop(ev) {
    ev.preventDefault();
    /* data is the task guid */
    let taskGUID = ev.dataTransfer.getData("text");
    let targetID = ev.currentTarget.id;
    if (ev.currentTarget.parentElement) {
        targetID += ev.currentTarget.parentElement.id;
    }
    let tasks = await db_LoadTasks();
    for (let index = 0; index < tasks.length; index++) {
        if (tasks[index].guid == taskGUID) {
            tasks[index].state = calcTargetState(targetID);
            break;
        }
    }
    await db_SaveTasks(tasks);
    renderBoard();
    showInfoPopup('Task moved');
    dragDropDone = true;
}


/**
 * Function calculates the destination state to set by checking the
 * ID of the target item the user dropped the task over
 * @param {*} targetID of the element the user dropped the task element on
 * @returns the new task state
 */
function calcTargetState(targetID) {
    if (targetID.includes('todo')) {return("ToDo");}
    if (targetID.includes('inprogress')) {return("InProgress");}
    if (targetID.includes('awaitfeedback')) {return("AwaitFeedback");}
    if (targetID.includes('done')) {return("Done");}
    return ("ToDo");
}


/**
 * default dragover function, if user drag the element over other items, this function
 * checks if its a valid drop area or not by checking the target ID of the element the user drag over
 * @param {*} ev default event to find the target element
 * @returns 
 */
function dragover(ev) {
    let targetID = ev.target.id;
    if (ev.target.parentElement) {
        targetID += ev.target.parentElement.id;
    }
    lastAllowDropResult = true;
    if (targetID.includes('task-')) {ev.preventDefault(); return;}
    if (targetID.includes('todo')) {ev.preventDefault(); return;}
    if (targetID.includes('inprogress')) {ev.preventDefault(); return;}
    if (targetID.includes('awaitfeedback')) {ev.preventDefault(); return;}
    if (targetID.includes('done')) {ev.preventDefault(); return;}
    lastAllowDropResult = false;
}


/**
 * Function called when the drag&drop cycle starts. Used to manually create an image
 * of the tile, the user want to drag. Here we do not use the default ghost image of the
 * drag&drop mechanism, instead we use our own image copy of the element. this is created from the task element,
 * then we put some id and css flags on it to let it stick to mouse position in drag() function
 * and add the element to the documents body to have it visible. 
 * The original ghostImage is set to the new image but is placed out of the windows view and set transparent
 * The dragDropDone flag is reset to false for later logics
 * dataTransfer information is set to the task element target id
 * by doing it this way, we have the tile fully visible and not as a typic ghost look one
 *  * @param {*} ev 
 */
function dragstart(ev) {
    dragDropDone = false;
    ev.dataTransfer.setData("text", ev.target.id.replace('task-',''));
    let hideDragImage = ev.target.cloneNode(true);
    hideDragImage.id = "hideDragImage-hide";
    let clone = ev.target.cloneNode(true);
    clone.id = "draggeimage";
    clone.style.position = 'absolute';
    hideDragImage.style.opacity = 0;
    document.body.appendChild(hideDragImage);
    document.body.appendChild(clone);
    ev.dataTransfer.setDragImage(hideDragImage,-1000,0);
    document.getElementById('draggeimage').style.width = (ev.target.clientWidth - 30)  + "px";
    ev.target.style.opacity = 0;
}


/**
 * default drag function, called while dragging. Used to display the
 * ghost image manually at the actual mouse position
 * @param {*} ev default event used to grab mouse position
 */
function drag(ev) {
    dragImage = document.getElementById('draggeimage');
    if(dragImage) {
        dragImage.style.left = (ev.pageX +5) + "px";
        dragImage.style.top = (ev.pageY +5) + "px";
    }
}


/**
 * default dragend function, is called when the drag&drop cycle is done,
 * this is used to clear the hidden DragImage and cleans up the floor
 * @param {*} ev default event used to change the target opacity back
 */
function dragend(ev) {
    let dragImage = document.getElementById('draggeimage');
    dragImage.remove();
    let hideDragImage = document.getElementById('hideDragImage-hide');
    hideDragImage.remove();
    if (!lastAllowDropResult) {
       ev.target.style.opacity = 1;
    }
    if (!dragDropDone) {
        renderBoard();
    }
    dragDropDone = false;
}
