import { checkStoredToken, formatUserObject } from "./authUtils";
import { getAuthorizationCode, fetchUserInfoUsingToken } from "./authNewUser";

export async function authHandler() {
  try {
    const existingToken = await checkStoredToken();

    if (!existingToken) {
      const userObject = await getAuthorizationCode();
      return formatUserObject(userObject);
    }

    const userInfo = await fetchUserInfoUsingToken(existingToken);
    if (userInfo) {
      return formatUserObject({ access_token: existingToken, userInfo });
    } else {
      const newUserObject = await getAuthorizationCode();
      return formatUserObject(newUserObject);
    }
  } catch (error) {
    console.error("Error in authHandler:", error);
    throw new Error("Authentication failed. Please try again.");
  }
}

export async function logggedInCheckHandler() {
  try {
    const existingToken = await checkStoredToken();

    if (!existingToken) {
      // console.log("No existing token found.");
      return false;
    }

    const userInfo = await fetchUserInfoUsingToken(existingToken);

    if (userInfo) {
      // console.log("Token is valid and user info retrieved.");
      return formatUserObject({ access_token: existingToken, userInfo });
    }

    // console.log("Token seems invalid, checking in the database...");
    const databaseCheckResult = await databaseExistingTokenCheck(existingToken);

    if (databaseCheckResult === false) {
      // console.log("No matching user found in the database.");
      return false;
    }

    // console.log("User found in the database, returning user info.");
    return databaseCheckResult;
  } catch (e) {
    console.error("Error in logggedInCheckHandler:", e);
    throw new Error("An error occurred while checking login status.");
  }
}

export async function databaseExistingTokenCheck(existingAccessToken) {
  try {
    const response = await fetch(
      "http://localhost:4040/api/auth/user-token-control",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: existingAccessToken }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Database check failed with status ${response.status}: ${response.statusText}`
      );
    }

    const checkResult = await response.json();

    if (checkResult !== false) {
      // console.log("User found in the database:", checkResult);

      chrome.storage.local.set(
        { access_token: checkResult.access_token },
        () => {
          // console.log("Access token updated in local storage.");
        }
      );

      return checkResult;
    }

    // console.log("No user found in the database with the given token.");
    return false;
  } catch (error) {
    console.error("Error in databaseExistingTokenCheck:", error);
    throw error;
  }
}

export async function checkExistingUser(userObject) {
  try {
    const response = await fetch("http://localhost:4040/api/users/user-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userObject),
    });

    if (!response.ok) {
      throw new Error(
        `Database check failed with status ${response.status}: ${response.statusText}`
      );
    }

    const checkResult = await response.json();

    if (checkResult === false) {
      // console.log("User not found in the database.");
      return null;
    }

    chrome.storage.local.set({ access_token: checkResult.access_token }, () => {
      // console.log("Access token updated in local storage.");
    });

    return checkResult;
  } catch (e) {
    console.error("Error in checkExistingUser:", e);
    throw e;
  }
}
