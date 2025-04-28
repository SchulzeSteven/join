function createHTMLHeader() {
    let headerDiv = document.getElementById('header');
    if (headerDiv) {
        headerDiv.innerHTML += /*HTML*/`
        <div class="headerLogo">
            <img src="assets/img/general/logo_blue.svg" onclick="navigateToIndex()">
        </div>
        <div class="headerTitle">Kanban Project Management Tool</div>
        <div class="main-user-circle">
        <div class="headerHelpCircle" data-svg="help">
            <a href="help.html">
                <img src="assets/img/general/nav/help.svg">
            </a>
        </div>
        <div class="headerUserCircle" onclick="toggleDropdown(event)">??</div>
            <div class="dropdown-content" id="myDropdown" style="display: none;">
                <a href="#" onclick="navigateToPrivacy()">Privacy Policy</a>
                <a href="#" onclick="navigateToImprint()">Legal Notice</a>
                <a href="#" onclick="logout()">Logout</a>
            </div>
        </div>
    `;
    }
}
