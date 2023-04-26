import React, { useEffect, useState } from 'react';
import socket from "./socket";
import logo from './logo.svg';

import './App.css';

function App() {
  const sessionID = localStorage.getItem("sessionID");
  const username = crypto.getRandomValues(new Uint32Array(1)).toString("hex");

  const [showSession, setShowSession] = useState(false);

  useEffect(() => {

    if (sessionID) {
      socket.auth = { sessionID };
    } else {
      socket.auth = { username };
    }

    socket.connect();

    socket.on("session", ({ sessionID, userID }) => {
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };

      // store it in the localStorage
      localStorage.setItem("sessionID", sessionID);

      // save the ID of the user
      socket.userID = userID;

      setShowSession(true);
    });

    socket.on("connect_error", (err) => {
      console.log("connect error: ", err);
    });
    return function cleanup() {
      socket.off("connect_error");
    };
  });
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {showSession &&
          <h3>
            You are connected to the notification socket service!
          </h3>
        }
      </header>
    </div>
  );
}

export default App;
