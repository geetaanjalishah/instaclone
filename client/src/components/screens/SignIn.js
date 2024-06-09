// SignIn.js
import React, { useState } from "react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const postData = () => {
    fetch("https://instaclone-zeta-beryl.vercel.app/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    })
    .then(res => res.json())
    .then(data => {
      if(data.error) {
        console.log(data.error);
      } else {
        console.log("Login successful", data);
      }
    })
    .catch(err => {
      console.log("Error:", err);
    });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={postData}>Sign In</button>
    </div>
  );
};

export default SignIn;
