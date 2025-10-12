import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import * as mediasoup from "mediasoup";
import createWorker from "./createWorker.js";
import mediasoupConfig from "./config/mediasoupConfig.js";
import Client from "./classes/Client.js";
import Room from "./classes/Room.js";
import getWorker from "./getWorker.js";

const app = express();
const port = process.env.PROT || 3000;

app.use(express.json());
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // your frontend origin
    methods: ["GET", "POST"],
    // credentials: true,
  },
});

let workers = null;

// now router is managed by Room Object(not with 0 worker)

// master room array that contains all Room object
const rooms = [];

const initMediasoup = async () => {
  workers = await createWorker();

  // console.log(workers[0].appData)

  // router move to the Room level==>
  // router = await workers[0].createRouter({
  //   mediaCodecs: mediasoupConfig.routerOptions.mediaCodecs
  // });
};

initMediasoup();

io.on("connection", (socket) => {
  console.log("Socket ID: ", socket.id);

  let client; // this client object will available to all our socket listener

  socket.on("joinRoom", async ({ roomName, userName }, ackCb) => {
    let newRoom = false;
    client = new Client(userName, socket);
    // console.log("This is our Client Object: ", client);

    let requestedRoom = rooms.find((room) => room.roomName === roomName);
    if (!requestedRoom) {
      newRoom = true;

      // we will make rooms, add a worker, add a router;
      const workerToUse = await getWorker(workers);
      // console.log("Get new Worker for this ROOM: ", workerToUse);

      requestedRoom = new Room(roomName, workerToUse);
      // console.log("get the Room OBJECT and its FN: ", requestedRoom);

      await requestedRoom.createRouter();

      // push the new Room to the rooms object;
      rooms.push(requestedRoom);
    }

    // add the new room to the client Object;
    client.room = requestedRoom;

    // add the client to the Room clients;
    client.room.addClient(client);
    console.log(
      `Room Name: ${roomName} : Total Active Clients: ${client.room.clients.length}`
    );

    // add this socket to the socket room;
    socket.join(client.room.roomName);

    //PLACEHOLDER.............. come back, we will get all current producer..

    ackCb({
      routerRtpCapabilities: client.room.router.rtpCapabilities,
      newRoom,
    });
  });

  socket.on("requestedTransport", async ({ type }, ackCb) => {
    //weather consumer or producer, clients need params
    let clientTransportParams;

    if (type === "producer") {
      // run addClient, which is part of our Client class;
      clientTransportParams = await client.addTransport(type);
    } else if (type === "consumer") {
    }

    ackCb(clientTransportParams);
  });
});

httpServer.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
