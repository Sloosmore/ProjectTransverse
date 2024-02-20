function NewNote({ setNewNoteField, newNoteField }) {
  return (
    <div className=" w-full ">
      <button
        onClick={() => setNewNoteField(!newNoteField)}
        className="bg-gray-100 w-full inline-flex justify-between rounded-md px-3 py-2.5 text-sm font-semibold text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-200"
      >
        <i className="bi bi-plus-lg" style={{ fontSize: "1.5rem" }}></i>
        <span className="flex justify-center items-center w-full text-center my-auto">
          New Note
        </span>
      </button>
    </div>
  );
}

export default NewNote;
