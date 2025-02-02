import { createCustomWidget } from "../widget/dsWidget.js";
import { callBkToVerifyAuth } from "./messagesToBk.js";
import {
  assignListenersToAllButtons,
  addLoginListenersToAllWidgetButtons,
} from "../widget/dsWidgetBtnListeners.js";

export async function setupObserver() {
  if (window.observer) {
    window.observer.disconnect();
    window.observer = null;
  }

  const getEmailContainer = async () => {
    return new Promise((resolve) => {
      const checkEmailContainer = async () => {
        const emailContainer = document.querySelector('[role="main"]');

        if (emailContainer) {
          if (!document.querySelector(".custom-widget")) {
            try {
              await createCustomWidget();
            } catch (error) {
              console.error("Error creating custom widget:", error);
            }

            try {
              const authStatus = await callBkToVerifyAuth();
              // console.log(authStatus, "authStatus in observer");

              if (authStatus === false || authStatus === "") {
                addLoginListenersToAllWidgetButtons();
              } else {
                assignListenersToAllButtons();
              }
            } catch (e) {
              console.error(
                "Error in the authStatus checking inside handleHashChange:",
                e
              );
            }
          }

          resolve(emailContainer);
        } else {
          requestAnimationFrame(checkEmailContainer);
        }
      };

      checkEmailContainer();
    });
  };

  await getEmailContainer();
}
