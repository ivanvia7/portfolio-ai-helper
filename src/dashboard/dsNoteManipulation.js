import { callBackendToFetchContent } from "../content/messagesToBk";
import { formatDate } from "./dsUtils.js";
import { sendNoteToBackend } from "../content/messagesToBk";
import { deleteNoteListener } from "./dsBtnListenersForNotes.js";

function createNoteElement(noteObject, fragmentAppend = false) {
  const parent = document.querySelector(".dsThreadNotesContainer");

  if (!noteObject.content || !noteObject.createdAtId || !noteObject._id) {
    console.error("Invalid note data");
    return null;
  }

  const noteContainer = document.createElement("div");
  noteContainer.classList.add("dsContentBuble", "dsNoteContentContainer");

  noteContainer.setAttribute("data-id", noteObject._id);

  const textElement = document.createElement("div");
  textElement.classList.add("dsBubleTextContent");
  textElement.textContent = noteObject.content;

  const noteLabel = document.createElement("div");
  noteLabel.classList.add("dsBubleLabel");

  const dateElement = document.createElement("div");
  dateElement.classList.add("dsNoteDate");
  dateElement.textContent = formatDate(noteObject.createdAtId);

  const separator = document.createElement("div");
  separator.textContent = "|";

  const removeNoteButton = document.createElement("div");
  removeNoteButton.classList.add("dsNoteRemoveButton");
  removeNoteButton.textContent = "Remove";
  removeNoteButton.addEventListener("click", deleteNoteListener);

  noteLabel.appendChild(dateElement);
  noteLabel.appendChild(separator);
  noteLabel.appendChild(removeNoteButton);

  noteContainer.appendChild(textElement);
  noteContainer.appendChild(noteLabel);

  if (fragmentAppend === false) {
    parent.appendChild(noteContainer);
    noteContainer.scrollIntoView({ behavior: "smooth", block: "end" });
    return noteContainer;
  } else {
    return noteContainer;
  }
}

export async function displayNotesToDashboard() {
  cleanAllNotesFromCurrentView();
  try {
    const response = await callBackendToFetchContent();

    const notesArray = response.notes;

    if (!notesArray || notesArray.length === 0) {
      // console.log("No notes content provided to the display function");
      return false;
    }

    notesArray.sort(
      (a, b) => parseInt(a.createdAtId) - parseInt(b.createdAtId)
    );

    const fragment = document.createDocumentFragment();
    notesArray.forEach((note) => {
      const noteElement = createNoteElement(note, true);
      if (noteElement) fragment.appendChild(noteElement);
      noteElement.scrollIntoView({ behavior: "smooth", block: "end" });
    });

    const parent = document.querySelector(".dsThreadNotesContainer");

    if (parent) parent.appendChild(fragment);
    const lastChild = parent.lastElementChild;

    lastChild.scrollIntoView({ behavior: "smooth", block: "end" });
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return false;
  }
}

export function cleanAllNotesFromCurrentView() {
  const allNotes = document.querySelectorAll(".dsNoteContentContainer");

  if (allNotes.length === 0) {
    // console.log("There were no notes");
    return;
  }

  allNotes.forEach((note) => {
    note.remove();
  });
}

export async function createNote(content) {
  const noteObject = await sendNoteToBackend(content);

  createNoteElement(noteObject, false);

  return true;
}
