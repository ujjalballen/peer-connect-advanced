import mediasoupConfig from "../config/mediasoupConfig.js";
import newDominantSpeaker from "../utilitis/newDominantSpeaker.js";

// Rooms are not a MediaSoup thing. MS cares about mediastreams, transports,
// things like that. It doesn't care, or know, about rooms.
// Rooms can be inside of clients, clients inside of rooms,
// transports can belong to rooms or clients, etc.

class Room {
  constructor(roomName, workerToUse) {
    this.roomName = roomName;
    this.worker = workerToUse;
    this.router = null;

    // all the client objects that are in this room
    this.clients = [];

    //an array of id's with the most recent dominant speaker first
    this.activeSpeakerList = [];
  }

  addClient(client) {
    this.clients.push(client);
  }

  createRouter(io) {
    return new Promise(async (resolve, reject) => {
      this.router = await this.worker.createRouter({
        mediaCodecs: mediasoupConfig.routerOptions.mediaCodecs,
      });
      console.log(`Router created for room: ${this.router}`);

      this.activeSpeakerObserver =
        await this.router.createActiveSpeakerObserver({
          interval: 300,
        });

      this.activeSpeakerObserver.on("dominantspeaker", (ds) =>
        newDominantSpeaker(ds, this, io)
      );

      resolve()
    });
  }
}

export default Room;
