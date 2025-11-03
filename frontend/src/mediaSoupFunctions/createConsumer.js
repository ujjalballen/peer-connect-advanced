const createConsumer = (consumerTransport, pid, device, socket, kind, slot) => {
  return new Promise.all(async (resolve, reject) => {
    const consumerParams = await socket.emitWithAck("consumeMedia", {
      rtpCapabilities: device.rtpCapabilities,
      pid,
      kind,
    });

    console.log("consumerParams", consumerParams);

    if (consumerParams === "canNotConsume") {
      console.log("Can not consume");
      resolve();
    } else if (consumerParams === "consumeFaild") {
      console.log("Consume faild...");
      resolve();
    } else {
      // we got valid params! used them to consume;
      const consumer = await consumerTransport.consume(consumerParams);
      console.log("consume() has finished");

      const { track } = consumer;

      await socket.emitWithAck("unpausedConsumer", pid, kind);

      resolve(consumer);
    }
  });
};

export default createConsumer;
