import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../../App";

const SignIn = () => {
  const { dispatch } = useContext(UserContext);
  const history = useNavigate();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const postData = () => {
    console.log("Email:", email);
    console.log("Password:", password);
    if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      M.toast({ html: "Invalid email", classes: "#c62828 red darken-3" });
      return;
    }
    fetch("https://instaclone-zeta-beryl.vercel.app/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        email,
      }),
    })
    .then((res) => {
      console.log("Response status:", res.status);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("Data received:", data);
      if (data.error) {
        M.toast({ html: data.error, classes: "#c62828 red darken-3" });
      } else {
        localStorage.setItem("jwt", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        dispatch({ type: "USER", payload: data.user });
        M.toast({ html: "Signed in successfully", classes: "#43a047 green darken-1" });
        history("/");
      }
    })
    .catch((err) => {
      console.log("Error:", err.message);
      M.toast({ html: "An error occurred. Please try again.", classes: "#c62828 red darken-3" });
    });
  };

  return (
    <div className="mycard">
      <div className="card auth-card input-field ">
        <h2>Instagram</h2>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light #64b5f6 blue lighten-2"
          onClick={postData}
        >
          Sign In
        </button>
        <h6>
          <Link to="/signUp">Don't have an account?</Link>
        </h6>
      </div>
    </div>
  );
};

export default SignIn;
