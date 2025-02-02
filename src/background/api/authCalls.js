import { fetchUserInfoUsingToken } from "../auth/authNewUser";

export async function refreshAccessToken(refreshToken, backendRefreshUrl) {
  try {
    const response = await fetch(`${backendRefreshUrl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (response.ok) {
      const tokens = await response.json();
      // console.log("New tokens received:", tokens);
      return tokens.access_token;
    } else {
      const errorText = await response.text();
      throw new Error(
        `Failed to refresh Access Token. Status: ${response.status}, Message: ${errorText}`
      );
    }
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
}

export async function fetchServerTest() {
  try {
    const response = await fetch(`http://localhost:4040/api/auth/login`, {
      method: "POST",
    });

    if (response.ok) {
      try {
        const responseInfo = await response.json();
        // console.log("Answer from the server on testCall:", responseInfo);
        return responseInfo;
      } catch (parseError) {
        throw new Error("Failed to parse server response as JSON.");
      }
    } else {
      const errorText = await response.text();
      throw new Error(
        `Failed to test call server. Status: ${response.status}, Message: ${errorText}`
      );
    }
  } catch (error) {
    console.warn("Error calling the server for a test:", error);
    throw error;
  }
}

export async function exchangeCodeForTokens(code) {
  const response = await fetch("http://localhost:4040/api/auth/exchange-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  if (response.ok) {
    const tokens = await response.json();

    const accessToken = tokens.access_token;

    const userInfo = await fetchUserInfoUsingToken(accessToken);

    const completeInfo = {
      ...tokens,
      userInfo,
    };

    chrome.storage.local.set({ access_token: tokens.access_token }, () => {
      // console.log("Access token saved.");
    });

    return completeInfo;
  } else {
    throw new Error("Failed to exchange authorization code.");
  }
}
