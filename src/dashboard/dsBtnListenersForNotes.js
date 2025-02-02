import {
  callBkToDeleteNote,
  callBkToDeleteSummary,
} from "../content/messagesToBk";
import { extractWholeEmailThread } from "../content/aiFunctionalityUtils";

import { createNote } from "./dsNoteManipulation";
import { createSummary } from "./dsSummaryManipulation";
import { createCustomNotification } from "./dsNotifHandler";

export function setupListenersForNotesButtons() {
  const inputForm = document.getElementById("noteFormInput");

  if (!inputForm) {
    return;
  }

  inputForm.addEventListener("submit", handleNoteSubmit);
}

export function setupListenerForSummaryInput() {
  const summaryInputButton = document.querySelector("#SummarizeButton");

  if (!summaryInputButton) {
    return;
  }

  summaryInputButton.addEventListener("click", handleSummarySubmit);
}

async function handleSummarySubmit(event) {
  const button = document.getElementById("SummarizeButton");

  event.preventDefault();

  button.disabled = true;
  button.classList.add("disabled");

  // console.log(`summarySubmit was fired`);

  try {
    const summaryContent = await extractWholeEmailThread();

    // console.log(summaryContent);

    if (!summaryContent) {
      console.error("cannot find a suitable summary content");
      return;
    }

    createCustomNotification(
      "Your summary is being prepaired",
      "Please wait a couple of seconds, we are preparing your summary",
      true,
      3000
    );

    await createSummary(summaryContent);
  } finally {
    setTimeout(() => {
      button.disabled = false;
      button.classList.remove("disabled");
    }, 10000);
  }
}

async function handleNoteSubmit(event) {
  event.preventDefault();

  const noteContent = document.getElementById("newNoteInput").value.trim();

  if (!noteContent) {
    alert("You need to enter something in!");
    return;
  }

  await createNote(noteContent);

  //cleaning the input again
  document.getElementById("newNoteInput").value = "";
}

export function setupRemoveNoteHandler() {
  const notesContainer = document.querySelector(".dsThreadConentContainer");

  if (!notesContainer) {
    console.warn("Notes container not found");
    return;
  }

  notesContainer.addEventListener("click", deleteNoteListener);
}

export async function deleteNoteListener(event) {
  if (event.target.classList.contains("dsNoteRemoveButton")) {
    const noteToDelete = event.target.closest(".dsNoteContentContainer");
    const noteId = noteToDelete?.getAttribute("data-id");
    // console.log(noteId);
    await callBkToDeleteNote(noteId);
    await noteToDelete?.remove();
  }

  if (event.target.classList.contains("dsSummaryRemoveButton")) {
    const noteToDelete = event.target.closest(".dsSummaryContentContainer");
    const noteId = noteToDelete?.getAttribute("data-id");
    await callBkToDeleteSummary(noteId);
    await noteToDelete?.remove();
  }
}
