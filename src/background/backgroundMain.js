import { getUserGoogleId } from "./auth/authUtils";
import { authHandler } from "./auth/authHandlersLogic";
import {
  logggedInCheckHandler,
  checkExistingUser,
} from "./auth/authHandlersLogic";
import {
  sendNoteToDatabase,
  fetchNotesFromDatabase,
  deleteNoteFromDatabase,
} from "./api/noteCalls";

import {
  deleteSummaryFromDatabase,
  sendSummaryContentToDatabase,
} from "./api/summaryCalls";

import { logoutHandler } from "./auth/authLogout";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action } = message;

  if (action === "user-auth") {
    authHandler()
      .then((result) => {
        if (result) {
          // console.log(result);
          return checkExistingUser(result).then((resultOfCheck) => {
            // console.log(resultOfCheck);
            sendResponse(resultOfCheck);
          });
        } else {
          sendResponse(true);
        }
      })
      .catch((error) => {
        console.error("Error in authorization", error);
        sendResponse(false);
      });

    return true;
  }

  if (action === "create-note") {
    (async () => {
      try {
        const content = message.noteText;
        const threadId = message.threadId;
        const createdAtId = message.createdAtId;
        const creator = await getUserGoogleId();

        const result = await sendNoteToDatabase(
          content,
          creator,
          threadId,
          createdAtId
        );

        if (result) {
          // console.log(result);
          sendResponse(result);
        } else {
          sendResponse(false);
        }
      } catch (error) {
        console.error("create-note action handler", error);
        sendResponse(false);
      }
    })();

    return true;
  }

  if (action === "get-notes-content") {
    (async () => {
      try {
        const threadId = message.threadId;
        const creator = await getUserGoogleId();

        const result = await fetchNotesFromDatabase(creator, threadId);

        if (result) {
          sendResponse(result);
        } else {
          sendResponse(false);
        }
      } catch (error) {
        // console.log(error, "new error in get-notes-content");
        sendResponse(false);
      }
    })();

    return true;
  }

  if (action === "get-summaries-content") {
    (async () => {
      try {
        const threadId = message.threadId;
        const creator = await getUserGoogleId();

        const result = await fetchNotesFromDatabase(
          creator,
          threadId,
          "summaries"
        );

        if (result) {
          sendResponse(result);
        } else {
          sendResponse(false);
        }
      } catch (error) {
        console.error("get-summaries-content", error);
        sendResponse(false);
      }
    })();

    return true;
  }

  if (action === "create-summary") {
    (async () => {
      try {
        const content = message.noteText;
        const threadId = message.threadId;
        const createdAtId = message.createdAtId;
        const creator = await getUserGoogleId();

        const result = await sendSummaryContentToDatabase(
          content,
          creator,
          threadId,
          createdAtId
        );

        if (result) {
          // console.log(result);
          sendResponse(result);
        } else {
          sendResponse(false);
        }
      } catch (error) {
        // console.error("create-note action handler", error);
        sendResponse(false);
      }
    })();

    return true;
  }

  if (action === "user-logout") {
    logoutHandler()
      .then((result) => {
        if (result === true) {
          // console.log("userData is logged out");
          sendResponse("true");
        } else {
          // console.log("userData cannot be logged out", result);
          sendResponse("false");
        }
      })
      .catch((error) => {
        console.error("Error in loggin out", error);
        sendResponse("false");
      });

    return true;
  }

  if (action === "user-auth-status-check") {
    logggedInCheckHandler()
      .then((result) => {
        // console.log(result);

        sendResponse(result);
      })
      .catch((error) => {
        console.error("Error in loggin out", error);
        sendResponse("false");
      });

    return true;
  }

  if (action === "delete-note") {
    (async () => {
      try {
        const threadId = message.threadId;
        const _id = message._id;
        const creator = await getUserGoogleId();

        const result = await deleteNoteFromDatabase(creator, threadId, _id);

        if (result) {
          sendResponse({ success: true }); // Send an object for clarity
        } else {
          sendResponse({ success: false, error: "Failed to delete note" });
        }
      } catch (error) {
        console.error("delete-note action handler", error);
        sendResponse({ success: false, error: error.message });
      }
    })();

    return true;
  }

  if (action === "delete-summary") {
    (async () => {
      try {
        const threadId = message.threadId;
        const _id = message._id;
        const creator = await getUserGoogleId();

        const result = await deleteSummaryFromDatabase(creator, threadId, _id);

        if (result) {
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false, error: "Failed to delete note" });
        }
      } catch (error) {
        console.error("delete-summary action handler", error);
        sendResponse({ success: false, error: error.message });
      }
    })();

    return true;
  }
});
