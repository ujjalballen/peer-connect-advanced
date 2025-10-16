const createProducerTransport = (socket, device) =>
  new Promise(async (resolve, reject) => {
    // ask the server to make a webRtcTransport/transport and send back params;

    const producerTransportParams = await socket.emitWithAck(
      "requestedTransport",
      { type: "producer" }
    );
    // console.log('producerTransportParams: ', producerTransportParams);

    // This transport will be used to send our audio/video tracks to the Node.js server running mediasoup.
    const producerTransport = device.createSendTransport(
      producerTransportParams
    );

    // console.log("producerTransport: ", producerTransport)

    // When the producer transport tries to connect, mediasoup-client provides DTLS parameters.
    // Send these DTLS parameters to the server so it can complete the WebRTC handshake
    // for this producer transport. After the server responds, call 'callback()' to finish the connection.
    producerTransport.on(
      "connect",
      async ({ dtlsParameters }, callback, errback) => {
        // send dtlsParameters to server

        console.log("connect running on producer........")
      }
    );

    producerTransport.on(
      "produce",
      async (parameters, callback, errback) => {}
    );

    resolve(producerTransport);
  });

export default createProducerTransport;
