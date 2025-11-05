const updateActiveSpeakers = (room, io) => {
  const activeSpeakers = room.activeSpeakerList.slice(0, 5);
  const mutedSpeakers = room.activeSpeakerList.slice(5);

  const newTransportByPeers = {};

  room.clients.forEach(client => {

    mutedSpeakers.forEach(pid => {
        if(client?.producer?.id === pid){
            client.producer?.audio.pause();
            client.producer?.video.pause();
            return;
        }

        const downstreamToStop = client.downstreamTransports.find(t => t?.audio?.producerId === pid);


        if(downstreamToStop){
            downstreamToStop.audio.pause()
            downstreamToStop.video.pause()
        }

    })
  });


};

export default updateActiveSpeakers;
