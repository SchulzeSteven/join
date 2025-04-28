/**
 * Stores the current contact information being edited.
 *
 * @global
 * @type {Object}
 * @property {string} firstname - The first name of the contact.
 * @property {string} lastname - The last name of the contact.
 * @property {string} email - The email address of the contact.
 * @property {string} phone - The phone number of the contact.
 * @property {string} guid - The GUID of the contact.
 * @property {string} color - The color associated with the contact.
 */
let currentContactInfo;


/**
 * Creates an HTML string for displaying the contact's initials in a contact profile.
 *
 * This function performs the following actions:
 * - Calls `calculateInitials(contact)` to generate the initials of the given contact.
 * - Wraps the initials in a `div` element with the class 'contact-profile'.
 * - Returns the resulting HTML string.
 *
 * @param {Object} contact - The contact object containing contact details.
 * @returns {string} The HTML string for the contact's contact profile initials.
 *
 */
function contact_CreateInitials(contact) {
  return `<div class="contact-profile" style="background-color: ${contact.color}">${calculateInitials(contact)}</div>`;
}


/**
 * Creates an HTML string for displaying the contact's name and email in a contact profile.
 *
 * This function performs the following actions:
 * - Constructs an HTML string that includes the contact's full name and email.
 * - Wraps the name and email in a `div` element with the class 'contact-name-mail'.
 * - The name is placed inside an `h6` element, and the email is placed inside a `p` element.
 * - Returns the resulting HTML string.
 *
 * @param {Object} contact - The contact object containing contact details.
 * @returns {string} The HTML string for the contact's contact profile name and email.
 *
 */
function contact_CreateNameAndEmail(contact) {
  return `
    <div class="contact-name-mail">
        <h6>${contact.firstname + " " + contact.lastname}</h6>
        <p>${contact.email}</p>
    </div>`;
}


/**
 * Groups contacts alphabetically by the first letter of their first name.
 *
 * This function performs the following actions:
 * - Iterates over an array of contact objects.
 * - Extracts the first letter of each contact's first name and converts it to uppercase.
 * - Groups the contacts into an object where the keys are the first letters and the values are arrays of contacts.
 * - Returns the object containing the grouped contacts.
 *
 * @param {Array} contacts - An array of contact objects to be grouped.
 * @returns {Object} An object where the keys are uppercase first letters of first names, and the values are arrays of contacts.
 *
 */
function contactsAlphabetically(contacts) {
  const groupedContacts = [];
  if (contacts) {
    contacts.forEach((contact) => {
      let firstLetter
      if(contact.firstname){
        firstLetter = contact.firstname.charAt(0).toUpperCase();
      }else{
        firstLetter = contact.lastname.charAt(0).toUpperCase()
      }
      if (!groupedContacts[firstLetter]) {
        groupedContacts[firstLetter] = [];
      }
      groupedContacts[firstLetter].push(contact);
    });
  }
  return groupedContacts;
}


/**
 * Renders a list of contacts grouped alphabetically by the first letter of their first names.
 *
 * This function performs the following actions:
 * - Clears the current content of the HTML element with the ID "contact-list".
 * - Loads contact data from the database.
 * - Groups the contacts alphabetically by the first letter of their first names.
 * - Iterates over the grouped contacts, creating HTML elements for each group and contact.
 * - Appends the created elements to the "contact-list" element.
 *
 * @async
 * @function renderContacts
 * @returns {Promise<void>} A Promise that resolves when the contacts are loaded and rendered.
 */
async function renderContacts() {
  let contactList = document.getElementById("contact-list");
  contactList.innerHTML = "";
  let contacts = await db_LoadContacts();
  let groupedContacts = contactsAlphabetically(contacts);
  Object.keys(groupedContacts)
    .sort()
    .forEach((letter) => {
      const div = document.createElement("div");
      div.classList.add("letter-container");
      const h6 = document.createElement("h6");
      h6.classList.add("first-letter");
      h6.textContent = letter;
      div.appendChild(h6);
      const list = document.createElement("div");
      list.classList.add("contact-list-line");
      renderContact(groupedContacts, letter, list);
      div.appendChild(list);
      contactList.appendChild(div);
    });
}


