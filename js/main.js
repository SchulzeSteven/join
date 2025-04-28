let actualUser;


/**
 * Initializes the application by checking user authentication, loading HTML content, and setting up the UI.
 *
 * This function performs the following actions:
 * - Checks if the user is authenticated and navigates them accordingly.
 * - Includes HTML content and sets the visibility of the body.
 * - Optionally navigates to the summary page or sets up the UI with selected menu colorization and user initials.
 * - Executes an optional callback function if provided.
 *
 * @param {boolean} [flgNavToSummary=false] - A flag to determine whether to navigate to the summary page after initialization.
 * @param {Function} [callBackFunktion] - An optional callback function to execute after initialization.
 *
 * Steps:
 * - Calls `checkAndNavigateUser` to verify user authentication and navigate them if necessary.
 *   - If the user is not authenticated, the function returns early.
 * - Checks the `flgNavToSummary` flag:
 *   - If true, calls `navigateToSummary` to navigate to the summary page.
 *   - If false, calls `colorizeSelectionMenu` to update the menu colors and `setUserInitials` to display the user's initials.
 * - If `callBackFunktion` is provided, it is called at the end of the initialization process.
 */
async function init(flgNavToSummary = false, callBackFunktion) {
  if (!(await checkAndNavigateUser())) {
    return;
  }
  createHTMLHeader();
  createHTMLNavigation();
  createHTMLFooter();
  toggleUserCircles();
  toggleNavSubMenus();
  toggleFooter();
  
  // Prüfe, ob die aktuelle URL die 'addTask' Seite enthält
  if (window.location.href.includes('addtask.html')) {
    createAddTask();
  }

  if (flgNavToSummary) {
    navigateToSummary();
  } else {
    colorizeSelectionMenu();
    setUserInitials();
  }
  if (callBackFunktion) {
    await callBackFunktion();
  }
}


/**
 * Checks user authentication and navigates the user to the login page if necessary.
 *
 * This function performs the following actions:
 * - Verifies if the `actualUser` is set (indicating an authenticated user).
 * - If `actualUser` is null, it attempts to check the user authentication status by calling `checkUser`.
 * - If the user is not authenticated and the current page is not the privacy or imprint page, it navigates the user to the login page.
 * - Returns `true` if the user is authenticated or on an allowed page, otherwise returns `false`.
 *
 * @returns {Promise<boolean>} A promise that resolves to `true` if the user is authenticated or on an allowed page, otherwise `false`.
 *
 * Steps:
 * - Checks if `actualUser` is null:
 *   - If `actualUser` is null, calls `checkUser` to attempt to authenticate the user.
 *   - If `checkUser` returns `false`, gets the current URL pathname in lowercase.
 *   - Checks if the pathname is not '/privacy.html' and not '/imprint.html':
 *     - If true, calls `navigateToLogIn` to redirect the user to the login page.
 *     - Returns `false` to indicate the user is not authenticated.
 * - Returns `true` if the user is authenticated or on an allowed page (privacy or imprint).
 */
async function checkAndNavigateUser() {
  if (actualUser == null) {
    if (!(await checkUser())) {
      let urlPathname = window.location.pathname.toLowerCase();
      if (urlPathname != '/join/privacy.html' && urlPathname != '/join/imprint.html') {
        navigateToLogIn();
        return false;
      }
    }
  }
  return true;
}


/**
 * Toggles the display of navigation submenus and adjusts the navigation bar styling based on user authentication status.
 *
 * This function performs the following actions:
 * - Selects the navigation submenu element from the document.
 * - Checks if the navigation submenu element exists.
 * - If the element exists:
 *   - Checks if `actualUser` is `null` (indicating no authenticated user).
 *   - Sets the display style of the navigation submenus to "none" if `actualUser` is `null`.
 *   - Sets the display style of the navigation submenus to "flex" if `actualUser` is not `null`.
 * - Adjusts the navigation bar's alignment to "space-between" if the navigation element exists.
 *
 * Steps:
 * - Selects the element with the class `navigationSubMenus` using `document.querySelector`.
 * - If the element exists:
 *   - Checks the value of `actualUser`.
 *   - Sets the display style of the element to "none" if `actualUser` is `null`.
 *   - Sets the display style of the element to "flex" if `actualUser` is not `null`.
 * - Selects the navigation element by its ID `navigation` using `document.getElementById`.
 * - If the navigation element exists, sets its `justifyContent` style to "space-between" to adjust its alignment.
 */
