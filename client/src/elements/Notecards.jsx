/* eslint-disable no-unused-vars */
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Notecardsrender from "./Notecardsrender";

const Notecards = () => {
  const [notecards, setNotecards] = useState([]);
  const { notebook_id } = useParams();
  const nav = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      nav("/");
    }
  }, [nav]);

  const fetchNoteCards = useCallback(() => {
    const token = Cookies.get("token");

    axios
      .get(`http://localhost:8081/${notebook_id}/shownotecards`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setNotecards(res.data);
      })
      .catch((err) => console.log(err));
  }, [notebook_id]);

  useEffect(() => {
    fetchNoteCards();
  }, [fetchNoteCards]);

  const addNoteCard = () => {
    const token = Cookies.get("token");

    const newNoteCard = {
      notebook_id: notebook_id,
    };

    axios
      .post(`http://localhost:8081/${notebook_id}/addnotecard`, newNoteCard, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        fetchNoteCards();
      })
      .catch((err) => console.log(err));
  };

  const deleteThing = (notecard_id) => {
    const token = Cookies.get("token");

    axios
      .delete(`http://localhost:8081/${notecard_id}/deletenotecard`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        fetchNoteCards();
      })
      .catch((err) => console.log(err));
  };

  const editNoteCard = (notecard_id, newNotecardName) => {
    const token = Cookies.get("token");

    axios
      .put(
        `http://localhost:8081/${notecard_id}/editnotecard`,
        {
          newNotecardName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        fetchNoteCards();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h1>NoteCards Page</h1>
      <div>
        <button onClick={addNoteCard}>Add a NoteCard</button>
      </div>
      <ul>
        {notecards.map((each) => (
          <Notecardsrender
            key={each.notecard_id}
            notecard={each}
            deleteThing={deleteThing}
            editNoteCard={editNoteCard}
          />
        ))}
      </ul>
    </div>
  );
};

export default Notecards;
