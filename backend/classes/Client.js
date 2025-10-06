class Client {
  constructor(userName, socket, router) {
    // Basic client info
    this.userName = userName;
    this.socket = socket;
    this.router = router;

    // instead of calling it producerTransport, call it upstream.
    // THIS Transport used for sending media streams
    this.upstreamTransport = null;

    // we will have audio and video ||=> consumer
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
}

export default Client;
