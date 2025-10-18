const createProducer = (localStream, producerTransport) => {
  return new Promise(async (resolve, reject) => {
    // get the audio and video tracks, so that we can produce
    const videoTrack = localStream.getVideoTracks()[0];
    const audioTrack = localStream.getAudioTracks()[0];

    try {
      //running this produce method, will tell the producer transport "connect" event to fired!
      console.log("Produce running on the Video");
      const videoProducer = await producerTransport.produce({
        track: videoTrack,
      });

      console.log("Produce running on the Audio");
      const audioProducer = await producerTransport.produce({
        track: audioTrack,
      });

      console.log("Produce Finished!")
      resolve({ videoProducer, audioProducer });
    } catch (error) {
      console.log("Error Producing: ", error);
    }
  });
};

export default createProducer;
