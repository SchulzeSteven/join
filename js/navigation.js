function createHTMLNavigation() {
    let headerDiv = document.getElementById('navigation');
    if (headerDiv) {
        headerDiv.innerHTML += /*HTML*/`
        <div class="navigationLogo" data-svg="logo">
            <div class="img-logo">
                <img src="assets/img/general/logo_white.svg" onclick="navigateToSummary()">
            </div>
        </div>
        <div id="navigationSubMenus" class="navigationSubMenus">
            <div id="nav-item-summary" data-svg="summary" onclick="navigateToSummary()">
                <div><img src="assets/img/general/nav/summary.svg"></div>
                <p>Summary</p>
            </div>
            <div id="nav-item-add-task" data-svg="task" onclick="navigateToAddTask()">
                <div><img src="assets/img/general/nav/edit.svg"></div>
                <p>Add task</p>
            </div>
            <div id="nav-item-board" data-svg="board"  onclick="navigateToBoard()">
                <div><img src="assets/img/general/nav/board.svg"></div>
                <p>Board</p>
            </div>
            <div id="nav-item-contacts" data-svg="contacts" onclick="navigateToContacts()">
                <div><img src="assets/img/general/nav/contacts.svg"></div>
                <p>Contacts</p>
            </div>
        </div>
        <div class="navigationLegal">
            <div id="nav-item-privacy" onclick="navigateToPrivacy()">
                <p>Privacy Policy</p>
            </div>
            <div id="nav-item-imprint" onclick="navigateToImprint()">
                <p>Legal notice</p>
            </div>
        </div>
    `;
    }
}


//////////////////////////////////////////////////////////NAVIGATION TO OTHERS HTML/////////////////////////////////////////////////////////////////////////
/**
 * Navigates the user through the pages.
 */
function navigateToBoard() {
    window.location.href = "board.html";
}


function navigateToPrivacy() {
    window.location.href = "privacy.html";
}


function navigateToPrivacyNewWindow() {
    window.open("privacy.html", '_blank').focus();
}


function navigateToImprint() {
    window.location.href = "imprint.html";
}


function navigateToImprintNewWindow() {
    window.open("imprint.html", '_blank').focus();
}


function navigateToSummary() {
    window.location.href = "summary.html";
}


function navigateToContacts() {
    window.location.href = "contacts.html";
}


function navigateToAddTask() {
    window.location.href = "addtask.html";
}


function navigateToLogIn() {
    window.location.href = "login.html";
}


function navigateToRegister() {
    window.location.href = "register.html";
}


function navigateToIndex() {
    window.location.href = "index.html";
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Applies color styling to the currently selected menu items based on the current URL path.
 * 
 * This function performs the following actions:
 * - Retrieves the current URL path and converts it to lowercase.
 * - Calls `colorizeSelectionLeftMenu` with the current URL path to apply styling to the left menu.
 * - Calls `colorizeSelectionFooterMenu` with the current URL path to apply styling to the footer menu.
 */
function colorizeSelectionMenu() {
    let urlPathname = window.location.pathname.toLowerCase();
    colorizeSelectionLeftMenu(urlPathname);
    colorizeSelectionFooterMenu(urlPathname);
}


/**
 * Applies color styling to the selected item in the left menu based on the current URL path.
 * 
 * This function performs the following actions:
 * - Takes the current URL path as an input.
 * - Uses a switch statement to determine which menu item should be highlighted based on the URL path.
 * - Adds the 'selected' class to the corresponding menu item to apply the styling.
 * 
 * @param {string} urlPathname - The current URL path used to determine the selected menu item.
 * 
 */
function colorizeSelectionLeftMenu(urlPathname) {
    switch (urlPathname) {
        case '/summary.html':
            document.getElementById('nav-item-summary').classList.add('selected');break;
        case '/addtask.html':
            document.getElementById('nav-item-add-task').classList.add('selected');break;
        case '/board.html':
            document.getElementById('nav-item-board').classList.add('selected');break;
        case '/contacts.html':
            document.getElementById('nav-item-contacts').classList.add('selected');break;
        case '/privacy.html':
            document.getElementById('nav-item-privacy').classList.add('selected');break;
        case '/imprint.html':
            document.getElementById('nav-item-imprint').classList.add('selected');break;
        }
}


/**
 * Applies color styling to the selected item in the footer menu based on the current URL path.
 * 
 * This function performs the following actions:
 * - Takes the current URL path as an input.
 * - Uses a switch statement to determine which footer menu item should be highlighted based on the URL path.
 * - Adds the 'selected' class to the corresponding footer menu item to apply the styling.
 *
 * @param {string} urlPathname - The current URL path used to determine the selected footer menu item.
 * 
 */
function colorizeSelectionFooterMenu(urlPathname) {
    switch (urlPathname) {
        case '/summary.html':
            document.getElementById('nav-item-footer-summary').classList.add('selected');break;
        case '/addtask.html':
            document.getElementById('nav-item-footer-add-task').classList.add('selected');break;
        case '/board.html':
            document.getElementById('nav-item-footer-board').classList.add('selected');break;
        case '/contacts.html':
            document.getElementById('nav-item-footer-contacts').classList.add('selected');break;
    }
}
