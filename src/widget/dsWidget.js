import { assignListenersToAllButtons } from "./dsWidgetBtnListeners";
import { addLoginListenersToAllWidgetButtons } from "./dsWidgetBtnListeners";

export async function createCustomWidget() {
  // console.log("createCustomWidget Fired!");
  if (document.querySelector(".custom-widget")) return;
  deleteCustomWidget();

  const dashboard = document.createElement("div");
  dashboard.classList.add("custom-widget");

  const htmlFileUrl = chrome.runtime.getURL("widget.html");

  // console.log("Fetching HTML from:", htmlFileUrl);

  try {
    const response = await fetch(htmlFileUrl);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const htmlContent = await response.text();
    dashboard.innerHTML = htmlContent;

    document.body.appendChild(dashboard);
    return true;
  } catch (error) {
    // console.log(error.message);
  }
}

export async function deleteCustomWidget() {
  const customWidget = document.querySelector(".custom-widget");

  if (customWidget) {
    customWidget.remove();
  } else {
    return;
  }
}

export function widgetAuthListener() {
  const widget = document.querySelector("custom-widget");

  if (widget) {
    widget.addEventListener(
      "click",
      () => {
        callBkToTestServer()
          .then((response) => {
            if (!response) {
              removeListenersFromAllButtons();
              addLoginListenersToAllWidgetButtons();
            } else {
              // console.log(response);
              removeListenersFromAllButtons();
              assignListenersToAllButtons();
            }
          })
          .catch((error) => {
            console.error("Error during authentication:", error);
          });
      },
      { once: true }
    );
  } else {
    console.warn("custom-widget element not found!");
  }
}
