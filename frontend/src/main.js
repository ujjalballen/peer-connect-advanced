import "./style.css";
import buttons from "../uiStuff/uiButtons";

const joinNewRoom = () => {
  const roomName = document.getElementById('room-input').value;
  const userName = document.getElementById('username').value;

  console.log('userName:', userName, 'roomName: ', roomName)

};

buttons.joinRoom.addEventListener("click", joinNewRoom);