/**
 * Renders the contacts for a given letter group and appends them to the provided list element.
 *
 * This function performs the following actions:
 * - Iterates over the contacts in the specified letter group.
 * - Creates HTML elements for each contact.
 * - Sets up event handlers and content for the created elements.
 * - Appends the created elements to the provided list element.
 *
 * @function renderContact
 * @param {Object} groupedContacts - An object containing the contacts grouped by the first letter of their first names.
 * @param {string} letter - The letter group to render contacts for.
 * @param {HTMLElement} list - The HTML element to append the rendered contacts to.
 */
function renderContact(groupedContacts, letter, list) {
  groupedContacts[letter].sort().forEach((name) => {
    const element = document.createElement(`div`);
    element.classList.add("contact-container");
    element.classList.add("pointer");
    element.onclick = () => {
      contactInformation(name), getCurrentContact(name.guid),highlightContact(name.guid),checkHighlightedElement()
    };
    element.innerHTML = contact_CreateInitials(name);
    element.innerHTML += contact_CreateNameAndEmail(name);
    element.id = name.guid;
    list.appendChild(element);
  });
}


/**
 * Highlights the specified contact by adding the "highlighted" class to its container,
 * and removes the "highlighted" class from all other contact containers.
 *
 * @param {string} contactId - The ID of the contact container to highlight.
 * @returns {void}
 */
function highlightContact(contactId) {
  const contacts = document.querySelectorAll('.contact-container');
  contacts.forEach(contact => {
      contact.classList.remove('highlighted');
  });

  const selectedContact = document.getElementById(contactId);
  if (selectedContact) {
      selectedContact.classList.add('highlighted');
  }
  
}


/**
 * Adds a new form for adding or editing a contact based on the form version.
 *
 * @function addNewForm
 * @param {number} formVersion - The version of the form to add (1 for add, 2 for edit).
 */
