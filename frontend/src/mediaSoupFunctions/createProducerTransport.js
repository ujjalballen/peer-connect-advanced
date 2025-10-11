const createProducerTransport = (socket) => new Promise(async(resolve, reject) => {
// ask the server to make a webRtcTransport/transport and send back params;

const producerTransportParams = await socket.emitWithAck('requestedTransport', {type: "producer"})
});


export default createProducerTransport;