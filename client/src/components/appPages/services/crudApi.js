/*export const fetchTaskRecords = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/records-api/tasks`,
    { method: "GET" }
  );
  const data = await response.json();
  return data.records;
};*/

//Grabs Note Records and distingueshes if the note visble or not
export const fetchNoteRecords = async (session, visibleNotes, resume) => {
  const token = session.access_token;
  // if !resume deactivate records
  const response = await fetch(
    `${
      import.meta.env.VITE_BASE_URL
    }/records-api/notes?visibleNotes=${visibleNotes}&resume=${resume}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  );
  const data = await response.json();
  return data.noteRecords;
};

export const deactivateNotes = async (session) => {
  const token = session.access_token;
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/records-api/notes-deactivate`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      //body: JSON.stringify({ id,  }),
    }
  );
  const data = await response.json();
  return data.noteRecords;
};

//UP MARKDOWN (no auth needed for MVP)
export const saveNoteMarkdown = async (note_id, markdown, json_content) => {
  console.log(note_id);
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/records-api/notes-markdown`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ note_id, markdown, json_content }),
    }
  );
  const data = await response.json();
  console.log(data);
};

//UP TITLE (no auth needed for MVP)
export const updateTitle = async (note_id, title) => {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/records-api/notes-title`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ note_id, title }),
    }
  );
  const data = await response.json();
  console.log(data);
};

//UP VISIBILITY (no auth needed for MVP)
export const updateVis = async (note_id, visible) => {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/records-api/notes-visiblity`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ note_id, visible }),
    }
  );
  const data = await response.json();
  console.log(data);
};

//DEL ID'd (no auth needed for MVP)
export const deleteRecord = async (note_id) => {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/records-api/notes?note_id=${note_id}`,
    {
      method: "DELETE",
    }
  );
  const data = await response.json();
  console.log(data);
};

export const createFolder = async (session) => {
  const token = session.access_token;
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/records-api/folders`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  );
  const data = await response.json();
  console.log(data);
  return data;
};

export const fetchFolders = async (session) => {
  const token = session.access_token;
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/records-api/folders`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  );
  const data = await response.json();
  return data.folderRecords;
};

export const updateFolderTitle = async (folder_id, title) => {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/records-api/folder-title`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folder_id, title }),
    }
  );
  const data = await response.json();
  console.log(data);
};

export const deleteFolder = async (folder_id) => {
  const response = await fetch(
    `${
      import.meta.env.VITE_BASE_URL
    }/records-api/folders?folder_id=${folder_id}`,
    {
      method: "DELETE",
    }
  );
  const data = await response.json();
  console.log(data);
};
