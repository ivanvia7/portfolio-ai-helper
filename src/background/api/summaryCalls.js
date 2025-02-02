export async function sendSummaryContentToDatabase(
  content,
  creator,
  threadId,
  createdAtId
) {
  try {
    const response = await fetch(
      "http://localhost:4040/api/summaries/create-summary",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          creator,
          threadId,
          createdAtId,
        }),
      }
    );

    if (response.ok) {
      const status = await response.json();
      return status;
    } else {
      const errorDetails = await response.json();
      console.error("Server error:", errorDetails);
      throw new Error(
        `Failed to send note to database. Status: ${
          response.status
        }, Message: ${errorDetails.message || "Unknown error"}`
      );
    }
  } catch (e) {
    console.error("Error in sendNoteToDatabaseCall:", e.message || e);
    throw e;
  }
}

export async function fetchSummariesFromDatabase(creator, threadId) {
  try {
    const response = await fetch(
      "http://localhost:4040/api/summaries/fetch-summaries-content",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creator,
          threadId,
        }),
      }
    );

    if (response.ok) {
      const status = await response.json();
      return status;
    } else {
      const errorDetails = await response.json();
      console.error("Server error:", errorDetails);
      throw new Error(
        `Failed to fetch summaries from the database. Status: ${
          response.status
        }, Message: ${errorDetails.message || "Unknown error"}`
      );
    }
  } catch (e) {
    console.error("Error in fetchSummariesFromDatabase:", e.message || e);
    throw e;
  }
}

export async function deleteSummaryFromDatabase(creator, threadId, _id) {
  const response = await fetch(
    "http://localhost:4040/api/summaries/delete-summary",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creator, threadId, _id }),
    }
  );

  if (response.ok) {
    return true;
  } else {
    throw new Error("Failed to pass API to delete summary.");
  }
}
