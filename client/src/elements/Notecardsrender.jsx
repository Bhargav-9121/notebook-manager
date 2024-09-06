/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Notecardsrender = (props) => {
  const nav = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      nav("/");
    }
  }, [nav]);

  const { notecard, deleteThing, editNoteCard } = props;
  const { notecard_name, notecard_id } = notecard;

  const [isEditing, setIsEditing] = useState(false);
  const [newNotecardName, setNewNotecardName] = useState(notecard_name);

  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteContent, setNoteContent] = useState("");

  const handleSaveClick = () => {
    editNoteCard(notecard_id, newNotecardName);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    setNewNotecardName(e.target.value);
  };

  const handleDeleteClick = () => {
    deleteThing(notecard_id);
  };

  // Handlers for the modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSaveNoteContent = () => {
    // Send a request to save the note content to the database
    axios
      .put(`http://localhost:8081/${notecard_id}/savenotecontent`, {
        noteContent,
      })
      .then((res) => {
        console.log("Note content saved successfully");
        closeModal();
      })
      .catch((err) => {
        console.error("Error saving note content:", err);
      });
  };

  return (
    <li>
      {isEditing ? (
        <>
          <input
            type="text"
            value={newNotecardName}
            onChange={handleInputChange}
          />
          <button onClick={handleSaveClick}>Save</button>
        </>
      ) : (
        <>
          <p onClick={() => setIsEditing(true)}>{notecard_name}</p>
          <button onClick={openModal}>Open Notecard</button>
          <button onClick={handleDeleteClick}>Delete</button>
        </>
      )}

      {/* Modal for entering note content */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Note Content Modal"
      >
        <textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="Enter note content..."
        />
        <button onClick={handleSaveNoteContent}>Save</button>
      </Modal>

      <br />
      <br />
    </li>
  );
};

export default Notecardsrender;

// import React, { useState } from "react";

// const Notecardsrender = (props) => {
//   const { notecard, deleteThing, editNoteCard } = props;
//   const { notecard_name, notecard_id } = notecard;

//   const [isEditing, setIsEditing] = useState(false);
//   const [newNotecardName, setNewNotecardName] = useState(notecard_name);

//   const handleSaveClick = () => {
//     editNoteCard(notecard_id, newNotecardName);
//     setIsEditing(false);
//   };

//   const handleEditClick = () => {
//     setIsEditing(true);
//   };

//   const handleInputChange = (e) => {
//     setNewNotecardName(e.target.value);
//   };

//   const handleDeleteClick = () => {
//     deleteThing(notecard_id);
//   };

//   return (
//     <li>
//       {isEditing ? (
//         <>
//           <input
//             type="text"
//             value={newNotecardName}
//             onChange={handleInputChange}
//           />
//           <button onClick={handleSaveClick}>Save</button>
//         </>
//       ) : (
//         <>
//           <p onClick={handleEditClick}>{notecard_name}</p>
//           <button>Open Notecard</button>
//           <button onClick={handleDeleteClick}>Delete</button>
//         </>
//       )}
//       <br />
//       <br />
//     </li>
//   );
// };

// export default Notecardsrender;
