const createProducer = (localStream, producerTransport) => {
  return new Promise(async (resolve, reject) => {
    // get the audio and video tracks, so that we can produce
    const videoTrack = localStream.getVideoTracks()[0];
    const audioTrack = localStream.getAudioTracks()[0];

    try {
      //running this produce method, will tell the producer transport "connect" event to fired!
      const videoProducer = await producerTransport.produce({
        track: videoTrack,
      });
      const audioProducer = await producerTransport.produce({
        track: audioTrack,
      });
      resolve({ videoProducer, audioProducer });
    } catch (error) {
      console.log("Error Producing: ", error);
    }
  });
};

export default createProducer;
