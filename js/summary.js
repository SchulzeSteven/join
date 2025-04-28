let welcomeMessage;


function fillCurrentData() {
  showWelcomeMessage();
  loadTasksStates();
}


/**
 * Prepares a welcome message based on the current time of day.
 *
 * This function determines the appropriate greeting (e.g., "Good morning," "Good afternoon,")
 * based on the current hour and assigns it to the `welcomeMessage` variable.
 *
 */
function prepareWelcomeMessage() {
  const now = new Date();
  const hours = now.getHours();
  if (hours >= 6 && hours < 12) {
    welcomeMessage = `Good morning,`;
  } else if (hours >= 12 && hours < 18) {
    welcomeMessage = `Good afternoon,`;
  } else if (hours >= 18 && hours < 22) {
    welcomeMessage = `Good evening,`;
  } else {
    welcomeMessage = `Hello,`;
  }
}


/**
 * Displays a personalized welcome message based on the user's status (guest or logged-in user).
 *
 * This function performs the following actions:
 * - Calls `prepareWelcomeMessage` to set the appropriate greeting based on the current time of day.
 * - Checks if the current user is a guest or a logged-in user.
 * - Updates the HTML content of the element with the ID 'summaryWelcomeMessage' with a personalized message:
 *   - If the user is not a guest, it calls `renderHtmlWelcomeMessageUser()` to generate the welcome message for logged-in users.
 *   - If the user is a guest, it calls `renderHtmlWelcomeMessageGuest()` to generate the welcome message for guest users.
 *
 */
function showWelcomeMessage() {
  prepareWelcomeMessage();
  if (!actualUser.isguest) {
    document.getElementById("summaryWelcomeMessage").innerHTML =
      renderHtmlWelcomeMessageUser();
  } else {
    document.getElementById("summaryWelcomeMessage").innerHTML =
      renderHtmlWelcomeMessageGuest();
  }
}


/**
 * Generates HTML for the personalized welcome message for a logged-in user.
 *
 * This function constructs an HTML string that includes:
 * - A greeting message based on the time of day.
 * - The user's first and last name styled with a highlight color and bold font.
 *
 * @returns {string} The HTML string containing the welcome message for the logged-in user.
 *
 */
function renderHtmlWelcomeMessageUser() {
  return `
    <div>
        <div class="size1" style="font-size: 36px;">${welcomeMessage}</div>
        <div class="size2" style="font-size: 48px; color: var(--highlight-color); font-weight: bold;">${actualUser.firstname} ${actualUser.lastname}</div>
    </div>`;
}


/**
 * Generates HTML for the personalized welcome message for a guest user.
 *
 * This function constructs an HTML string that includes:
 * - A greeting message based on the time of day.
 * - The guest user's first name styled with a highlight color and bold font.
 *
 * @returns {string} The HTML string containing the welcome message for the guest user.
 *
 */
function renderHtmlWelcomeMessageGuest() {
  return `
    <div>
        <div style="font-size: 36px;">${welcomeMessage}</div>
        <div style="font-size: 48px; color: var(--highlight-color); font-weight: bold;">${actualUser.firstname}</div>
    </div>`;
}


/**
 * 
 * Calculates the length/amount of tasks with specific states/prios in the JSON array from firebase DB
 */
async function loadTasksStates() {
  let tasks = await db_LoadTasks();
  let amountInProgress = tasks.filter(item => item.state === "InProgress").length;
  let amountInTodo = tasks.filter(item => item.state === "ToDo").length;
  let amountAwaitFeedback = tasks.filter(item => item.state === "AwaitFeedback").length;
  let amountDone = tasks.filter(item => item.state === "Done").length;
  let amountPrioUrgent = tasks.filter(item => item.prio === "urgent").length;
  document.getElementById('summaryTasksAmount').innerHTML=tasks.length;
  document.getElementById('summaryTasksProgress').innerHTML=amountInProgress;
  document.getElementById('summaryTodoAmount').innerHTML=amountInTodo;
  document.getElementById('summaryAwaitFeedback').innerHTML=amountAwaitFeedback;
  document.getElementById('summaryDoneAmount').innerHTML=amountDone;
  document.getElementById('summaryUrgent').innerHTML=amountPrioUrgent;
}