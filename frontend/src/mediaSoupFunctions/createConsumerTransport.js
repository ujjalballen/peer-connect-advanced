const createConsumerTransport = (transportParams, device, socket, audioPid) => {
  const consumerTransport = device.createRecvTransport(transportParams);

  consumerTransport.on("connectionstatechange", (state) => {
    console.log("connectionstatechange", state);
  });

  consumerTransport.on("icegatheringstatechange", (state) => {
    console.log("icegatheringstatechange", state);
  });

  // consumer transport connect listener......fire...

  consumerTransport.on(
    "connect",
    async ({ dtlsParameters }, callback, errback) => {
        console.log("Consumer tarnsport has been fired!")

        const connectResp = await socket.emitWithAck('connectTransport', {dtlsParameters, type:"consumer", audioPid});

        if(connectResp === 'success'){
            callback()
        }else{
            errback()
        }

    }
  );

  return consumerTransport;

};

export default createConsumerTransport;
