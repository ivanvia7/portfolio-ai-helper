import { checkStoredToken } from "./authUtils";

function removeCachedToken(token) {
  return new Promise((resolve, reject) => {
    chrome.identity.removeCachedAuthToken({ token: token }, function () {
      if (chrome.runtime.lastError) {
        reject(
          new Error("Error removing cached token: " + chrome.runtime.lastError)
        );
      } else {
        // console.log("Token removed from cache.");
        resolve();
      }
    });
  });
}

export async function removeStoredToken() {
  // console.log("removing the token");
  return new Promise((resolve) => {
    chrome.storage.local.remove("access_token", (result) => {
      resolve(result.access_token);
    });
  });
}

export async function logoutHandler() {
  try {
    const token = await checkStoredToken();

    await removeCachedToken(token);
    removeStoredToken();

    return true;
  } catch (error) {
    console.error("Error during logout:", error);
    return false;
  }
}
