import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../images/logo_white.png";
import CountDownTimer from "./timer.js";
import styled from "styled-components";
import VideoCall from "./scripts/video_call.js";
import { Button, Alert } from "react-bootstrap";
import { getDisplayStream } from "./scripts/MediaAccess";
import io from "socket.io-client";
import "./exampage.css";

import {
  ShareScreenIcon,
  MicOnIcon,
  MicOffIcon,
  CamOnIcon,
  CamOffIcon,
} from "./scripts/Icons";

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
      exam_name: "",
      is_examiner: Boolean,
      student_name: "",
      video: "",
      duration: '',
      duration_warning: "",
      stream_visible: true
    };
  }
  videoCall = new VideoCall();

  componentDidMount() {
    const socket = io('http://localhost:8080');
    const component = this;
    this.setState({ socket });
    const { roomId } = this.props.match.params;
    console.log(this.props.match.params)

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

    const is_examiner = parseInt(localStorage.getItem("is_examiner"));
    const user_id = localStorage.getItem("user_id");
    const exam_id = localStorage.getItem("exam_id");
    const duration = localStorage.getItem("exam_duration");
    const exam_name = localStorage.getItem("exam_name");
    const student_name = localStorage.getItem("student_name");
    const time_started = localStorage.getItem("time_started");
    this.setState({
      is_examiner: is_examiner,
      user_id: user_id,
      exam_id: exam_id,
      duration: duration,
      exam_name: exam_name,
      student_name: student_name,
      time_started: time_started
    });
  }

  setAudioLocal(){
    if(this.state.localStream.getAudioTracks().length>0){
      this.state.localStream.getAudioTracks().forEach(track => {
        track.enabled=!track.enabled;
      });
    }
    this.setState({
      micState:!this.state.micState
    })
  }

  setVideoLocal(){
    if(this.state.localStream.getVideoTracks().length>0){
      this.state.localStream.getVideoTracks().forEach(track => {
        track.enabled=!track.enabled;
      });
    }
    this.setState({
      camState:!this.state.camState
    })
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

  enter = roomId => {
    this.setState({ connecting: true });
    const peer = this.videoCall.init(
      this.state.localStream,
      this.state.initiator
    );

    console.log("hfytuhj")
    this.setState({ peer });

    peer.on('signal', data => {
      const signal = {
        room: roomId,
        desc: data
      };
      this.state.socket.emit('signal', signal);
    });
      peer.on('stream', stream => {
        if(this.state.is_examiner) {
          this.remoteVideo.srcObject = stream;
          this.localVideo.setAttribute("display", "none");
        }
        this.setState({ connecting: false, waiting: false });
      });
    peer.on('error', function(err) {
      console.log(err);
    });
    if(this.state.is_examiner && this.remoteVideo.srcObject === null) {
      this.setState({stream_visible: false});
    }
  };

  call = otherId => {
    this.videoCall.connect(otherId);
  };
  renderFull = () => {
    if (this.state.full) {
      return 'The room is full';
    }
  };

  handleToggle = () => {
    this.setState({
      isActive: !this.state.isActive,
    });
    console.log(this.state);

    // this.btnReview.setAttribute("disabled", "disabled");
    this.btnReview.setAttribute("visibility", "hidden");
  };

  handleDurationWarning = (value) => {
    this.setState({duration_warning: value});
  }

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
          style={{display: this.state.is_examiner ? 'none' : 'inline'}}
          ref={(video) => (this.localVideo = video)}
        />
        <h6 style={{visibility: this.state.stream_visible && this.state.is_examiner ? 'visible' : 'hidden'}}>Video stream has not started</h6>
        <section class="experiment">
          {!this.state.is_examiner ? (
            <div id="createBroadcast">
              <section>
                <h6
                  type="text"
                  id="user_id"
                  disabled
                >User ID: {this.state.user_id}</h6>
                {this.state.isActive ? <CountDownTimer duration={this.state.duration} duration_warning={this.handleDurationWarning}/> : null}
                {this.state.duration_warning ? <Alert variant='danger' style={{width: "30%", marginRight: 'auto', marginLeft: 'auto'}}>{this.state.duration_warning}</Alert> : ""}
                { !this.state.isActive ? <Button
                  type="button"
                  id="setup-new-broadcast"
                  variant="outline-dark"
                  onClick={this.handleToggle}
                  ref={(btnReview) => {
                    this.btnReview = btnReview;
                  }}> Start Exam </Button>
                  : ""}

                <div className="controls">
                  <button
                    className="control-btn"
                    onClick={() => {
                      this.getDisplay();
                    }}
                  >
                    <ShareScreenIcon />
                  </button>

                  <button
                    className="control-btn"
                    onClick={() => {
                      this.setAudioLocal();
                    }}
                  >
                    {this.state.micState ? <MicOnIcon /> : <MicOffIcon />}
                  </button>

                  <button
                    className="control-btn"
                    onClick={() => {
                      this.setVideoLocal();
                    }}
                  >
                    {this.state.camState ? <CamOnIcon /> : <CamOffIcon />}
                  </button>
                </div>

                <div class="end-exam-btn">
                  <Button variant="outline-dark" className="button" style={{width: '150px', marginTop: '20px', marginBottom: '20px', backgroundColor: '#bfbfbf'}}  href='/examinee/endpage'>
                      End Exam
                  </Button>
                </div>

              </section>
            </div>
          ) : (
            <div id="listStudents">
            <video
                autoPlay
                id='remoteVideo'
                muted
                ref={video => (this.remoteVideo = video)}
              />
              <table style={{ width: "100%" }} id="rooms-list"></table>
              <h6><b>Student ID:</b> {this.state.user_id}</h6>
              <h6><b>Student Name:</b> {this.state.student_name}</h6>
              <h6><b>Exam Name:</b> {this.state.exam_name}</h6>
              <h6><b>Exam ID: </b>{this.state.exam_id}</h6>
              <h6><b>Duration:</b> {this.state.duration}</h6>
              <h6><b>Time Started:</b> {this.state.time_started}</h6>
            </div>
          )}
        </section>
      </div>
    );
  }
}
export default withRouter(ExamPage);