function addNewForm(formVersion) {
  let dialog = document.getElementById("contact-dialog");
  const templateVersions = {
    type1: addContactTemplate,
    type2: editContactTemplate,
  };
  setupDialogCloseBehavior(formVersion);
  const templateVersion = `type${formVersion}`;
  const template = templateVersions[templateVersion];
  dialog.classList.add("form-bg");
  dialog.innerHTML += template(formVersion);
  if (templateVersion == "type1") {
    timeDelay("addContact");
  } else {
    timeDelay("editContact");
  }
  checkScreenWitdh()
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
 * Removes a contact form from the contact dialog based on the specified version.
 *
 * This function removes either the "add contact" form or the "edit contact" form
 * from the contact dialog element, based on the provided version number. It also
 * removes the "form-bg" class from the contact dialog.
 *
 * @param {number} version - The version of the form to remove. Use 1 for the "add contact" form and 2 for the "edit contact" form.
 */
function removeContactForm(version) {
  let dialog = document.getElementById("contact-dialog");
  let add = document.getElementById("addContact");
  let edit = document.getElementById("editContact");

  dialog.classList.remove("form-bg");
  if (version == 1 && add) {
    dialog.removeChild(add);
  } else if (version == 2 && edit) {
    dialog.removeChild(edit);
  }
}


/**
 * Sets up the behavior to close the contact dialog when clicking outside of the form.
 *
 * This function adds an event listener to the contact dialog element, which closes
 * the dialog when clicking outside of the form area. It also removes the "form-bg"
 * class from the contact dialog.
 *
 * @param {number} formVersion - The version of the form currently displayed. Use 1 for the "add contact" form and 2 for the "edit contact" form.
 */
function setupDialogCloseBehavior(formVersion) {
  const contactDialog = document.getElementById("contact-dialog");

  contactDialog.addEventListener("click", (event) => {
    if (event.target === contactDialog) {
      contactDialog.classList.remove("form-bg");
      removeContactForm(formVersion);
    }
  });
}


/**
 * Adds a new contact to the database and refreshes the contact list.
 *
 * @async
 * @function addContact
 * @param {Event} event - The form submission event.
 * @param {number} formVersion - The version of the form being used.
 * @returns {Promise<void>} A Promise that resolves when the contact is added and the form is removed.
 */
async function addContact(event, formVersion) {
  event.preventDefault();
  let myNewContact = newContact();
  myNewContact.firstname = getFirstName("add");
  myNewContact.lastname = getLastName("add");
  myNewContact.email = getEmail("add");
  myNewContact.phone = getPhone("add");
  await db_AddContact(myNewContact);
  await renderContacts();
  removeContactForm(formVersion);
  showInfoPopup("Contact successfully created ")
}


/**
 * Retrieves the last name from the specified input field.
 *
 * @function getLastName
 * @param {string} id - The ID prefix of the input field.
 * @returns {string} The last name.
 */
function getLastName(id) {
  let name = document.getElementById(`${id}-contact-name`).value;
  let firstName = name.split(/\s+/);
  firstName = firstName[firstName.length - 1];
  return firstName;
}


/**
 * Retrieves the first name from the specified input field.
 *
 * @function getFirstName
 * @param {string} id - The ID prefix of the input field.
 * @returns {string} The first name.
 */
function getFirstName(id) {
  let name = document.getElementById(`${id}-contact-name`).value;
  let lastName = name.split(/\s+/);
  lastName = lastName.slice(0, lastName.length - 1).join(" ");
  return lastName;
}


/**
 * Retrieves the email from the specified input field.
 *
 * @function getEmail
 * @param {string} id - The ID prefix of the input field.
 * @returns {string} The email.
 */
function getEmail(id) {
  let email = document.getElementById(`${id}-contact-email`).value;
  return email;
}


/**
 * Retrieves the phone number from the specified input field.
 *
 * @function getPhone
 * @param {string} id - The ID prefix of the input field.
 * @returns {string} The phone number.
 */
function getPhone(id) {
  let phone = document.getElementById(`${id}-contact-phone`).value;
  return phone;
}


/**
 * Deletes a contact from the database and refreshes the contact list.
 *
 * @async
 * @function deleteContact
 * @param {string} guid - The GUID of the contact to delete.
 * @returns {Promise<void>} A Promise that resolves when the contact is deleted and the list is refreshed.
 */
async function deleteContact(guid) {
  await db_DeleteContactByEmail(guid);
  await renderContacts();
  document.getElementById("contact-info").innerHTML = "";
}


/**
 * Retrieves the current contact information from the database by GUID.
 *
 * @async
 * @function getCurrentContact
 * @param {string} guid - The GUID of the contact to retrieve.
 * @returns {Promise<void>} A Promise that resolves when the contact information is retrieved.
 */
async function getCurrentContact(guid) {
  currentContactInfo = await db_GetContactByGUID(guid);
}


/**
 * Saves the edited contact information to the database and refreshes the contact list.
 *
 * @async
 * @function saveContact
 * @param {Event} event - The form submission event.
 * @returns {Promise<void>} A Promise that resolves when the contact information is saved and the list is refreshed.
 */
async function saveContact(event) {
  event.preventDefault();
  currentContactInfo.firstname = getFirstName("edit");
  currentContactInfo.lastname = getLastName("edit");
  currentContactInfo.email = getEmail("edit");
  currentContactInfo.phone = getPhone("edit");
  removeContactForm(2);
  document.getElementById("contact-info").innerHTML = "";
  await db_ChangeContact(currentContactInfo);
  contactInformation(currentContactInfo);
  await renderContacts();
}


/**
 * Checks if there is an element with the class "highlighted" and adjusts the display of 
 * certain elements based on the window width.
 * If the window width is less than or equal to 950px, it hides the contact aside element.
 * If the window width is less than or equal to 660px, it also hides the contact edit/delete container.
 */
function checkHighlightedElement(){
  if(document.querySelector(".highlighted") && window.innerWidth <= 950){
    document.querySelector(".contact-aside").classList.add("d-none")
    if(window.innerWidth <= 660){
      document.querySelector(".contact-edit-delete-container").classList.add("d-none")
    }
  }
}


/**
 * Checks the screen width and adjusts the display of certain elements based on the window width.
 * If the window width is greater than or equal to 850px, it shows the contact aside and edit/delete container
 * and changes the icon source if the element with class "w-14" is present.
 * If the window width is less than 850px, it hides the contact aside element, and hides the 
 * edit/delete container if the window width is less than or equal to 660px.
 */
function checkScreenWitdh(){
  let editDeleteContainer = document.querySelector(".contact-edit-delete-container")
  if(window.innerWidth >= 850){
    if(document.querySelector(".w-14")){
      document.querySelector(".w-14").src = "./assets/img/icons/cancel.svg"
    }
    if(editDeleteContainer){
    editDeleteContainer.classList.remove("d-none");
    document.querySelector(".contact-aside").classList.remove("d-none")
    }
  }else if(window.innerWidth <= 660){
    if(document.querySelector(".w-14")){
      document.querySelector(".w-14").src = "./assets/img/icons/close_white.svg"
    }
  }
}


/**
 * Removes the contact info container element from the DOM and shows the contact aside element.
 */
function backToContactList(id){
  document.querySelector(".contact-info-container").remove
  document.querySelector(".contact-aside").classList.remove("d-none")
  if(window.innerWidth <= 850){
    document.getElementById(id).classList.remove("highlighted")
  }
}


function toggleEditDelete(event){
  let editDelete = document.querySelector(".contact-edit-delete-container");
  let currentDisplay = window.getComputedStyle(editDelete).display;
  if (currentDisplay === "none" || currentDisplay === "") {
    editDelete.style.display = "flex";
  } else {
    editDelete.style.display = "none";
  }
  event.stopPropagation();
}


/**
 * Displays the contact information in the contact information section.
 *
 * @function contactInformation
 * @param {Object} contact - The contact object containing the contact information.
 */
function contactInformation(contact) {
  let contactInfo = document.getElementById("contact-info");
  contactInfo.innerHTML = /*HTML*/ `
    <div class="contact-info-container">  
        <div class="contact-profile-card" style="background-color: ${contact.color}">
            <h2 id="contactInitials">${calculateInitials(contact)}</h2>
        </div> 
        <div class="contact-name-edit-delete">
            <h2>${contact.firstname + " " + contact.lastname}</h2> 
            <div class="contact-edit-delete-container"> 
                <div onclick="addNewForm(2)" class="pointer contact-edit-delete">
                    <img src="./assets/img/icons/edit.svg" alt="">
                    <p>Edit</p>
                </div>
                <div onclick="deleteContact('${contact.guid}'), backToContactList()" class="pointer contact-edit-delete">
                    <img src="./assets/img/icons/delete.svg" alt="">
                    <p>Delete</p>
                </div>
            </div>
        </div>
    </div>
    <div class="contact-information">
        <h6>Contact Information</h6>
    </div>
    <div class="contact-email-container">
        <p class="fbold">Email</p>
        <p>${contact.email}</p>
    </div>
    <div class="contact-phone-container">
        <p class="fbold">Phone</p>
        <p>${contact.phone}</p>
    </div>
    <img onclick="backToContactList('${contact.guid}')" class="back-arrow" src="./assets/img/icons/back.svg" alt="">
      <div onclick="toggleEditDelete(event)" class="more-container">
        <img src="./assets/img/icons/more_vert.svg" alt="">
      </div>
    `;
}


/**
 * Returns the HTML template for adding a contact.
 *
 * @function addContactTemplate
 * @param {number} formVersion - The version of the form.
 * @returns {string} The HTML template for adding a contact.
 */
function addContactTemplate(formVersion) {
  return /* html */ `
    <div id="addContact" class="contact">
        <div class="contact-left">
            <img src="./assets/img/general/logo_white.svg" alt="logo_white">
            <div class="contact-text">
                <h1>Add contact</h1>
                <p>Tasks are better with a team!</p>
            </div>
            <div class="contact-line"></div>
        </div>
        <div class="contact-right">
            <div class="contact-profile-card mt-156 profile-responsive">
                <img src="./assets/img/icons/person_light.svg" alt="person_light">
            </div>
            <div class="contact-main-form">
                <img onclick="removeContactForm(${formVersion})" class="pointer w-14" src="./assets/img/icons/cancel.svg" alt="cancel">
                <form class="contact-form" onsubmit="addContact(event, ${formVersion})">
                    <input autocomplete="false" id="add-contact-name" class="contact-input contact-person-logo" name="Name" type="text" required placeholder="Name">
                    <input autocomplete="false" id="add-contact-email" class="contact-input contact-email-logo" name="email" type="email" required placeholder="Email">
                    <input autocomplete="false" id="add-contact-phone" class="contact-input contact-phone-logo" name="phone" type="number" required placeholder="Phone">
                    <div class="contact-btns">
                        <button onclick="removeContactForm(${formVersion})" class="cancel-btn button-responsive" type="button">
                          Cancel
                            <svg width="20" height="13" viewBox="0 0 14 13" stroke="#2A3647" fill="none">
                              <path d="M7.001 6.50008L12.244 11.7431M1.758 11.7431L7.001 6.50008L1.758 11.7431ZM12.244 1.25708L7 6.50008L12.244 1.25708ZM7 6.50008L1.758 1.25708L7 6.50008Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <button class="create-btn fbold bfill button-responsive" type="submit">
                          Create contact
                            <svg width="30" height="30" viewBox="0 0 38 30" fill="none" stroke="white">
                              <path d="M4.02832 15.0001L15.2571 26.0662L33.9717 3.93408" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;
}


/**
 * Returns the HTML template for editing a contact.
 *
 * @function editContactTemplate
 * @param {number} formVersion - The version of the form.
 * @returns {string} The HTML template for editing a contact.
 */
function editContactTemplate(formVersion) {
  return /*HTML*/ `
    <div id="editContact" class="contact">
        <div class="contact-left">
            <img src="./assets/img/general/logo_white.svg" alt="logo_white">
            <div class="editContact-text">
                <h1>Edit contact</h1>
            </div>
            <div class="contact-line"></div>
        </div>
        <div class="contact-right">
            <div class="contact-profile-card mt-156 profile-responsive" style="background-color: ${currentContactInfo.color}">
                <h2>${calculateInitials(currentContactInfo)}</h2>
            </div>
            <div class="contact-main-form">
                <img onclick="removeContactForm(${formVersion})" class="pointer w-14" src="./assets/img/icons/cancel.svg" alt="cancel">
                <form onsubmit="saveContact(event)" class="contact-form">
                    <input autocomplete="false" id="edit-contact-name" value="${currentContactInfo.firstname +" " +currentContactInfo.lastname}" class="contact-input contact-person-logo" name="Name" required type="text" placeholder="Name">
                    <input autocomplete="false" id="edit-contact-email" value="${currentContactInfo.email}" class="contact-input contact-email-logo" name="email" required type="email" placeholder="Email">
                    <input autocomplete="false" id="edit-contact-phone" value="${currentContactInfo.phone}" class="contact-input contact-phone-logo" name="phone" required type="number" placeholder="Phone">
                    <div class="contact-btns">
                        <button onclick="deleteContact('${currentContactInfo.guid}'), removeContactForm(${formVersion})" class="cancel-btn" type="button">Delete</button>
                        <button class="create-btn fbold bfill" type="submit">
                          Save
                            <svg width="30" height="30" viewBox="0 0 38 30" fill="none" stroke="white">
                              <path d="M4.02832 15.0001L15.2571 26.0662L33.9717 3.93408" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;
}


/**
 * Generates and adds a set of sample contacts to the database, then renders them.
 *
 * @async
 * @function contactTemplate
 * @returns {Promise<void>} A Promise that resolves when the sample contacts are added and rendered.
 */
async function contactTemplate() {
  const firstNames = [
    "David",
    "Clara",
    "Chris",
    "Anna",
    "Barbara",
    "Zach",
    "Bob",
    "Alice",
    "John",
    "Jane",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Martinez",
    "Hernandez",
  ];
  const emails = [
    "david.smith@example.com",
    "clara.johnson@example.com",
    "chris.williams@example.com",
    "anna.brown@example.com",
    "barbara.jones@example.com",
    "zach.garcia@example.com",
    "bob.miller@example.com",
    "alice.davis@example.com",
    "john.martinez@example.com",
    "jane.hernandez@example.com",
  ];
  const phoneNumbers = [
    "5551234567",
    "5552345678",
    "5553456789",
    "5554567890",
    "5555678901",
    "5556789012",
    "5557890123",
    "5558901234",
    "5559012345",
    "5550123456",
  ];
  for (let i = 0; i < firstNames.length; i++) {
    let myNewContact = newContact();
    myNewContact.firstname = firstNames[i];
    myNewContact.lastname = lastNames[i];
    myNewContact.email = emails[i];
    myNewContact.phone = phoneNumbers[i];
    await db_AddContact(myNewContact);
  }
  await renderContacts();
}
