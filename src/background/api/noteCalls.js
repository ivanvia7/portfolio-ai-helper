export async function sendNoteToDatabase(
  content,
  creator,
  threadId,
  createdAtId
) {
  try {
    const response = await fetch(
      "http://localhost:4040/api/notes/create-note",
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

export async function fetchNotesFromDatabase(
  creator,
  threadId,
  mode = "notes"
) {
  try {
    const response = await fetch(
      `http://localhost:4040/api/${mode}/fetch-${mode}-content`,
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
      // console.log("response from fetchNotesFromDatabase", response);
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

export async function deleteNoteFromDatabase(creator, threadId, _id) {
  const response = await fetch("http://localhost:4040/api/notes/delete-note", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ creator, threadId, _id }),
  });

  console.log(response);
  console.log("passing the data", creator, threadId, _id);

  if (response.ok) {
    const status = await response.json();

    return true;
  } else {
    throw new Error("Failed to pass API to delete note.");
  }
}
