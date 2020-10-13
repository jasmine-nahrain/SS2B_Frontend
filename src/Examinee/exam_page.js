import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../images/logo_white.png";
import CountDownTimer from "./timer.js";
import styled from "styled-components";
import VideoCall from "./scripts/video_call.js";
import { getDisplayStream } from "./scripts/MediaAccess";
import io from "socket.io-client";
import "./exampage.css";

const Header = styled.header`
  background-color: #2196f3;
  color: white;
  padding: 1%;
  margin-bottom: 3%;
`;

class ExamPage extends React.Component {
  constructor() {
    super();
    this.state = {
      localStream: {},
      remoteStreamUrl: "",
      streamUrl: "",
      initiator: false,
      peer: {},
      full: false,
      connecting: false,
      waiting: true,
      micState: true,
      camState: true,
      isActive: false,
      user_id: "",
      exam_id: "",
      is_examiner: Boolean,
      video: "",
    };
  }
  videoCall = new VideoCall();

  componentDidMount() {
    const is_examiner = localStorage.getItem("is_examiner");
    const user_id = localStorage.getItem("user_id");
    const exam_id = localStorage.getItem("exam_id");
    this.setState({
      is_examiner: is_examiner,
      user_id: user_id,
      exam_id: exam_id,
    });
    console.log(user_id);
    const socket = io(process.env.REACT_APP_SIGNALING_SERVER);
    const component = this;
    this.setState({ socket });
    const { roomId } = this.props.match.params;
    this.getUserMedia().then(() => {
      socket.emit("join", { roomId: roomId });
    });

    socket.on("init", () => {
      component.setState({ initiator: true });
    });
    socket.on("ready", () => {
      component.enter(roomId);
    });
    socket.on("desc", (data) => {
      if (data.type === "offer" && component.state.initiator) return;
      if (data.type === "answer" && !component.state.initiator) return;
      component.call(data);
    });
    socket.on("disconnected", () => {
      component.setState({ initiator: true });
    });
    socket.on("full", () => {
      component.setState({ full: true });
    });
  }

  getUserMedia(cb) {
    return new Promise((resolve, reject) => {
      navigator.getUserMedia = navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;
      const op = {
        video: {
          width: { min: 160, ideal: 640, max: 1280 },
          height: { min: 120, ideal: 360, max: 720 },
        },
        audio: true,
      };
      navigator.getUserMedia(
        op,
        (stream) => {
          this.setState({ streamUrl: stream, localStream: stream });
          this.localVideo.srcObject = stream;
          resolve();
        },
        () => {}
      );
    });
  }
  getDisplay() {
    getDisplayStream().then((stream) => {
      stream.oninactive = () => {
        this.state.peer.removeStream(this.state.localStream);
        this.getUserMedia().then(() => {
          this.state.peer.addStream(this.state.localStream);
        });
      };
      this.setState({ streamUrl: stream, localStream: stream });
      this.localVideo.srcObject = stream;
      this.state.peer.addStream(stream);
    });
  }

  handleToggle = () => {
    this.setState({
      isActive: !this.state.isActive,
    });
    this.btnReview.setAttribute("disabled", "disabled");
  };

  render() {
    return (
      <div className="App">
        <Header>
          <img
            src={logo}
            className="move"
            alt="logo"
            style={{ marginLeft: "auto", marginRight: "auto" }}
          />
          <h1>Examination Page</h1>
        </Header>
        <video
          autoPlay
          id="localVideo"
          muted
          ref={(video) => (this.localVideo = video)}
        />
        <section class="experiment">
          {this.state.is_examiner && (
            <div id="createBroadcast">
              <section>
                <input
                  type="text"
                  id="user_id"
                  value={this.state.user_id}
                  disabled
                />
                {this.state.isActive ? <CountDownTimer /> : null}
                <button
                  type="button"
                  id="setup-new-broadcast"
                  class="btn btn-warning"
                  onClick={this.handleToggle}
                  ref={(btnReview) => {
                    this.btnReview = btnReview;
                  }}
                  disabled={this.state.isActive}
                >
                  Start Exam
                </button>
              </section>
            </div>
          )}
          {!this.state.is_examiner && (
            <div id="listStudents">
              <table style={{ width: "100%" }} id="rooms-list"></table>
            </div>
          )}
        </section>
      </div>
    );
  }
}
export default withRouter(ExamPage);
