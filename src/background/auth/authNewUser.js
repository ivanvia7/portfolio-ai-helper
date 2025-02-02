import { deleteStoredAccessToken } from "./authUtils";
import { exchangeCodeForTokens } from "../api/authCalls";

export async function getAuthorizationCode(showLogin = true) {
  const clientId =
    "725102550598-u9jt1h2c6g87g797naksuh79a4kteuia.apps.googleusercontent.com";
  const redirectUri = `https://${chrome.runtime.id}.chromiumapp.org/`;
  const scope = "profile email";
  const responseType = "code";

  const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&response_type=${responseType}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(
    scope
  )}&prompt=select_account&access_type=offline`;

  const authorizationCode = await new Promise((resolve, reject) => {
    chrome.identity.launchWebAuthFlow(
      { url: authUrl, interactive: showLogin },
      (callbackUri) => {
        if (chrome.runtime.lastError) {
          console.warn("OAuth Flow Error:", chrome.runtime.lastError.message);
          return reject(new Error(chrome.runtime.lastError.message));
        }

        if (!callbackUri) {
          console.warn("No callback URI received.");
          return reject(new Error("No callback URI received."));
        }

        try {
          const urlParams = new URLSearchParams(new URL(callbackUri).search);
          const authorizationCode = urlParams.get("code");

          if (authorizationCode) {
            // console.log("Authorization code acquired:", authorizationCode);
            resolve(authorizationCode);
          } else {
            console.warn("No authorization code found in the redirect URI.");
            reject(
              new Error("No authorization code found in the redirect URI.")
            );
          }
        } catch (error) {
          console.warn("Error parsing callback URI:", error);
          reject(new Error("Error parsing callback URI"));
        }
      }
    );
  });

  const completeInfoObject = await exchangeCodeForTokens(authorizationCode);

  return completeInfoObject;
}

export async function fetchUserInfoUsingToken(token) {
  try {
    // console.log(token);
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.status === 401) {
      console.warn("Unauthorized (401): Token might be expired or invalid.");
      deleteStoredAccessToken(token);
      return null;
    }

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(
        `API error: ${response.status} ${response.statusText}. Details: ${errorDetails}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw new Error(`Failed to fetch user info: ${error.message}`);
  }
}
