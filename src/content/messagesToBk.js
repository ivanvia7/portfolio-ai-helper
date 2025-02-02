import { deleteAllDsScreens } from "../dashboard/dsMainLogic";
import { verifyIfActualEmailReal } from "../utils";
import { deleteCustomWidget } from "../widget/dsWidget";

import { extractThreadId, getActualDate } from "./hashHandler";

export async function callBackgroundToSummarize(cleanedEmail) {
  return new Promise((resolve, reject) => {
    const threadId = extractThreadId();
    const createdAtId = getActualDate();
    chrome.runtime.sendMessage(
      {
        action: "create-summary",
        noteText: cleanedEmail,
        threadId,
        createdAtId,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(
            new Error("Error in call to BK for callBackgroundToSummarize")
          );
        } else {
          // console.log(response);
          resolve(response);
        }
      }
    );
  });
}

export async function callBackgroundToWriteReply() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { action: "writeMessage", text: textToReplyTo },
      (response) => {
        if (chrome.runtime.lastError || !response) {
          reject(
            new Error(
              "Error in call to BK for callBackgroundToSummarize",
              chrome.runtime.lastError.message
            )
          );
        } else {
          // console.log(response);
          resolve(response);
        }
      }
    );
  });
}

export function callBkToAuthenticate() {
  chrome.runtime.sendMessage(
    {
      action: "get-user-data",
    },
    (response) => {
      // console.log("Response from Background.js:", response);
    }
  );
}

export function callBkToAuth() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: "user-auth" }, (response) => {
      if (chrome.runtime.lastError || !response) {
        reject(new Error("Error in call to BK for LoginCheck"));
      } else {
        // console.log(response, "response from callBkToAuth");
        verifyIfActualEmailReal(response.user.email);
        resolve(response);
      }
    });
  });
}

export function callBkToVerifyAuth() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { action: "user-auth-status-check" },
      (response) => {
        if (chrome.runtime.lastError || !response) {
          // console.log("No response or error in BK LoginCheck");
          resolve(false);
        } else {
          // console.log(response, "response from callBkToVerifyAuth");
          verifyIfActualEmailReal(response.email);
          resolve(response);
        }
      }
    );
  });
}

export async function callBkToLogout() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: "user-logout" }, (response) => {
      if (chrome.runtime.lastError || !response) {
        // console.log("No response or error in BK Logout function");
        resolve(null);
      } else {
        // console.log(`deleting the listeners from widget buttons`);
        deleteCustomWidget();
        deleteAllDsScreens();

        resolve(true);
      }
    });
  });
}

export async function sendNoteToBackend(content) {
  return new Promise((resolve, reject) => {
    const id = extractThreadId();
    const createdAtId = getActualDate();
    chrome.runtime.sendMessage(
      { action: "create-note", noteText: content, threadId: id, createdAtId },
      (response) => {
        if (chrome.runtime.lastError || !response) {
          // console.log("No response or error in sendNoteToBackend function");
          resolve(null);
        } else {
          resolve(response);
        }
      }
    );
  });
}

export async function callBackendToFetchContent(type = "notes") {
  return new Promise((resolve, reject) => {
    const id = extractThreadId();
    chrome.runtime.sendMessage(
      { action: `get-${type}-content`, threadId: id },
      (response) => {
        // console.log(response);
        if (chrome.runtime.lastError || !response) {
          // console.log(
          //   "No response or error in callBackendToFetchContent function"
          // );
          reject(new Error("Failed to fetch content"));
        } else {
          resolve(response);
        }
      }
    );
  });
}

export async function callBkToDeleteNote(contentId) {
  return new Promise((resolve, reject) => {
    const threadId = extractThreadId();
    const _id = contentId;
    chrome.runtime.sendMessage(
      {
        action: `delete-note`,
        threadId,
        _id,
      },
      (response) => {
        // console.log(response);
        if (chrome.runtime.lastError || !response) {
          // console.log("No response or error in callBkToDeleteNote");
          reject(new Error("Failed to deleteNote"));
        } else {
          resolve(response);
        }
      }
    );
  });
}

export async function callBkToDeleteSummary(contentId) {
  return new Promise((resolve, reject) => {
    const threadId = extractThreadId();
    const _id = contentId;
    chrome.runtime.sendMessage(
      {
        action: `delete-summary`,
        threadId,
        _id,
      },
      (response) => {
        // console.log(response);
        if (chrome.runtime.lastError || !response) {
          // console.log("No response or error in callBkToDeleteSummary");
          reject(new Error("Failed to deleteSummary"));
        } else {
          resolve(response);
        }
      }
    );
  });
}
