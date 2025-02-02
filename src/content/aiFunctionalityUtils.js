export async function extractWholeEmailThread() {
  const bodyElements = document.querySelectorAll(".a3s.aiL");
  if (bodyElements.length === 0) {
    console.warn("No email body elements found.");
    return "No email body found";
  }
  const lastBodyElement = bodyElements[bodyElements.length - 1];
  let bodyText = lastBodyElement.textContent || lastBodyElement.innerText;
  bodyText = bodyText.replace(/\s+/g, " ").trim();

  const preparedBodyText = await prepareTextContentForApi(bodyText);
  return preparedBodyText;
}

export function extractLastCopy() {
  const availableCopiesArray = document.querySelectorAll(
    'div.a3s.aiL > div[dir="ltr"]'
  );

  let targetCopy = availableCopiesArray[availableCopiesArray.length - 1];

  if (!targetCopy) {
    targetCopy = document.querySelector("div.a3s.aiL");
    const cleanedCopy = targetCopy?.textContent?.replace(/\n+/g, "") || "";
    // console.log(cleanedCopy);
    return cleanedCopy;
  }

  const cleanedContent = targetCopy.textContent?.replace(/\n+/g, "") || "";
  // console.log(cleanedContent);
  return cleanedContent;
}

export async function prepareTextContentForApi(text) {
  const sanitizedText = text.replace(/\[?d2hrhh04\.[^\s\]]+\]?/g, "");
  return sanitizedText.replace(/[\n\r]+/g, " ").trim();
}