function toggleNavSubMenus() {
  let navSubMenus = document.querySelector(".navigationSubMenus");
  if (navSubMenus) {
    if (actualUser == null) {
      navSubMenus.style.display = "none";
    } else {
      navSubMenus.style.display = "flex";
    }
  }
  let navigation = document.getElementById("navigation");
  if (navigation) {
    navigation.style.justifyContent = "space-between";
  }
}


function toggleFooter() {
  let footerClassElement = document.querySelector(".footer");
  if (footerClassElement) {
    if (actualUser == null) {
      footerClassElement.style.display = "none";
    } else {
      footerClassElement.style.display = "flex";
    }
  }
  let footerIdElement = document.getElementById("footer");
  if (footerIdElement) {
    if (actualUser == null) {
      footerIdElement.style.display = "none";
    }
  }
}


/**
 * Toggles the display of user circle elements and adjusts the navigation bar styling based on user authentication status.
 *
 * This function performs the following actions:
 * - Selects all elements with the class `main-user-circle` from the document.
 * - Iterates over each selected element to set its display style based on the authentication status of `actualUser`.
 * - If `actualUser` is null, hides the user circles by setting their display style to "none".
 * - If `actualUser` is not null, shows the user circles by setting their display style to "flex".
 * - Adjusts the navigation bar's alignment to "space-between" if the navigation element exists.
 *
 * Steps:
 * - Selects all elements with the class `main-user-circle` using `document.querySelectorAll`.
 * - Iterates over the NodeList of user circle elements using `forEach`.
 *   - For each element, checks the value of `actualUser`.
 *   - Sets the display style of the element to "none" if `actualUser` is null.
 *   - Sets the display style of the element to "flex" if `actualUser` is not null.
 * - Selects the navigation element by its ID `navigation` using `document.getElementById`.
 * - If the navigation element exists, sets its `justifyContent` style to "space-between" to adjust its alignment.
 */
function toggleUserCircles() {
  let userCircles = document.querySelectorAll(".main-user-circle");
  userCircles.forEach(function(circle) {
    if (actualUser == null) {
      circle.style.display = "none";
    } else {
      circle.style.display = "flex";
    }
  });
  let navigation = document.getElementById("navigation");
  if (navigation) {
    navigation.style.justifyContent = "space-between";
  }
}


/**
 * Checks if a user is logged in by verifying their email against a list of users.
 *
 * This function performs the following actions:
 * - Attempts to retrieve the logged-in user's email from local storage and session storage.
 * - If no email is found, it sets the email to an empty string.
 * - Loads the list of users from a specified data source.
 * - Searches for a user whose email matches the retrieved email (case-insensitive).
 * - If a matching user is found, sets the `actualUser` to this user and returns `true`.
 * - If no matching user is found, returns `false`.
 *
 * @async
 * @function
 * @returns {Promise<boolean>} A promise that resolves to `true` if the user is authenticated, otherwise `false`.
 *
 * Steps:
 * - Attempts to retrieve the email from local storage using `getLoggedInUserMail_LS`.
 * - If no email is found or the email length is zero, attempts to retrieve the email from session storage using `getLoggedInUserMail_SS`.
 * - If no email is found or the email length is zero, sets the email to an empty string.
 * - Loads the list of users from the data source "/users" by calling `db_LoadUsers`.
 * - If users are successfully loaded:
 *   - Searches for a user whose email matches the retrieved email (case-insensitive).
 *   - If a matching user is found, sets `actualUser` to this user and returns `true`.
 *   - If no matching user is found, returns `false`.
 * - If no users are loaded, returns `false`.
 */
