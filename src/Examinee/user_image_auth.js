import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Button } from 'react-bootstrap';
import styled from 'styled-components';
import { BrowserRouter } from "react-router-dom";
import Webcam from "react-webcam";
import {uploadFaceImage} from '../api_caller.js';

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

const WebcamCapture = React.forwardRef((props, ref) => (
  <>
    <Webcam
      audio={false}
      height={720}
      ref={ref}
      screenshotFormat="image/jpeg"
      width={1280}
      videoConstraints={videoConstraints}
    />
  </>
));

const Content = styled.div`
  background-color: white;
  background-blend-mode: multiply;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: black;
`;

const WebcamContainer = styled.div`
  display: flex;
  max-width: 75%;
`;

const Title = styled.div`
    padding:14px 5px 14px 0px;
`;

const Text = styled.span`
  vertical-align: text-top;
`;

class FaceAuth extends Component {
  constructor(props) {
    super(props);
    this.webcam = React.createRef();
    this.canvasRef = React.createRef();
    this.container = React.createRef();

    this.state = {
      imageData: '',
      valid: false,
      user_id: localStorage.getItem('user_id'),
      failed: false
    }
  }

  dataURItoBlob = (dataURI) => {
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);
  
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type:mimeString});
  }

  capture = async() => {
    let imageSrc = this.webcam.current.getScreenshot();
    this.setState({
      imageData: imageSrc
    });
    let blob = this.dataURItoBlob(imageSrc);
    let response = await uploadFaceImage(this.state.user_id, blob, true);
    this.container.current.classList.add('camera-flash')
    if (response) {
      this.setState({
        valid: true,
        failed: false
      });
    }
    else {
      this.setState({
        failed: true
      });
    }
    this.draw();
  }

  onSubmit = async (e) => {
    e.preventDefault();
  }

  draw = () => {
    var ctx = this.canvasRef.current.getContext("2d");
    // clear cavnas
    ctx.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
    // draw image
    var myImage = new Image();
    myImage.onload = function() {
      ctx.drawImage(myImage, 0, 0);
    };
    myImage.src = this.state.imageData;
    
  }

  clear = () => {
    this.container.current.classList.remove('camera-flash')
    var ctx = this.canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
    this.setState({
      valid: false,
      failed: false
    });
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Content>
            <Title style={{textAlign:"center"}}>
              <Text>Authenticate Face</Text>
            </Title>
            <WebcamContainer ref={this.container}>
              <div className="deskcheck-video-container">
                <WebcamCapture ref={this.webcam}></WebcamCapture>
              </div>
              <div className="deskcheck-detection-container">
                
                <canvas height="450" width="800" ref={this.canvasRef} ></canvas>
              </div>
            </WebcamContainer>
            <div className="detection-info">
              <h3 className="fail-text" style={{opacity: (this.state.failed ? '1' : '0'), color: 'var(--danger)'}}>
                Authentication Failed
              </h3>
            </div>
            <div className="deskcheck-button-container">
              <Button onClick={this.capture} style={{display: this.state.valid ? 'none' : 'initial'}} >Capture photo</Button>
              <Button onClick={this.clear} disabled={!this.state.failed} style={{display: this.state.valid ? 'none' : 'initial'}}>Clear capture</Button>
              <Button onClick={this.continue} style={{display: this.state.valid ? 'initial' : 'none'}}>Continue</Button>
            </div>
          </Content>
        </div>
      </BrowserRouter>
    );
  }
} export default withRouter(FaceAuth);
