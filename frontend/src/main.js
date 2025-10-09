import "./style.css";
import buttons from "../uiStuff/uiButtons";
import { io } from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";

let device = null;

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("✅ Connected to server with id:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
});

const joinNewRoom = async () => {
  const roomName = document.getElementById("room-input").value;
  const userName = document.getElementById("username").value;

  console.log("userName:", userName, "roomName: ", roomName);

  const joinRoomResp = await socket.emitWithAck("joinRoom", {
    roomName,
    userName,
  });

  console.log("joinRoom", joinRoomResp);

  try {
    device = await mediasoupClient.Device.factory();

    await device.load({
      routerRtpCapabilities: joinRoomResp.routerRtpCapabilities,
    });

    console.log("device: ", device);


    buttons.control.classList.remove('d-none');
    
  } catch (error) {
    if (error.name === "UnsupportedError")
      console.warn("browser not supported");
  }


  //PLACEHOLDER: ... Start making the transport for the current speaker



};

buttons.joinRoom.addEventListener("click", joinNewRoom);
