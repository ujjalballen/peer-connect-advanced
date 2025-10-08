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


const joinNewRoom = async() => {
  const roomName = document.getElementById("room-input").value;
  const userName = document.getElementById("username").value;

  console.log("userName:", userName, "roomName: ", roomName);

  const joinRoomResp = await socket.emitWithAck('joinRoom', {roomName, userName})

  console.log('joinRoom', joinRoomResp)
};



buttons.joinRoom.addEventListener("click", joinNewRoom);
