import {
  callBackendToFetchContent,
  callBackgroundToSummarize,
} from "../content/messagesToBk";
import { formatDate } from "./dsUtils.js";
import { createDashboardPage, makeDsVisible } from "./dsMainLogic";
import { deleteNoteListener } from "./dsBtnListenersForNotes.js";

export function cleanAllSummariesFromCurrentView() {
  const allSummaries = document.querySelectorAll(".dsNoteSummaryContainer");

  if (allSummaries.length === 0) {
    // console.log("There were no summaries");
    return;
  }

  allSummaries.forEach((note) => {
    note.remove();
  });
}

export function createSummaryElement(summaryObject, fragmentAppend = false) {
  const parent = document.querySelector(".dsThreadSummariesContainer");

  if (
    !summaryObject.content ||
    !summaryObject.createdAtId ||
    !summaryObject._id
  ) {
    console.error("Invalid summary data");
    return null;
  }

  const summaryContainer = document.createElement("div");
  summaryContainer.classList.add("dsContentBuble", "dsSummaryContentContainer");

  summaryContainer.setAttribute("data-id", summaryObject._id);

  const textElement = document.createElement("div");
  textElement.classList.add("dsBubleTextContent");
  textElement.textContent = summaryObject.content;

  const summaryLabel = document.createElement("div");
  summaryLabel.classList.add("dsBubleLabel");

  const dateElement = document.createElement("div");
  dateElement.classList.add("dsNoteDate");
  dateElement.textContent = formatDate(summaryObject.createdAtId);

  const separator = document.createElement("div");
  separator.textContent = "|";

  const removeNoteButton = document.createElement("div");
  removeNoteButton.classList.add("dsSummaryRemoveButton");
  removeNoteButton.textContent = "Remove";
  removeNoteButton.addEventListener("click", deleteNoteListener);

  summaryLabel.appendChild(dateElement);
  summaryLabel.appendChild(separator);
  summaryLabel.appendChild(removeNoteButton);

  summaryContainer.appendChild(textElement);
  summaryContainer.appendChild(summaryLabel);

  if (fragmentAppend === false) {
    parent.appendChild(summaryContainer);
    summaryContainer.scrollIntoView({ behavior: "smooth", block: "end" });
    return summaryContainer;
  } else {
    return summaryContainer;
  }
}

export async function displaySummariesToDashboard() {
  cleanAllSummariesFromCurrentView();
  try {
    const response = await callBackendToFetchContent("summaries");

    const summariesArray = response.summaries;

    if (!summariesArray || summariesArray.length === 0) {
      //   console.return("No summaries content provided to the display function");
      return false;
    }

    summariesArray.sort(
      (a, b) => parseInt(a.createdAtId) - parseInt(b.createdAtId)
    );

    const fragment = document.createDocumentFragment();
    summariesArray.forEach((summary) => {
      const summaryElement = createSummaryElement(summary, true);
      if (summaryElement) fragment.appendChild(summaryElement);
      summaryElement.scrollIntoView({ behavior: "smooth", block: "end" });
    });

    const parent = document.querySelector(".dsThreadSummariesContainer");

    if (parent) parent.appendChild(fragment);
    const lastChild = parent.lastElementChild;

    lastChild.scrollIntoView({ behavior: "smooth", block: "end" });
  } catch (error) {
    console.error("Failed to fetch summaries:", error);
    return false;
  }
}

export async function createSummary(content) {
  const summaryObject = await callBackgroundToSummarize(content);

  createSummaryElement(summaryObject, false);

  return true;
}

export async function handleNewSummaryAppend() {
  const dsSummaryPage = document.querySelector("#dsSummary");

  if (dsSummaryPage) {
    makeDsVisible("dsSummary");
    displaySummariesToDashboard();
  } else {
    await createDashboardPage("dsSummary");
  }
}
