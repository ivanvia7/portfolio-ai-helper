export function formatDate(dateId) {
  const timestamp = parseInt(dateId);
  if (isNaN(timestamp)) {
    console.error("Invalid timestamp:", dateId);
    return "Invalid date";
  }

  const date = new Date(timestamp);
  const formattedDate = `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}, ${date.getDate().toString().padStart(2, "0")}.${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}.${date.getFullYear()}`;

  return formattedDate;
}

export async function createStatusScreen(statusMessage) {
  try {
    keepAllDsScreensClosed();

    let dashboard = document.querySelector(`.${pageName}`);

    if (dashboard) {
      if (pageName === "dsNotes") {
        await displayNotesToDashboard();
        makeDsVisible(pageName);
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
      await displayNotesToDashboard();
    }

    if (pageName === "dsSummary") {
      await displaySummariesToDashboard();
    }

    // Set up event listeners for the new page
    setupListenersForNotesButtons();
    setupRemoveNoteHandler();
    setupDashboardCloseHandler();

    if (pageName === "dsLogin") {
      addLoginButtonListener();
    }

    if (pageName === "dsOptions") {
      assignOptionButtonHandlers();
    }

    // Make the newly created page visible
    makeDsVisible(pageName);
  } catch (error) {
    console.error("Error creating dashboard page:", error);
  }
}
