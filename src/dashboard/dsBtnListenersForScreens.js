import {
  addLoginListenersToAllWidgetButtons,
  locateButton,
} from "../widget/dsWidgetBtnListeners";
import { callBkToLogout } from "../content/messagesToBk";
import { createCustomWidget } from "../widget/dsWidget";
import { createCustomNotification } from "./dsNotifHandler";

const BUTTON_IDS_FROM_DS_SCREENS = {
  logout: "logoutOptionsButton",
  upgrade: "uprgadeOptionsButton",
  archive: "archiveOptionsButton",
};

const OPTION_BUTTON_HANDLERS = {
  logout: handleLogout,
  upgrade: handleUpgrade,
  archive: handleArchive,
};

export function assignOptionButtonHandlers() {
  Object.entries(BUTTON_IDS_FROM_DS_SCREENS).forEach(([key, buttonId]) => {
    const button = locateButton(buttonId);
    const handler = OPTION_BUTTON_HANDLERS[key];

    if (button && handler) {
      button.addEventListener("click", handler);
    } else {
      console.warn(`Handler or button not found for key: ${key}`);
    }
  });
}

export function removeOptionButtonHandlers() {
  Object.entries(BUTTON_IDS_FROM_DS_SCREENS).forEach(([key, buttonId]) => {
    const button = locateButton(buttonId);
    const handler = OPTION_BUTTON_HANDLERS[key];

    if (button && handler) {
      button.removeEventListener("click", handler);
    } else {
      console.warn(`Handler or button not found for key: ${key}`);
    }
  });
}

async function handleLogout(event) {
  try {
    console.log("Logging out...");
    const result = await callBkToLogout();

    createCustomNotification(
      "You are logged out",
      "Please reload the page if you would like to log in again.",
      true,
      3000
    );

    if (result === true) {
      await createCustomWidget();
      addLoginListenersToAllWidgetButtons();
    }
  } catch (e) {
    console.error("Error in handleLogout:", e);
  }
}

async function handleUpgrade(event) {
  try {
    // console.log("Upgrading to premium...");
    const result = await callBkToTestServer();
    // console.log(result);
    return result;
  } catch (e) {
    console.error("Error in handleUpgrade:", e);
  }
}

function handleArchive(event) {
  try {
    // console.log("Archiving...");
  } catch (e) {
    console.error("Error in handleArchive:", e);
  }
}