async function checkUser() {
  let email = getLoggedInUserMail_LS();
  if (email == null || email.length == 0) {
    email = getLoggedInUserMail_SS();
  }
  if (email == null || email.length == 0) {
    email = "";
  }
  let users = await db_LoadUsers();
  if (users) {
    let user = Object.values(users).find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (user) {
      actualUser = user;
      return true;
    } else {
      return false;
    }
  }
  return false;
}


/**
 * Logs out the current user by clearing user data from storage and redirecting to the login page.
 *
 * This function handles the logout process by performing the following actions:
 * - Deletes the logged-in user's email from session storage.
 * - Deletes the "Remember Me" setting from session storage.
 * - Deletes the logged-in user's email from local storage.
 * - Redirects the user to the login page.
 *
 */
function logout() {
  deleteLoggedInUserMail_SS();
  deleteLoggedInUserRememberMe_SS();
  deleteLoggedInUserMail_LS();
  window.location.href = "./login.html";
}


/**
 * Sets the user's initials by calculating them and updating the display.
 *
 * This function performs the following actions:
 * - Calls `calculateInitials` to compute the initials of the current user (`actualUser`).
 * - Calls `updateInitialsDisplay` to update the user interface with the calculated initials.
 *
 */
function setUserInitials() {
  const initials = calculateInitials(actualUser);
  updateInitialsDisplay(initials);
}


/**
 * Calculates the initials of a given user based on their first name and last name.
 *
 * This function performs the following actions:
 * - Checks if the user data is available and valid.
 * - If the user is a guest, returns the initial of the first name.
 * - If the user is not a guest and has both first and last names, returns the initials of both.
 * - If only the first name is available, returns the initial of the first name.
 *
 * @param {Object} user - The user object containing user details.
 * @returns {string} The calculated initials based on the user's name.
 *
 */
function calculateInitials(user) {
  if (!user) {return('??')}
  if (!user.firstname && user.lastname) {
    return user.lastname[0].toUpperCase();
  }
  if (user.isguest) {
    return user.firstname[0].toUpperCase();
  } else if (user.lastname) {
    return (user.firstname[0] + user.lastname[0]).toUpperCase();
  } else {
    return user.firstname[0].toUpperCase();
  }
}


/**
 * Updates the display with the user's initials in the designated user circle element.
 *
 * This function performs the following actions:
 * - Selects the element with the class 'headerUserCircle'.
 * - If the element is found, it sets its inner HTML to the provided initials.
 * - If the element is not found, it logs an error message to the console.
 *
 * @param {string} initials - The initials to be displayed in the user circle element.
 *
 */
function updateInitialsDisplay(initials) {
  const userCircle = document.querySelector(".headerUserCircle");
  if (userCircle) {
    userCircle.innerHTML = initials;
  } else {
    console.log("Element .headerUserCircle wurde nicht gefunden.");
  }
}


/**
 * Toggles the visibility of a dropdown menu when an event occurs.
 *
 * This function performs the following actions:
 * - Selects the dropdown element by its ID 'myDropdown'.
 * - Retrieves the current display style of the dropdown.
 * - Toggles the display style between 'flex' (visible) and 'none' (hidden) based on the current state.
 * - Stops the event from propagating to prevent unwanted behavior from parent elements.
 *
 * @param {Event} event - The event object that triggered the function.
 *
 */
function toggleDropdown(event) {
  var dropdown = document.getElementById("myDropdown");
  var currentDisplay = window.getComputedStyle(dropdown).display;
  if (currentDisplay === "none" || currentDisplay === "") {
    dropdown.style.display = "flex";
  } else {
    dropdown.style.display = "none";
  }
  event.stopPropagation();
}


/**
 * Closes all dropdown menus when a click occurs anywhere on the window.
 *
 * This function is assigned to the `onclick` event of the `window` object. It performs the following actions:
 * - Selects all elements with the class 'dropdown-content'.
 * - Iterates through the list of dropdown elements.
 * - Checks if the display style of each dropdown is set to 'flex' (indicating it is open).
 * - If a dropdown is open (display style is 'flex'), sets its display style to 'none' to close it.
 *
 * This ensures that any open dropdown menus are closed when the user clicks anywhere outside of the dropdown.
 *
 */
