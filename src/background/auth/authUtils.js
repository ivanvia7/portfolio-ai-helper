import { fetchUserInfoUsingToken } from "./authNewUser";

export function saveToken(access_token) {
  chrome.storage.local.set(access_token, () => {
    // console.log("Token saved", access_token);
    return true;
  });
}

export function formatUserObject(apiReceivedObject) {
  const { access_token, refresh_token, userInfo } = apiReceivedObject;

  const cleanUserObject = {
    accessToken: access_token,
    name: userInfo.name,
    googleUserId: userInfo.sub,
    email: userInfo.email,
    ...(refresh_token && { refreshToken: refresh_token }),
  };

  return cleanUserObject;
}

export async function checkStoredToken() {
  // console.log("checking the token");
  return new Promise((resolve) => {
    chrome.storage.local.get("access_token", (result) => {
      resolve(result.access_token);
    });
  });
}

export async function deleteStoredAccessToken(existingToken) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove("access_token", () => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(true);
    });
  });
}

export async function getUserGoogleId() {
  const existingAccessToken = await checkStoredToken();
  const userObject = await fetchUserInfoUsingToken(existingAccessToken);
  const googleId = userObject.sub;

  // console.log(googleId, "from getUserGoogleId");
  return googleId;
}
