import { callBkToLogout } from "./content/messagesToBk";
import { deleteAllDsScreens } from "./dashboard/dsMainLogic";
import { createCustomNotification } from "./dashboard/dsNotifHandler";
import { createCustomWidget } from "./widget/dsWidget";
import { addLoginListenersToAllWidgetButtons } from "./widget/dsWidgetBtnListeners";

// utils.js
export function isValidMessageId(hash) {
  const messageIdPattern = /^#[A-Za-z]+\/[A-Za-z0-9]+$/;
  return messageIdPattern.test(hash);
}

export async function getUIEmail() {
  const accountElement = document.querySelector(
    'a[aria-label^="Google Account:"]'
  );

  const ariaLabel = accountElement.getAttribute("aria-label");

  const emailMatch = ariaLabel.match(/\(([^)]+)\)/);

  return emailMatch;
}

export async function verifyIfActualEmailReal(fetchedEmail) {
  // console.log("fetchedEmail is here:", fetchedEmail);
  const accountElement = document.querySelector(
    'a[aria-label^="Google Account:"]'
  );

  const ariaLabel = accountElement.getAttribute("aria-label");

  const emailMatch = ariaLabel.match(/\(([^)]+)\)/);

  if (emailMatch) {
    const email = emailMatch[1]; // The email is in the first captured group

    // console.log("Checked the email in UI", email);

    if (email === fetchedEmail) {
      return true;
    } else {
      deleteAllDsScreens();
      await callBkToLogout();
      createCustomNotification(
        "Wrong Account",
        "You were automatically logged out because your current Gmail account doesn't match the account you selected in login screen. Please make sure that you are selecting the same one you are planning to open Gmail with.",
        false,
        5000
      );
      await createCustomWidget();
      addLoginListenersToAllWidgetButtons();
      return false;
    }
  } else {
    console.log("No email found.");
    return;
  }
}
