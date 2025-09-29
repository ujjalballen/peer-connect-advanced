import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import * as mediasoup from "mediasoup";
import createWorker from "./createWorker.js";

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

const initMediasoup = async() => {
  workers = await createWorker();

  // console.log(workers)
};

initMediasoup();


io.on("connection", (socket) => {
  console.log("Socket ID: ", socket.id);
});

httpServer.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
