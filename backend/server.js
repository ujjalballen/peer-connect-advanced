import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import * as mediasoup from "mediasoup";
import createWorker from "./createWorker.js";
import mediasoupConfig from "./config/mediasoupConfig.js";
import Client from "./classes/Client.js";
import Room from "./classes/Room.js";

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
let router = null;

const initMediasoup = async () => {
  workers = await createWorker();

  // console.log(workers[0].appData)

  // now we got only one worker
  router = await workers[0].createRouter({
    mediaCodecs: mediasoupConfig.routerOptions.mediaCodecs,
  });
};

initMediasoup();

io.on("connection", (socket) => {
  console.log("Socket ID: ", socket.id);

  let client; // this client object will available to all our socket listener

  socket.on("joinRoom", ({ roomName, userName }, cb) => {
    client = new Client(userName, socket, router);
  });
});

httpServer.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
