const requestedTransportToConsume = (consumeDatas, socket, device) => {
  consumeDatas.audioPidsToCreate.forEach(async (audioPid, i) => {
    const videoPid = consumeDatas.videoPidsToCreate[i];
    const consumerTransport = await socket.emitWithAck("requestedTransport", {
      type: "consumer",
      audioPid,
    });


    console.log('consumerTransport', consumerTransport)

  });
};

export default requestedTransportToConsume;
