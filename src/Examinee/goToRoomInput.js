import React, { useState } from 'react'
import shortId from 'shortid'
import { useHistory } from "react-router-dom";
import './exampage.css';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function GoToRoomInput() {
   const history = useHistory();
   const goToRoom = (roomId) => {
    window.location.href = (`/examinee/exam/${roomId}`)
   }
  let [roomId, setRoomId] = useState(shortId.generate());

  return (
    <body className="room">
    <div className="enter-room-container">
    <Form>
          <input type="text" value={roomId} placeholder="Room id" onChange={(event) => {
            setRoomId(event.target.value)
          }}/>
          <Button variant="outline-light" onClick={() => {
            goToRoom(roomId)
          }}>Enter Room</Button>
          </Form>
        </div>
      </body>)
}
