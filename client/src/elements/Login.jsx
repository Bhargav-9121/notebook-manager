import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Login = () => {
  const [emailIn, setEmailIn] = useState("");
  const [passIn, setPassIn] = useState("");
  const [validity, setValidity] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      axios
        .get("http://localhost:8081/verifytoken", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          nav(`/home/${res.data.userid}`);
        })
        .catch(() => {
          nav(`/`);
        });
    }
  }, [nav]);

  const submitted = (event) => {
    event.preventDefault();

    const newValues = {
      email: emailIn,
      pass: passIn,
    };

    console.log("Logging in with:", newValues);

    axios
      .post("http://localhost:8081/checkuser", newValues)
      .then((res) => {
        console.log("Login response:", res.data);
        if (res.data !== "Failed") {
          Cookies.set("token", res.data.token, { expires: 1 });
          nav(`/home/${res.data.userid}`);
        } else {
          setValidity(true);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h1>LoginPage</h1>
      <form onSubmit={submitted}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={emailIn}
          onChange={(e) => setEmailIn(e.target.value)}
        />
        <br />
        <label htmlFor="pass">Password</label>
        <input
          type="password"
          id="pass"
          value={passIn}
          onChange={(e) => setPassIn(e.target.value)}
        />
        <br />
        <button type="submit">Log In</button>
      </form>
      <br />
      {validity && <p>Invalid Login Credentials</p>}
      <br />
      <label>New User?</label>
      <Link to="/register">
        <button>Register</button>
      </Link>
    </div>
  );
};

export default Login;
