// JavaScript
const addBox = document.querySelector(".add-box"),
  popupBox = document.querySelector(".popup-box"),
  popupTitle = popupBox.querySelector("header p"),
  closeIcon = popupBox.querySelector("header i"),
  titleTag = popupBox.querySelector("input"),
  descTag = popupBox.querySelector("textarea"),
  addBtn = popupBox.querySelector("button"),
  searchInput = document.querySelector(".search-box input"),
  wrapper = document.querySelector(".wrapper");

// Array of month names
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Note colors
const noteColors = ["primary", "success", "warning", "danger", "secondary"];

// Retrieve notes from localStorage or initialize an empty array
let notes = JSON.parse(localStorage.getItem("notes") || "[]");

// Flags and ID for note updates
let isUpdate = false,
  updateId;

// Open the popup box to add a new note
addBox.addEventListener("click", () => {
  popupTitle.innerText = "Add a new Note";
  addBtn.innerText = "Add Note";
  popupBox.classList.add("show");
  document.querySelector("body").style.overflow = "hidden";
  if (window.innerWidth > 660) titleTag.focus();
});

// Close the popup box and reset fields
closeIcon.addEventListener("click", () => {
  isUpdate = false;
  titleTag.value = descTag.value = "";
  popupBox.classList.remove("show");
  document.querySelector("body").style.overflow = "auto";
});

// Search functionality
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const allNotes = document.querySelectorAll(".note");

  allNotes.forEach((note) => {
    const title = note.querySelector("p").textContent.toLowerCase();
    const desc = note.querySelector("span").textContent.toLowerCase();

    if (title.includes(searchTerm) || desc.includes(searchTerm)) {
      note.style.display = "block";
    } else {
      note.style.display = "none";
    }
  });
});

// Display existing notes from localStorage
function showNotes() {
  if (!notes) return;
  document.querySelectorAll(".note").forEach((li) => li.remove());

  notes.forEach((note, id) => {
    let filterDesc = note.description.replaceAll("\n", "<br/>");
    let randomColor =
      note.color || noteColors[Math.floor(Math.random() * noteColors.length)];

    let liTag = `<li class="note note-${randomColor}">
                    <div class="details">
                        <p>${note.title}</p>
                        <span>${filterDesc}</span>
                    </div>
                    <div class="bottom-content">
                        <span>${note.date}</span>
                        <div class="settings">
                            <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                            <ul class="menu">
                                <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')">
                                    <i class="uil uil-pen"></i>Edit
                                </li>
                                <li onclick="deleteNote(${id})">
                                    <i class="uil uil-trash"></i>Delete
                                </li>
                                <li onclick="changeColor(${id})">
                                    <i class="uil uil-palette"></i>Change Color
                                </li>
                            </ul>
                        </div>
                    </div>
                </li>`;
    addBox.insertAdjacentHTML("afterend", liTag);
  });
}

showNotes();

// Show menu options for each note
function showMenu(elem) {
  elem.parentElement.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

// Delete a specific note
function deleteNote(noteId) {
  let confirmDel = confirm("Are you sure you want to delete this note?");
  if (!confirmDel) return;
  notes.splice(noteId, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  showNotes();

  // Show notification
  showNotification("Note deleted successfully", "danger");
}

// Change note color
function changeColor(noteId) {
  const currentColor = notes[noteId].color || "primary";
  const currentIndex = noteColors.indexOf(currentColor);
  const nextIndex = (currentIndex + 1) % noteColors.length;
  const newColor = noteColors[nextIndex];

  notes[noteId].color = newColor;
  localStorage.setItem("notes", JSON.stringify(notes));
  showNotes();

  // Show notification
  showNotification("Note color changed", "success");
}

// Update a specific note
function updateNote(noteId, title, filterDesc) {
  let description = filterDesc.replaceAll("<br/>", "\r\n");
  updateId = noteId;
  isUpdate = true;
  addBox.click();
  titleTag.value = title;
  descTag.value = description;
  popupTitle.innerText = "Update a Note";
  addBtn.innerText = "Update Note";
}

// Add or update a note on button click
addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let title = titleTag.value.trim(),
    description = descTag.value.trim();

  if (title || description) {
    let currentDate = new Date(),
      month = months[currentDate.getMonth()],
      day = currentDate.getDate(),
      year = currentDate.getFullYear();

    let noteInfo = {
      title,
      description,
      date: `${month} ${day}, ${year}`,
      color: isUpdate
        ? notes[updateId].color
        : noteColors[Math.floor(Math.random() * noteColors.length)],
    };

    if (!isUpdate) {
      notes.push(noteInfo);
      showNotification("Note added successfully", "success");
    } else {
      isUpdate = false;
      notes[updateId] = noteInfo;
      showNotification("Note updated successfully", "success");
    }

    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
    closeIcon.click();
  } else {
    showNotification("Please enter title or description", "warning");
  }
});

// Show notification
function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <i class="uil uil-times" onclick="this.parentElement.remove()"></i>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Add notification styles
const style = document.createElement("style");
style.textContent = `
.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 8px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 250px;
  transform: translateX(150%);
  transition: transform 0.3s ease;
  z-index: 1000;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.notification.show {
  transform: translateX(0);
}

.notification i {
  margin-left: 15px;
  cursor: pointer;
}

.notification-primary {
  background-color: var(--primary-color);
}

.notification-success {
  background-color: var(--success-color);
}

.notification-warning {
  background-color: var(--warning-color);
}

.notification-danger {
  background-color: var(--danger-color);
}

.notification-secondary {
  background-color: var(--secondary-color);
}
`;
document.head.appendChild(style);
