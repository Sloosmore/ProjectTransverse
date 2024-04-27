import React from "react";
import { createFolder } from "@/components/appPages/services/crudApi";
import { useAuth } from "@/hooks/userHooks/auth";
import { useNavigate } from "react-router-dom";

function CreateFolder() {
  const navigate = useNavigate();
  const { session } = useAuth();

  const newFolder = async () => {
    const response = await createFolder(session);
    const folderId = response.folder_id;
    navigate(`f/${folderId}`);
  };

  /*const [folderName, setFolderName] = useState('');
  const dispatch = useDispatch();
  const { folderId } = useParams();
  const { folderPath } = useSelector((state) => state.folder);

  const handleCreateFolder = () => {
    dispatch(createFolder(folderName, folderId, folderPath));  };
*/

  return (
    <div className="z-10">
      <button
        onClick={() => newFolder()}
        className="bg-gray-100 inline-flex justify-between rounded-md px-3 py-2.5 text-sm font-semibold text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-200"
      >
        <i className="bi bi-plus-lg" style={{ fontSize: "1.5rem" }}></i>
        <span className="ms-2 flex justify-center items-center w-full text-center my-auto">
          New Folder
        </span>
      </button>
    </div>
  );
}

export default CreateFolder;
