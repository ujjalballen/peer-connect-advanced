import mediasoupConfig from "../config/mediasoupConfig.js";

class Client {
  constructor(userName, socket) {
    // Basic client info
    this.userName = userName;
    this.socket = socket;

    // instead of calling it producerTransport, call it upstream.
    // THIS Transport used for sending media streams
    this.upstreamTransport = null;

    // we will have audio and video
    this.producer = {};

    // Instead of calling it consumerTransport, call it downstream.
    // THIS Transport used for receiving other users Media streams
    this.downstreamTransports = [];

    // Could be A list (array) of all consumers.
    // Each consumer represents one received media stream (audio/video) from another user.
    this.consumers = [];

    // this.rooms = []
    this.room = null; // this will be a Room object
  }

  addTransport(type, audioPid = null, videoPid = null) {
    return new Promise(async (resolve, reject) => {
      const { initialAvailableOutgoingBitrate, maxIncomingBitrate } =
        mediasoupConfig.webRtcTransport;
      const transport = await this.room.router.createWebRtcTransport({
        // webRtcServer: this.room.worker.appData.webRtcServer,
        enableUdp: true,
        enableTcp: true, // used used UDP, unless we can't;
        preferUdp: true,
        listenIps: [
        {
          ip: '127.0.0.1', //anywhere
          announcedIp: null // replace by public IP address
          // announcedIp: '76.97.119.246',
        }
      ],
        initialAvailableOutgoingBitrate,
      });

      // console.log("webTRCServer from Client: ", this.room.worker.appData.webRtcServer)

      if (maxIncomingBitrate) {
        // maxIncomingBitrate limit the incoming bandwidth from this transport
        try {
          await transport.setMaxIncomingBitrate(maxIncomingBitrate);
        } catch (error) {
          console.log("Error Setting maxIncomingBitrate");
        }
      }

      const clientTransportParams = {
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters,
      };

      if (type === "producer") {
        // set the new transport to the client's upstreamTransport = producerTransport
        this.upstreamTransport = transport;

        // setInterval(async () => {
        //   const stats = await this.upstreamTransport.getStats();

        //   for (const report of stats.values()) {
        //     console.log(report.type);

        //     if (report.type === "webrtc-transport") {
        //       console.log(report.bytesReceived, "-", report.rtpBytesReceived);
        //     }
        //   }
        // }, 1000);


      } else if (type === "consumer") {
        this.downstreamTransports.push({
          transport,
          associatedVideoPid: videoPid,
          associatedAudioPid: audioPid,

        })
      }

      resolve(clientTransportParams);
    });
  }

  addProducer(kind, newProducer) {
    this.producer[kind] = newProducer;

    if (kind === "audio") {
      // add this to our activeSpeakerObserver;
      this.room.activeSpeakerObserver.addProducer({
        producerId: newProducer.id,
      });
    }
  }
}

export default Client;
