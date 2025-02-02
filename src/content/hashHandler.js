import { isValidMessageId } from "../utils.js";
import { setupObserver } from "./observer.js";
import { deleteCustomWidget, widgetAuthListener } from "../widget/dsWidget.js";
import { deleteAllDsScreens } from "../dashboard/dsMainLogic.js";

export function handleHashChange() {
  if (isValidMessageId(location.hash)) {
    setupObserver();
  } else {
    if (window.observer) window.observer.disconnect();
    deleteCustomWidget();
    deleteAllDsScreens();
    // console.log("Hash is not valid for button creation");
  }
}

// Listen for hash changes
window.addEventListener("hashchange", handleHashChange);
handleHashChange();

export function extractThreadId() {
  const hash = location.hash;
  const id = hash.split("/")[1];
  return id;
}

export function getActualDate() {
  const date = new Date().getTime();
  return date;
}
