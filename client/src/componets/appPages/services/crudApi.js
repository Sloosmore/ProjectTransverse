export const fetchTaskRecords = async () => {
  const response = await fetch("/records-api/tasks", { method: "GET" });
  const data = await response.json();
  return data.records;
};

//Grabs Note Records and distingueshes if the note visble or not
export const fetchNoteRecords = async (visibleNotes, resume) => {
  if (visibleNotes === true) {
  } else {
  }
  const response = await fetch(
    `/records-api/notes?visibleNotes=${visibleNotes}&resume=${resume}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': 'Bearer ' + token // Uncomment this line if you need to send a token
      },
    }
  );
  const data = await response.json();
  return data.noteRecords;
};

//UP MARKDOWN
export const saveNoteMarkdown = async (id, markdown) => {
  const response = await fetch("/records-api/notes-markdown", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, markdown }),
  });
  const data = await response.json();
  console.log(data);
};

export const deactivateNotes = async () => {
  const response = await fetch("/records-api/notes-deactivate", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    //body: JSON.stringify({ id,  }),
  });
  const data = await response.json();
  return data.noteRecords;
};

//UP TITLE
export const updateTitle = async (id, title) => {
  const response = await fetch("/records-api/notes-title", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, title }),
  });
  const data = await response.json();
  console.log(data);
};

//UP VISIBILITY
export const updateVis = async (id, visible) => {
  const response = await fetch("/records-api/notes-visiblity", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, visible }),
  });
  const data = await response.json();
  console.log(data);
};

//DEL ID'd
export const deleteRecord = async (note_id) => {
  const response = await fetch(`/records-api/notes?note_id=${note_id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  console.log(data);
};
