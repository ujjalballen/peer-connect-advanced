// here room is our full Room Object or Room Class, we pass that Room as this and not give a name
// ds = dominant Speaker

const newDominantSpeaker = (ds, room, io) => {
    // console.log("====This is new Dominent speaker=======")

    console.log("Dominant: ", ds)

    // look through this room's activeSpeakerList for this producer's pid= producer id
    // we know that it's a audio pid

    const index = room.activeSpeakerList.findInex(producerId => producerId === ds.producer.id );

    if(index > -1){
        // this person is in the list, and need to moved to the front
        const [producerId] = room.activeSpeakerList.splice(index, 1);
        room.activeSpeakerList.unshift(producerId)
    } else {
        room.activeSpeakerList.unshift(ds.producer.id)
    }
};


export default newDominantSpeaker;