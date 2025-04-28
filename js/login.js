/**
 * Handles the user login process by preventing default form submission, retrieving user input,
 * and validating these credentials against a list of users. It directs to successful login handling
 * or displays an error based on the validation result.
 *
 * @param {Event} event - The event object associated with the login attempt.
 * Steps:
 * - Prevents the default form submission action.
 * - Retrieves user credentials from the form.
 * - Checks if credentials match any user in the database.
 * - Calls the appropriate function based on successful or unsuccessful login.
 */
async function logIn(event) {
  event.preventDefault();
  const email = document.getElementById("input-email").value;
  const password = document.getElementById("input-password").value;
  const flgRememberMe = document.getElementById("checkbox-login").checked;
  const inputPassword = document.getElementById("input-password");
  const errorMessage = document.getElementById("error-message");
  const users = await db_LoadUsers();
  if (users) {
    const user = await validateUser(email, password, users);
    if (user) {
      handleSuccessfulLogin(user, flgRememberMe, email);
    } else {
      displayLoginError(inputPassword, errorMessage);
    }
  }
}


/**
 * Searches for a user in the provided user list that matches the given email and password.
 * Converts the email to lowercase to ensure case-insensitive matching.
 *
 * @param {string} email - User's email to validate.
 * @param {string} password - User's password to validate.
 * @param {Array} users - List of users to search within.
 * @returns {Object|null} Returns the user object if a match is found, otherwise null.
 */
async function validateUser(email, password, users) {
  const user = Object.values(users).find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  return user;
}


/**
 * Performs actions necessary after a successful login, including setting session and local storage
 * for user information and navigating to a summary page.
 *
 * @param {Object} user - The logged-in user's object.
 * @param {boolean} flgRememberMe - Flag to determine whether to remember the login.
 * @param {string} email - User's email to potentially store in local storage.
 * Steps:
 * - Sets the user in a session context.
 * - Optionally stores the email in local storage if 'remember me' is selected.
 * - Navigates to the summary page.
 */
function handleSuccessfulLogin(user, flgRememberMe, email) {
  actualUser = user;
  setLoggedInUserRememberMe_SS(flgRememberMe);
  if (flgRememberMe) {
    setLoggedInUserMail_LS(email);
  }
  navigateToSummary();
}


/**
 * Displays a login error by highlighting the password input field and showing an error message.
 *
 * This function provides visual feedback to the user when a login attempt fails. It performs the following actions:
 * - Adds the 'input-error' class to the password input field, which typically applies a visual style (e.g., red border) to indicate an error.
 * - Sets the display style of the error message element to 'block', making the error message visible to the user.
 *
 * @param {HTMLElement} inputPassword - The password input element that should be highlighted on error.
 * @param {HTMLElement} errorMessage - The error message element that should be displayed.
 *
 */
function displayLoginError(inputPassword, errorMessage) {
  inputPassword.classList.add("input-error");
  errorMessage.style.display = "block";
}


/**
 * Logs in a guest user by setting the user as null, updating session storage, and navigating to the summary page.
 *
 * This function handles the login process for a guest user. It performs the following actions:
 * - Sets the global `actualUser` variable to null, indicating that there is no specific user logged in.
 * - Updates the session storage to indicate that the "Remember Me" option is not selected by calling `setLoggedInUserRememberMe_SS` with `false`.
 * - Stores a guest email address ("Gast@join.de") in session storage using `setLoggedInUserMail_SS`.
 * - Redirects the user to the summary page by calling `navigateToSummary`.
 */
function logInGuest() {
  actualUser = null;
  setLoggedInUserRememberMe_SS(false);
  setLoggedInUserMail_SS("Gast@join.de");
  navigateToSummary();
}


/**
 * Updates the "Remember Me" setting in session storage based on the checkbox state.
 *
 * This function captures the current state of the "Remember Me" checkbox, identified by the ID 'checkbox-login'.
 * It then stores this state in session storage using the `setLoggedInUserRememberMe_SS` function.
 * This allows the application to remember whether the user wants to stay logged in on subsequent visits or sessions.
 *
 * - Retrieves the current state (checked or unchecked) of the checkbox with ID 'checkbox-login'.
 * - Stores this state in session storage using the `setLoggedInUserRememberMe_SS` function.
 */
function handleChangeRememberMe() {
  setLoggedInUserRememberMe_SS(
    document.getElementById("checkbox-login").checked
  );
}


/**
 * Checks the "Remember Me" setting from session storage and updates the state of the checkbox accordingly.
 *
 * This function retrieves the "Remember Me" preference from session storage using the `getLoggedInUserRememberMe_SS` function.
 * It then updates the state of the checkbox with the ID 'checkbox-login' based on the retrieved value.
 * If the stored value is 'true', the checkbox is checked; otherwise, it is unchecked.
 * This ensures that the checkbox reflects the user's previously saved preference when the page loads.
 *
 * - Retrieves the "Remember Me" setting from session storage.
 * - Updates the checkbox state based on the retrieved value.
 */
function checkChangeRememberMe() {
  //#MK: besser machen
  if (getLoggedInUserRememberMe_SS() == "true") {
    document.getElementById("checkbox-login").checked = true;
  } else {
    document.getElementById("checkbox-login").checked = false;
  }
}


/**
 * Temporarily stores the email address entered in the email input field into session storage.
 * This function captures the current value of the email input field and saves it using a session
 * storage helper function, ensuring the email can be retrieved later within the same session.
 */
function tempStoreEmail() {
  let email = document.getElementById("input-email").value;
  setLoggedInUserMail_SS(email);
}


/**
 * Retrieves the stored email from session storage and populates the email input field on the login page.
 * This function checks if an email address is stored in session storage (possibly from a previous
 * registration or temporary storage) and sets it as the value of the email input field if found.
 */
function checkEmailFromRegisterPage() {
  let email = getLoggedInUserMail_SS();
  if (email) {
    document.getElementById("input-email").value = email;
  }
}


/**
 * Fügt Event-Listener hinzu, um die Klasse des Passwort-Eingabefeldes basierend auf der Eingabelänge zu ändern.
 *
 * Diese Funktion wird ausgeführt, sobald das DOM vollständig geladen ist. Sie fügt Event-Listener für das 
 * Passwort-Eingabefeld hinzu, um das Verhalten des Hintergrundlogos zu steuern. Die Klasse 'password-logo' 
 * wird entfernt, wenn Text eingegeben wird, und wieder hinzugefügt, wenn das Feld verlassen wird, solange es nicht leer ist.
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
});


function animation() {
  setTimeout(function() {
    document.getElementById("whiteB").style.zIndex = "-1";
  }, 1000);
  document.getElementById("input-email").focus();
}
