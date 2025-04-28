/**
 * Validates the registration form inputs and handles the registration process if validations pass.
 * 
 * This function is triggered by the registration form submission. It performs the following actions:
 * - Prevents the default form submission behavior to handle registration via JavaScript.
 * - Retrieves the entered password and confirm password values.
 * - Checks if the privacy policy checkbox is selected.
 * - References the input fields and error message element for password validation feedback.
 * - Validates that the password and confirm password match.
 * - Validates that the privacy policy checkbox is checked.
 * - Calls the `register` function to complete the registration process if all validations pass.
 *
 * @param {Event} event - The event object associated with the form submission.
 * 
 */
function checkRegister(event) {
  event.preventDefault();
  var password = document.querySelector('.input-register.password-logo').value;
  var confirmPassword = document.querySelector('.input-register.repassword-logo').value;
  var checkbox = document.getElementById('checkboxRegister').checked;
  var inputPassword = document.getElementById('input-password');
  var inputConfirmPassword = document.getElementById('input-repassword');
  var errorMessage = document.getElementById('password-error-message');
  if (!validatePasswords(password, confirmPassword, inputPassword, inputConfirmPassword, errorMessage)) {
      return false;
  }
  if (!validateCheckbox(checkbox)) {
      return false;
  }
  register();
}


/**
 * Validates that two passwords match. If they don't match, it marks the confirmation password field
 * with an error and displays an error message.
 *
 * @param {string} password - The main password input.
 * @param {string} confirmPassword - The password entered for confirmation.
 * @param {HTMLElement} inputPassword - The HTML element for the main password input.
 * @param {HTMLElement} inputConfirmPassword - The HTML element for the confirmation password input.
 * @param {HTMLElement} errorMessage - The element that displays the error message.
 * @returns {boolean} True if passwords match, false otherwise.
 */
function validatePasswords(password, confirmPassword, inputPassword, inputConfirmPassword, errorMessage) {
  inputPassword.classList.remove('input-error');
  inputConfirmPassword.classList.remove('input-error');
  errorMessage.style.display = 'none';
  if (password !== confirmPassword) {
      inputConfirmPassword.classList.add('input-error');
      errorMessage.style.display = 'block';
      errorMessage.textContent = "Ups! Your passwords don't match.";
      return false;
  }
  return true;
}


/**
 * Checks the checkbox state and toggles visibility of associated text elements.
 * Displays a warning message if the checkbox is unchecked, otherwise shows standard acceptance text.
 *
 * @param {boolean} checkbox - True if the checkbox is checked, false otherwise.
 * @returns {boolean} Returns false if unchecked (non-compliance), true if checked (compliance).
 *
 * Actions:
 * - If unchecked: displays 'warningText', hides 'defaultText' and 'privacyLink'.
 * - If checked: hides 'warningText', displays 'defaultText' and 'privacyLink'.
 */
function validateCheckbox(checkbox) {
  var defaultText = document.getElementById('defaultText');
  var warningText = document.getElementById('warningText');
  var privacyLink = document.getElementById('privacyLink');

  if (!checkbox) {
      warningText.style.display = 'inline';
      defaultText.style.display = 'none';
      privacyLink.style.display = 'none';
      return false;
  } else {
      warningText.style.display = 'none';
      defaultText.style.display = 'inline';
      privacyLink.style.display = 'inline';
  }
  return true;
}


/**
 * Handles user registration by capturing user data from form fields and adding the new user to the database.
 * Upon successful registration, it sets session preferences, clears the form, and shows a success message,
 * then navigates to the login page after a short delay. If registration fails, an error alert is displayed.
 *
 * Actions:
 * - Retrieves user input from form fields and creates a new user object.
 * - Attempts to add the new user to the database.
 * - If successful: resets session settings, clears the form, displays a success popup, 
 *   and redirects to the login page after 2.5 seconds.
 * - If unsuccessful: displays an error message alerting the user to try registering again.
 */
async function register() {
  actualUser = newUser();
  actualUser.firstname = document.getElementById('input-firstname').value;
  actualUser.lastname = document.getElementById('input-lastname').value;
  actualUser.email = document.getElementById('input-email').value;
  actualUser.password = document.getElementById('input-password').value;

  const result = await db_AddUser(actualUser);
  if (result) {
      setLoggedInUserRememberMe_SS(false);
      clearForm();
      showInfoPopup('You Signed Up successfully');
      setTimeout(() => {
          navigateToLogIn();
      }, 2500);
  } else {
      alert("Registrierung fehlgeschlagen, bitte versuchen Sie es erneut.");
  }
}


/**
 * Resets the form fields within a specified form container.
 * This function is used to clear all user input from the form fields, 
 * effectively resetting them to their initial values.
 *
 * Usage:
 * - Called typically after form submission to reset the form for future use.
 */
function clearForm() {
  document.querySelector('.form-contact').reset();
}


/**
 * Temporarily stores the email address entered in the "input-email" field into session storage.
 * This function captures the email from the specified input field and uses a session storage helper
 * function to save it, ensuring it persists across the session for later retrieval.
 *
 * Usage:
 * - Typically called when the user navigates away from the registration or login form to
 *   temporarily hold their input without committing it to a permanent store.
 */
function tempStoreEmail() {
  let email = document.getElementById("input-email").value;
  setLoggedInUserMail_SS(email);
}


/**
 * Retrieves and populates the email field on the login page with an email address stored in session storage.
 * This function checks session storage for a previously saved email address and, if found, sets it as the
 * value of the email input field. This is useful for enhancing user experience by pre-filling form fields
 * with known values, reducing the amount of typing required from the user.
 *
 * Usage:
 * - Called when initializing the login page to automatically fill in the email address if it has been previously entered.
 */
