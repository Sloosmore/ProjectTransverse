function FileNewNote({ setNewNoteField, newNoteField }) {
  return (
    <div className="z-10">
      <button
        onClick={() => setNewNoteField(!newNoteField)}
        className="bg-gray-100 inline-flex justify-between rounded-md px-3 py-2.5 text-sm font-semibold text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-200"
      >
        <i className="bi bi-plus-lg" style={{ fontSize: "1.5rem" }}></i>
        <span className="ms-2 flex justify-center items-center w-full text-center my-auto">
          New Note
        </span>
      </button>
    </div>
  );
}

export default FileNewNote;
