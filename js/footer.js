function createHTMLFooter() {
    let headerDiv = document.getElementById('footer');
    if (headerDiv) {
        headerDiv.innerHTML += /*HTML*/`
            <div class="footer">
                <div id="nav-item-footer-summary" class="footerSingleCategory" onclick="navigateToSummary()">
                    <div><img src="assets/img/general/nav/summary.svg"></div>
                    <div>Summary</div>
                </div>
                <div id="nav-item-footer-add-task" class="footerSingleCategory" onclick="navigateToAddTask()">
                    <div><img src="assets/img/general/nav/edit.svg"></div>
                    <div>Add task</div>
                </div>
                <div id="nav-item-footer-board" class="footerSingleCategory" onclick="navigateToBoard()">
                    <div><img src="assets/img/general/nav/board.svg"></div>
                    <div>Board</div>
                </div>
                <div id="nav-item-footer-contacts" class="footerSingleCategory" onclick="navigateToContacts()">
                    <div><img src="assets/img/general/nav/contacts.svg"></div>
                    <div>Contacts</div>
                </div>
            </div>
    `;
    }
}
