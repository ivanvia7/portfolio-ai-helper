import { addLoginButtonListener } from "../dashboard/dsBtnListenersForLogin";
import { createDashboardHandler } from "../dashboard/dsMainLogic";
import { createCustomNotification } from "../dashboard/dsNotifHandler";

const BUTTON_IDS = {
  notes: "widgetWriteNoteButton",
  archive: "widgetOpenArchiveButton",
  summary: "widgetCreateSummaryButton",
};

const PAGE_HANDLERS = {
  dsNotes: createListenerForPage.bind(null, "dsNotes"),
  dsOptions: createListenerForPage.bind(null, "dsOptions"),
  dsSummary: createListenerForPage.bind(null, "dsSummary"),
};

export function createLoginPageForButton(buttonId) {
  const button = locateButton(buttonId);
  if (!button) return;
  button.addEventListener("click", loginButtonListener);
}

function loginButtonListener() {
  const dsLogin = document.querySelector(".dsLogin");
  try {
    if (!dsLogin) {
      createDashboardHandler("dsLogin");
    } else {
      const dsPage = document.querySelector(".dsPage.dsHidden");
      if (dsPage) {
        dsPage.classList.remove("dsHidden");
      } else {
        return;
      }
    }
  } catch (e) {
    console.error("Error in loginButtonListener:", e);
  }
}

export function locateButton(buttonId) {
  const button = document.querySelector(`#${buttonId}`);
  if (!button) console.warn(`Button with ID "${buttonId}" not found.`);
  return button;
}

export function assignPageToButton(buttonId, pageKey) {
  const button = locateButton(buttonId);
  if (!button || !PAGE_HANDLERS[pageKey]) return;
  button.addEventListener("click", PAGE_HANDLERS[pageKey]);
}

export function removePageFromButton(buttonId, pageKey) {
  const button = locateButton(buttonId);
  if (!button || !PAGE_HANDLERS[pageKey]) return;
  button.removeEventListener("click", PAGE_HANDLERS[pageKey]);
}

export function addLoginListenersToAllWidgetButtons() {
  Object.values(BUTTON_IDS).forEach(createLoginPageForButton);
}

export function removeLoginListenersFromAllWidgetButtons() {
  Object.values(BUTTON_IDS).forEach((buttonId) =>
    deleteLoginListener(buttonId)
  );
}

function deleteLoginListener(buttonId) {
  const button = locateButton(buttonId);
  if (!button) return;
  button.removeEventListener("click", loginButtonListener);
}

export function assignListenersToAllButtons() {
  try {
    assignPageToButton(BUTTON_IDS.notes, "dsNotes");
    assignPageToButton(BUTTON_IDS.archive, "dsOptions");
    assignPageToButton(BUTTON_IDS.summary, "dsSummary");
  } catch (e) {
    console.error("Error in assignListenersToAllButtons:", e);
  }
}

export function createListenerForPage(pageKey, event) {
  try {
    createDashboardHandler(pageKey);
  } catch (e) {
    console.error(`Error in createListenerForPage (${pageKey}):`, e);
  }
}

export function handleLoginTransition() {
  const loginPage = document.querySelector("#dsLogin");
  // const notesButton = document.querySelector("#widgetWriteNoteButton");

  if (loginPage) {
    loginPage.remove();
  }

  removeLoginListenersFromAllWidgetButtons();
  assignListenersToAllButtons();
}
