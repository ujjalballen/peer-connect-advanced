// here room is our full Room Object or Room Class, we pass that Room as this and not give a name
// ds = dominant Speaker
function newDominantSpeaker(ds,room,io){
    console.log('======ds======',ds.producer.id)
    // look through this room's activeSpeakerList for this producer's pid
    // we KNOW that it is an audio pid
    const i = room.activeSpeakerList.findIndex(pid=>pid === ds.producer.id)
    if(i > -1){
        // this person is in the list, and need to moved to the front
        const [ pid ] = room.activeSpeakerList.splice(i,1)
        room.activeSpeakerList.unshift(pid)
    }else{
        // this is a new producer, just add to the front
        room.activeSpeakerList.unshift(ds.producer.id)
    }
    console.log(room.activeSpeakerList)
    // PLACEHOLDER - the activeSpeakerlist has changed!
    // updateActiveSpeakers = mute/unmute/get new transports


};


export default newDominantSpeaker;