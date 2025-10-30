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

      await requestedRoom.createRouter(io);

      // push the new Room to the rooms object;
      rooms.push(requestedRoom);
    }

    // add the new room to the client Object;
    client.room = requestedRoom;

    console.log("client.Room: ", client.room);
    console.log("Full Client: ", client);

    // add the client to the Room clients;
    client.room.addClient(client);
    console.log(
      `Room Name: ${roomName} : Total Active Clients: ${client.room.clients.length}`
    );

    // add this socket to the socket room;
    socket.join(client.room.roomName);

    // get the first 5 speakers from activeSpeakerList
    const audioPidsToCreate = client.room.activeSpeakerList.slice(0, 5);
    const videoPidsToCreate = audioPidsToCreate.map(audioPid => {
      const getClient = client.room.clients.find(c => c?.producer?.audio?.id === audioPid);
      return getClient?.producer?.video?.id
    })

    const associatedUsername = audioPidsToCreate.map(audioPid => {
      const getClient = client.room.clients.find(c => c?.producer?.audio?.id === audioPid);
      return getClient?.userName;
    })



    ackCb({
      routerRtpCapabilities: client.room.router.rtpCapabilities,
      newRoom,
      audioPidsToCreate,
      videoPidsToCreate,
      associatedUsername
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

  socket.on("connectTransport", async ({ dtlsParameters, type }, ackCb) => {
    if (type === "producer") {
      if (!client.upstreamTransport) {
        ackCb("error");
        return;
      }

      try {
        await client.upstreamTransport.connect({ dtlsParameters });
        ackCb("success");
      } catch (error) {
        console.log("produer connectTransport error:", error);
        ackCb("error");
      }
    } else if (type === "consumer") {
    }
  });

  socket.on("startProducing", async ({ kind, rtpParameters }, ackCb) => {
    // make a Producer with the rtpParameters we just send
    try {
      if (!client.upstreamTransport) {
        ackCb("error");
        return;
      }

      const newProducer = await client.upstreamTransport.produce({
        kind,
        rtpParameters,
      });

      //add the producer to the Client object

      client.addProducer(kind, newProducer);

      //we will send back with the id;
      ackCb(newProducer.id);
    } catch (error) {
      console.log("produer startProducing error: ", error);
      ackCb("error");
    }

    //PLACEHOLDER 1: if this is an AudioTrack, then this is a new possible speaker
    //PLACEHOLDER 2: if the room is populated, then let the connect peers know soneone Join
  });

  socket.on("audioChange", (typeOfChange) => {
    console.log("Type: ", typeOfChange);

    if (typeOfChange === "mute") {
      client?.producer?.audio?.pause();
    } else {
      client?.producer?.audio?.resume();
    }
  });
});

httpServer.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