window.onclick =  () => {
  var dropdowns = document.getElementsByClassName("dropdown-content");
  let editDelete = document.querySelector(".contact-edit-delete-container");
  for (var i = 0; i < dropdowns.length; i++) {
    if (dropdowns[i].style.display === "flex") {
      dropdowns[i].style.display = "none";
    }
  }
  if(editDelete){
    if(editDelete.style.display === "flex"){
          editDelete.style.display = "none"
    }
  }
};


/**
 * Toggles the visibility of a dropdown menu when an event occurs.
 *
 * This function performs the following actions:
 * - Selects the dropdown element by its ID 'myDropdown'.
 * - Retrieves the current display style of the dropdown.
 * - Toggles the display style between 'flex' (visible) and 'none' (hidden) based on the current state.
 * - Stops the event from propagating to prevent unwanted behavior from parent elements.
 *
 * @returns {Event} event - The event object that triggered the function.
 *
 */
let colorTable = ["#FF7A00","#FF5EB3","#6E52FF",
                  "#9327FF","#00BEE8","#1FD7C1",
                  "#FF745E","#FFA35E","#FC71FF",
                  "#FFC701","#0038FF","#C3FF2B",
                  "#FFE62B","#FF4646","#FFBB2B"]
function randomColor() {
  const index =Math.abs(Math.round(Math.random() * colorTable.length-1));
  return colorTable[index];
}


/**
 * Displays a success popup notification and animates its appearance and disappearance.
 * Initially makes the popup visible and then fades it in with a translation effect.
 * After a set duration, it fades the popup out and hides it again.
 *
 * Steps:
 * - Makes the popup visible.
 * - Animates it into view using opacity and transform changes.
 * - Keeps the popup visible for a brief period.
 * - Gradually fades the popup out and moves it off-screen.
 * - Finally, sets the display to 'none' to fully hide it from view.
 *
 * Timing:
 * - Popup fades in almost immediately.
 * - Remains visible for 2800 milliseconds.
 * - Fades out over 1000 milliseconds.
 */
function showInfoPopup(popupText = 'Empty Text') {
  if (document.getElementById('infoPopupText')) {document.getElementById('infoPopup').innerText = popupText;}
  const popup = document.getElementById('infoPopup');
  popup.style.display = 'block';
  setTimeout(() => {
      popup.style.opacity = 1;
      setTimeout(() => {
          popup.style.opacity = 0;
          setTimeout(() => {
              popup.style.display = 'none';
          }, 1000); // Warten auf das Ende der Ausblendungsanimation
      }, 2800); // Dauer, wie lange das Popup sichtbar bleibt
  }, 10);
}


/**
 * Dynamically changes the favicon based on the user's color scheme preference (light or dark mode).
 *
 * This code performs the following actions:
 * - Defines paths to the light and dark mode favicons.
 * - Implements a function to change the favicon based on the current color scheme.
 * - Sets up an event listener to detect changes in the color scheme and update the favicon accordingly.
 * - Immediately applies the favicon based on the initial color scheme.
 *
 * Constants:
 * - `lightFavicon` (string): Path to the favicon for light mode.
 * - `darkFavicon` (string): Path to the favicon for dark mode.
 *
 * Functions:
 * - `changeFavicon`: Updates the favicon based on the current color scheme.
 *   - Determines the current theme using `window.matchMedia('(prefers-color-scheme: dark)')`.
 *   - Sets the `href` attribute of the `<link rel="icon">` element to the appropriate favicon path.
 *
 * Event Listeners:
 * - `themeWatcher.addListener(changeFavicon)`: Listens for changes in the color scheme preference and calls `changeFavicon` when the preference changes.
 *
 * Initial Call:
 * - `changeFavicon()`: Immediately sets the favicon based on the initial color scheme when the script runs.
 */
const lightFavicon = './assets/img/general/logo_blue.svg';
const darkFavicon = './assets/img/general/logo_white.svg';


function changeFavicon() {
  const currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? darkFavicon : lightFavicon;
  document.querySelector('link[rel="icon"]').setAttribute('href', currentTheme);
}


const themeWatcher = window.matchMedia('(prefers-color-scheme: dark)');
themeWatcher.addListener(changeFavicon);
