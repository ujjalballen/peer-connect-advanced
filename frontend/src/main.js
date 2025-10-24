import "./style.css";
import buttons from "../uiStuff/uiButtons";
import { io } from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";
import createProducerTransport from "./mediaSoupFunctions/createProducerTransport";
import createProducer from "./mediaSoupFunctions/createProducer";

let device = null;
let localStream = null;
let producerTransport = null;
let videoProducer = null;
let audioProducer = null;

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
    //     const sctpCapabilities = device.sctpCapabilities;
    // console.log("sctpCapabilities: ", sctpCapabilities)

    buttons.control.classList.remove("d-none");
  } catch (error) {
    if (error.name === "UnsupportedError")
      console.warn("browser not supported");
  }

  //PLACEHOLDER: ... Start making the transport for the current speaker
};

const enableFeedStream = async () => {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    console.log("localStream: ", localStream);

    buttons.localMediaLeft.srcObject = localStream;
    buttons.enableFeed.disabled = true;
    buttons.sendFeed.disabled = false;
  } catch (error) {
    console.log("localStream error: ", error);
  }
};

const sendFeed = async () => {
  // create a transport for THIS client's upstream(producerTransport)
  // it will handle both audio and video producers
  producerTransport = await createProducerTransport(socket, device);
  
  // console.log("Have producer Transport, Time to produce: ", producerTransport);
  // Create our Producers => video or audio or both
  const producers = await createProducer(localStream, producerTransport);
  videoProducer = producers.videoProducer;
  audioProducer = producers.audioProducer;

  console.log("producers: ", producers)

  buttons.hangUp.disabled = false;

};

buttons.joinRoom.addEventListener("click", joinNewRoom);
buttons.enableFeed.addEventListener("click", enableFeedStream);
buttons.sendFeed.addEventListener("click", sendFeed);
