import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { useHistory } from "react-router-dom";

const Dashboard = () => {
  const history = useHistory();
  const [quote, setQuote] = useState("");
  const [tempQuote, setTempQuote] = useState("");

  async function populateQuote() {
    const req = await fetch("http://localhost:1337/api/quote", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });

    const data = await req.json();
    if (data.status === "ok") {
      setQuote(data.quote);
    } else {
      alert(data.error);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwt.decode(token);
      if (!user) {
        localStorage.removeItem("token");
        history.replace("/login");
      } else {
        populateQuote();
      }
    }
  }, []);

  async function updateQuote(event) {
    event.preventDefault();

    const req = await fetch("http://localhost:1337/api/quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        quote: tempQuote,
      }),
    });

    const data = await req.json();
    if (data.status === "ok") {
      setQuote(tempQuote);
      setTempQuote("");
    } else {
      alert(data.error);
    }
  }

  return (
    <div>
      <h1 className="register-title ">
        Welcome to Pulsar - {quote || "Enter your name"}
      </h1>
      <form onSubmit={updateQuote}>
        <input
          className="input-box"
          input-box
          type="text"
          placeholder="Name"
          value={tempQuote}
          onChange={(e) => setTempQuote(e.target.value)}
        />
        <br />
        <br />
        <input type="submit" value="add" className="login" />
      </form>
    </div>
  );
};

export default Dashboard;
