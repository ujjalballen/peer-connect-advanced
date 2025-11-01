import createConsumer from "./createConsumer";
import createConsumerTransport from "./createConsumerTransport";

const requestedTransportToConsume = (consumeDatas, socket, device) => {
  consumeDatas.audioPidsToCreate.forEach(async (audioPid, i) => {
    const videoPid = consumeDatas.videoPidsToCreate[i];
    const consumerTransportParams = await socket.emitWithAck("requestedTransport", {
      type: "consumer",
      audioPid,
    });


    console.log('consumerTransport', consumerTransport)

    const consumerTransport = createConsumerTransport(consumerTransportParams, device, socket, audioPid);

    const [audioConsumer, videoConsumer] = await Promise.all([
      createConsumer(consumerTransport, audioPid, device, socket, 'audio', i),
      createConsumer(consumerTransport, videoPid, device, socket, 'audio', i)
    ])


    console.log("audioConsumer", audioConsumer);
    console.log("videoConsumer", videoConsumer);



  });
};

export default requestedTransportToConsume;
