import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const UI = () => {
  const [username, setUsername] = useState("");
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("receive-message", (data) => {
      console.log("Received:", data);

      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Sending...");

    if (!msg.trim() || !username.trim()) {
      console.log("Username or message empty");
      return;
    }

    const data = {
      user: username,
      text: msg,
    };

    console.log("Sending Data:", data);

    socket.emit("send-message", data);

    setMsg("");
  };

  return (
    <div>
      <h2>Chat App</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Message"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />

        <button type="submit">Send</button>
      </form>

      {messages.map((message, index) => (
        <p key={index}>
          {message.user}: {message.text}
        </p>
      ))}
    </div>
  );
};

export default UI;