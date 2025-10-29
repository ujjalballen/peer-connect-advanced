const createProducerTransport = (socket, device) => {
  return new Promise(async (resolve, reject) => {
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
    // Send these DTLS parameters to the server so it can complete the transport handshake
    // for this producer transport. After the server responds, call 'callback()' to finish the connection.
    producerTransport.on(
      "connect",
      async ({ dtlsParameters }, callback, errback) => {
        // send dtlsParameters to server

        console.log("connect running on producer........");

        const connectRes = await socket.emitWithAck("connectTransport", {
          dtlsParameters,
          type: "producer",
        });
        console.log("connect event connectRes is Back:", connectRes);

        if (connectRes === "success") {
          // we are connected. Move forward...
          callback();
        } else if (connectRes === "error") {
          // producerTransport 'connect' event faild to connect..
          errback();
        }
      }
    );

    producerTransport.on("produce", async (parameters, callback, errback) => {
      console.log("producerTransport produce EVENT is now ready to running..");

      const { kind, rtpParameters } = parameters;

      const produceRes = await socket.emitWithAck("startProducing", {
        kind,
        rtpParameters,
      });
      console.log("produce event produceRes is Back: ", produceRes);

      if (produceRes === "error") {
        errback();
      } else{
        // only other option is the producer id
        callback({ id: produceRes.id });
      }
    });


    setInterval(async() => {
      const stats = await producerTransport.getStats();

      for(const report of stats.values()){
        // console.log(report.type)
        if(report.type === 'outbound-rtp'){
          console.log(report.bytesSent, "-", report.packetsSent)
        }
      }
    }, 100)

    resolve(producerTransport);
  });
};

export default createProducerTransport;
