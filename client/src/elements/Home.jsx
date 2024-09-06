/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import Notebooksrender from "./Notebooksrender";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [notebooks, setNotebooks] = useState([]);
  const { userid } = useParams();
  const nav = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      nav("/");
    }
  }, [nav]);

  const fetchNotebooks = useCallback(() => {
    axios
      .get(`http://localhost:8081/${userid}/showbooks`, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` }, // Include token in the request
      })
      .then((res) => {
        setNotebooks(res.data);
      })
      .catch((err) => console.log(err));
  }, [userid]);

  useEffect(() => {
    fetchNotebooks();
  }, [fetchNotebooks]);

  const addBook = () => {
    axios
      .post(
        `http://localhost:8081/${userid}/addbook`,
        { userid: userid },
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` }, // Include token in the request
        }
      )
      .then((res) => {
        fetchNotebooks();
      })
      .catch((err) => console.log(err));
  };

  const deleteThing = (notebook_id) => {
    axios
      .delete(`http://localhost:8081/${notebook_id}/deletebook`, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` }, // Include token in the request
      })
      .then((res) => {
        fetchNotebooks();
      })
      .catch((err) => console.log(err));
  };

  const editNotebook = (notebook_id, newNotebookName) => {
    axios
      .put(
        `http://localhost:8081/${notebook_id}/editbook`,
        { newNotebookName },
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` }, // Include token in the request
        }
      )
      .then((res) => {
        fetchNotebooks();
      })
      .catch((err) => console.log(err));
  };

  const logout = () => {
    Cookies.remove("token"); // Remove the JWT token
    nav("/"); // Redirect to login page
  };

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={logout}>Logout</button> {/* Logout button */}
      <div>
        <button onClick={addBook}>Add a Notebook</button>
      </div>
      <ul>
        {notebooks.map((each) => (
          <Notebooksrender
            key={each.notebook_id}
            notebook={each}
            deleteThing={deleteThing}
            editNotebook={editNotebook}
          />
        ))}
      </ul>
    </div>
  );
};

export default Home;