function checkEmailFromLoginPage() {
  let email = getLoggedInUserMail_SS();
  if (email != null) {
    document.getElementById("input-email").value = email;
  }
}


/**
 * Opens or ensures the creation of a modal window and loads privacy policy content into it.
 * This function first retrieves or creates a modal element. It then checks if the element
 * has the appropriate "modal" class. If the class is present, it proceeds to load the privacy
 * policy content into the modal's content area.
 *
 * Usage:
 * - Typically invoked when a user clicks on a link or button to view the privacy policy.
 */
function privacyWindow() {
  var modal = getOrCreateModal();
  if (!modal.classList.contains("modal")) return;
  loadPrivacyContent(modal.querySelector(".modal-content"));
}


/**
 * Loads the content of the privacy policy from an external HTML file into a specified modal content area.
 * This function uses the Fetch API to retrieve the 'privacy.html' file. Upon successful fetching,
 * it appends the HTML content to the provided modal content container and then displays the modal.
 * Additionally, it calls a function to hide the navigation and header, presumably to focus user attention on the privacy policy.
 *
 * @param {HTMLElement} modalContent - The DOM element where the privacy policy content will be loaded.
 *
 */
function loadPrivacyContent(modalContent) {
    fetch("privacy.html")
      .then((response) => response.text())
      .then((html) => {
        modalContent.innerHTML += html;
        modalContent.parentNode.style.display = "flex";
        hideNavigationAndHeader();
      });
}


  /**
 * Hides the navigation and header elements on the page, adjusts the display style of the main website container,
 * and modifies the padding of the main content area.
 * This function is typically called to reduce visual clutter and focus user attention on a specific task or content,
 * such as reading a modal with legal or privacy information.
 */
function hideNavigationAndHeader() {
  var navigation = document.getElementById("navigation");
  var header = document.getElementById("header");
  var website = document.getElementById("website");
  var content = document.querySelector(".content");

  if (navigation && header && content) {
    navigation.style.display = "none";
    header.style.display = "none";
    website.style.display = "block";
    content.style.padding = "0";
  }
}


/**
 * Retrieves an existing modal from the DOM or creates a new one if it does not exist.
 * This function ensures that a modal element is always available for use when needed.
 * If the modal exists, it sets its display style to 'flex', making it visible.
 * If no modal is found, it calls `createModal()` to create a new modal element.
 *
 * Returns:
 * - The existing or newly created modal element.
 */
function getOrCreateModal() {
  var modal = document.querySelector(".modal");
  if (modal) {
    modal.style.display = "flex";
    return modal;
  }
  return createModal();
}


/**
 * Creates a new modal element with a nested modal content container and adds it to the document's body.
 * This function dynamically generates a modal structure, which includes a main container ('modal') and 
 * an inner content container ('modal-content'). After creating the modal, it appends it to the body of 
 * the document and sets up event handlers for closing the modal.
 *
 * Returns:
 * - The newly created modal element.
 */
function createModal() {
  var modal = document.createElement("div");
  modal.setAttribute("class", "modal");
  var modalContent = document.createElement("div");
  modalContent.setAttribute("class", "modal-content");
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  setupModalCloseEvents(modal);
  return modal;
}


/**
 * Sets up click event handlers on the window to close the modal when the user clicks outside of the modal content.
 * This function enhances the user interface by allowing users to close the modal by clicking on the area outside
 * the modal content, often referred to as clicking on the modal "overlay."
 *
 * @param {HTMLElement} modal - The modal element to which the close functionality is being added.
 */
function setupModalCloseEvents(modal) {
  window.onclick = function (event) {
    if (event.target === modal) closeModal(modal);
  };
}


/**
 * Closes a given modal by hiding it and then removing it from the DOM.
 * This function first sets the modal's display style to 'none', effectively hiding it,
 * and subsequently removes the modal element entirely from the DOM. This is typically used to clean up
 * after the modal is no longer needed, ensuring it doesn't occupy any resources or affect performance.
 *
 * @param {HTMLElement} modal - The modal element to be closed and removed.
 */
function closeModal(modal) {
  modal.style.display = "none";
  modal.remove();
}


/**
 * Fügt Event-Listener hinzu, um die Klasse der Passwort-Eingabefelder basierend auf der Eingabelänge zu ändern.
 *
 * Diese Funktion wird ausgeführt, sobald das DOM vollständig geladen ist. Sie fügt Event-Listener für 
 * die Passwort-Eingabefelder hinzu, um das Verhalten des Hintergrundlogos zu steuern. Die Klasse 'password-logo' 
 * oder 'repassword-logo' wird entfernt, wenn Text eingegeben wird, und wieder hinzugefügt, wenn das Feld 
 * verlassen wird, solange es nicht leer ist.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Funktion zum Hinzufügen und Entfernen der Klasse basierend auf der Eingabelänge
    function togglePasswordLogo(inputElement, logoClass) {
        inputElement.addEventListener('input', () => {
            if (inputElement.value.length > 0) {
                inputElement.classList.remove(logoClass);
            } else {
                inputElement.classList.add(logoClass);
            }
        });
        inputElement.addEventListener('blur', () => {
            if (inputElement.value.length > 0) {
                inputElement.classList.add(logoClass);
            }
        });
    }
    const passwordInput = document.getElementById('input-password');
    togglePasswordLogo(passwordInput, 'password-logo');

    const rePasswordInput = document.getElementById('input-repassword');
    togglePasswordLogo(rePasswordInput, 'repassword-logo');
});
