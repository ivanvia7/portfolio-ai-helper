import { fetchLocalHtml } from "./dsMainLogic";

export async function createCustomNotification(
  notifHeader = "Notification",
  notifText = "This is a default notification message.",
  success = true,
  mSeconds = 4000
) {
  const dsNotifAlert = document.createElement("div");

  const htmlFileUrl = chrome.runtime.getURL(`dsNotif.html`);

  try {
    dsNotifAlert.innerHTML = await fetchLocalHtml(htmlFileUrl);
  } catch (fetchError) {
    console.error("Error in fetching HTML for the dsNotif:", fetchError);
    return;
  }

  const alertHeader = dsNotifAlert.querySelector("#ds-alert-heading");
  const alertText = dsNotifAlert.querySelector("#ds-alert-text");
  const alertContainer = dsNotifAlert.querySelector("#ds-alert");

  if (alertHeader) alertHeader.textContent = notifHeader;
  if (alertText) alertText.textContent = notifText;

  if (success) {
    alertContainer?.classList.add("ds-alert-success");
  } else {
    alertContainer?.classList.add("ds-alert-error");
  }

  document.body.appendChild(dsNotifAlert);

  setTimeout(() => {
    dsNotifAlert.remove();
  }, mSeconds); // Show notification for 3 seconds
}
