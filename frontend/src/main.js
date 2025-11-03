import "./style.css";
import buttons from "../uiStuff/uiButtons";
import { io } from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";
import createProducerTransport from "./mediaSoupFunctions/createProducerTransport";
import createProducer from "./mediaSoupFunctions/createProducer";
import requestedTransportToConsume from "./mediaSoupFunctions/requestTransportToConsume";

let device = null;
let localStream = null;
let producerTransport = null;
let videoProducer = null;
let audioProducer = null;
let consumers = {};

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
  requestedTransportToConsume(joinRoomResp, socket, device, consumers)

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
    buttons.muteBtn.disabled = false;
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

  console.log("producers: ", producers);

  buttons.hangUp.disabled = false;
};

const muteAudio = () => {
  //mute at the producer level, to kee the transport and all
  // other mechanism in place
  if (audioProducer.paused) {
    // currently paused. User wants to unpause
    audioProducer.resume();
    buttons.muteBtn.innerHTML = "Audio On";
    buttons.muteBtn.classList.add("btn-success"); //turn it green
    buttons.muteBtn.classList.remove("btn-danger"); //remove the red

    // unpause on the server
    socket.emit("audioChange", "unmute");
  } else {
    // currently on. User wants to pause
    audioProducer.pause();
    buttons.muteBtn.innerHTML = "Audio Muted";
    buttons.muteBtn.classList.remove("btn-success"); //turn it green
    buttons.muteBtn.classList.add("btn-danger"); //remove the red

    // pause on the server
    socket.emit("audioChange", "mute");
  }
};

buttons.joinRoom.addEventListener("click", joinNewRoom);
buttons.enableFeed.addEventListener("click", enableFeedStream);
buttons.sendFeed.addEventListener("click", sendFeed);
buttons.muteBtn.addEventListener("click", muteAudio);
