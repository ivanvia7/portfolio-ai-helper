const DASHBOARD_CLASS = "dsPage";
const HIDDEN_CLASS = "dsHidden";
const CLOSE_BUTTON_CLASSES = ["dsCloseButtonContainer", "dsCloseButtonSvg"];

import {
  setupListenerForSummaryInput,
  setupListenersForNotesButtons,
  setupRemoveNoteHandler,
} from "./dsBtnListenersForNotes";

import { displayNotesToDashboard } from "./dsNoteManipulation";

import { addLoginButtonListener } from "./dsBtnListenersForLogin";
import { assignOptionButtonHandlers } from "./dsBtnListenersForScreens";
import { displaySummariesToDashboard } from "./dsSummaryManipulation";
import { getUIEmail } from "../utils";

// Function to create a new dashboard page
export async function createDashboardPage(pageName) {
  try {
    keepAllDsScreensClosed();

    let dashboard = document.querySelector(`.${pageName}`);

    if (dashboard) {
      if (pageName === "dsNotes") {
        await displayNotesToDashboard();
        makeDsVisible(pageName);
        return;
      } else if (pageName === "dsSummary") {
        makeDsVisible(pageName);
        await displaySummariesToDashboard();
        return;
      } else {
        makeDsVisible(pageName);
        return;
      }
    }

    dashboard = document.createElement("div");

    const htmlFileUrl = chrome.runtime.getURL(`${pageName}.html`);

    try {
      dashboard.innerHTML = await fetchLocalHtml(htmlFileUrl);
    } catch (fetchError) {
      console.error("Error fetching HTML:", fetchError);
      return;
    }

    document.body.appendChild(dashboard);

    if (pageName === "dsNotes") {
      // console.log("awaitng callBackendToFetchNotesContent");
      await displayNotesToDashboard();
      setupRemoveNoteHandler();
      setupListenersForNotesButtons();
    }

    if (pageName === "dsSummary") {
      // console.log("awaitng callBackendToFetchSummaryContent");
      await displaySummariesToDashboard();
      setupListenerForSummaryInput();
    }

    setupDashboardCloseHandler();

    if (pageName === "dsLogin") {
      addLoginButtonListener();
    }

    if (pageName === "dsOptions") {
      assignOptionButtonHandlers();
      const emailtoShow = document.querySelector("#options-label-placeholder");
      const uiEmailArray = await getUIEmail();
      emailtoShow.textContent = uiEmailArray[1];
    }

    makeDsVisible(pageName);
  } catch (error) {
    console.error("Error creating dashboard page:", error);
  }
}

export async function fetchLocalHtml(htmlFileUrl) {
  try {
    const response = await fetch(htmlFileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch HTML. Status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error("Error fetching local HTML:", htmlFileUrl, error);
    throw error;
  }
}

export function setupDashboardCloseHandler() {
  const dashboards = document.querySelectorAll(`.${DASHBOARD_CLASS}`);

  if (!dashboards.length) {
    console.warn("No dashboards found");
    return;
  }

  dashboards.forEach((page) => {
    page.addEventListener("click", (event) => {
      if (
        CLOSE_BUTTON_CLASSES.some((cls) => event.target.classList.contains(cls))
      ) {
        page.classList.add(HIDDEN_CLASS);
      }
    });
  });
}

export function makeDsVisible(dsName) {
  const dashboard = document.querySelector(`#${dsName}`);

  if (!dashboard) {
    console.warn("Cannot find the dashboard:", dsName);
    return;
  }

  dashboard.classList.remove(HIDDEN_CLASS); // Make the page visible
}

export function createDashboardHandler(dsName) {
  keepAllDsScreensClosed();

  const dsHtml = document.querySelector(`#${dsName}`);

  if (dsHtml) {
    makeDsVisible(dsName);
  } else {
    createDashboardPage(dsName);
  }
}

export function keepAllDsScreensClosed() {
  try {
    const allScreens = document.querySelectorAll(".dsPage");
    allScreens.forEach((screen) => {
      if (!screen.classList.contains(HIDDEN_CLASS)) {
        screen.classList.add(HIDDEN_CLASS);
      }
    });
  } catch (e) {
    console.error("Error in keepAllDsScreensClosed:", e);
  }
}

export function deleteAllDsScreens() {
  try {
    const allScreens = document.querySelectorAll(".dsPage");
    allScreens.forEach((screen) => {
      screen.remove();
    });
  } catch (e) {
    console.error("Error in deleteAllDsScreens:", e);
  }
}
