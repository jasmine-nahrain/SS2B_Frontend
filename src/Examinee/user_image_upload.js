import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import { BrowserRouter } from "react-router-dom";
import Webcam from "react-webcam";
import { uploadFaceImage } from '../api_caller.js';

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
      onUserMediaError={() => {
        alert("Please enable your camera to set your identity authentication.");
      }}
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

class FaceUpload extends Component {
  constructor(props) {
    super(props);
    this.webcam = React.createRef();
    this.canvasRef = React.createRef();
    this.container = React.createRef();
    this.state = {
      imageData: '',
      valid: false,
      failed: false,
      camera_error: false,
      user_id: localStorage.getItem('user_id'),
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
    return new Blob([ia], { type: mimeString });
  }

  capture = async () => {
    let imageSrc = this.webcam.current.getScreenshot();
    this.setState({
      imageData: imageSrc,
      camera_error: imageSrc === null
    });
    if (imageSrc === null) return;
    let blob = this.dataURItoBlob(imageSrc);
    let success = await uploadFaceImage(this.state.user_id, blob, false);
    this.container.current.classList.add('camera-flash');
    //console.log(success)
    this.setState({
      valid: success,
      failed: !success
    });
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
            <Title style={{ textAlign: "center" }}>
              <h1>Upload Face ID</h1>
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
              {this.state.camera_error &&
                <h3 className="fail-text" style={{ color: 'var(--danger)' }}>
                  Something went wrong with trying to use your camera. 
                  <br/> Please try reloading the page and allowing camera permissions.
                </h3>
              }
              {this.state.valid &&
                <Text>Your Face ID has been successfully uploaded and set.</Text>
              }
              {this.state.failed &&
                <h3 className="fail-text" style={{color: 'var(--danger)' }}>
                  Upload failed. Please try again.
                </h3>
              }
            </div>
            <div className="deskcheck-button-container">
              <Button onClick={this.capture} style={{ display: this.state.valid ? 'none' : 'initial' }} >Capture photo</Button>
              <Button onClick={this.clear} style={{ display: this.state.valid ? 'initial' : 'none' }} >Clear capture</Button>
              <Button onClick={this.continue} disabled={!this.state.valid}>Continue</Button>
            </div>

          </Content>
        </div>
      </BrowserRouter>
    );
  }
} export default withRouter(FaceUpload);
