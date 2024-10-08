import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [nameIn, setNameIn] = useState("");
  const [emailIn, setEmailIn] = useState("");
  const [passIn, setPassIn] = useState("");

  const nav = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newValues = {
      name: nameIn,
      email: emailIn,
      pass: passIn,
    };

    axios
      .post("http://localhost:8081/signup", newValues)
      .then((res) => {
        console.log(res);
        nav("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          onChange={(e) => setNameIn(e.target.value)}
          value={nameIn}
          type="text"
        />
        <br />
        <label>Email</label>
        <input
          onChange={(e) => setEmailIn(e.target.value)}
          value={emailIn}
          type="email"
        />
        <br />
        <label>Create password</label>
        <input
          onChange={(e) => setPassIn(e.target.value)}
          value={passIn}
          type="password"
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Register;
