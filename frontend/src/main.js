import "./style.css";
import buttons from "../uiStuff/uiButtons";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("✅ Connected to server with id:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
});


const joinNewRoom = () => {
  const roomName = document.getElementById("room-input").value;
  const userName = document.getElementById("username").value;

  console.log("userName:", userName, "roomName: ", roomName);
};

buttons.joinRoom.addEventListener("click", joinNewRoom);
