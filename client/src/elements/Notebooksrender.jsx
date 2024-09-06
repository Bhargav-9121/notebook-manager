/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Notebooksrender = (props) => {
  const nav = useNavigate();
  const { notebook, deleteThing, editNotebook } = props;
  const { notebook_name, notebook_id } = notebook;

  const [isEditing, setIsEditing] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState(notebook_name);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      nav("/");
    }
  }, [nav]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    editNotebook(notebook_id, newNotebookName);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    setNewNotebookName(e.target.value);
  };

  const handleDeleteClick = () => {
    deleteThing(notebook_id);
  };

  const openBook = () => {
    nav(`/notecards/${notebook_id}`);
  };

  return (
    <>
      <li onClick={handleEditClick}>
        {isEditing ? (
          <input
            type="text"
            value={newNotebookName}
            onChange={handleInputChange}
          />
        ) : (
          notebook_name
        )}
      </li>
      <button onClick={openBook}>Open Notebook</button>
      {isEditing && <button onClick={handleSaveClick}>Save</button>}
      <button onClick={handleDeleteClick}>Delete</button>
      <br />
      <br />
    </>
  );
};

export default Notebooksrender;
