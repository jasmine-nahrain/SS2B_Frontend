import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Button } from 'react-bootstrap';
import styled from 'styled-components';
import { BrowserRouter } from "react-router-dom";
import Webcam from "react-webcam";
import {deskcheck} from '../api_caller.js';

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

const Colors = {};
Colors.names = {
    aqua: "#00ffff",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    black: "#000000",
    blue: "#0000ff",
    brown: "#a52a2a",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgrey: "#a9a9a9",
    darkgreen: "#006400",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkviolet: "#9400d3",
    fuchsia: "#ff00ff",
    gold: "#ffd700",
    green: "#008000",
    indigo: "#4b0082",
    khaki: "#f0e68c",
    lightblue: "#add8e6",
    lightcyan: "#e0ffff",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    magenta: "#ff00ff",
    maroon: "#800000",
    navy: "#000080",
    olive: "#808000",
    orange: "#ffa500",
    pink: "#ffc0cb",
    purple: "#800080",
    violet: "#800080",
    red: "#ff0000",
    silver: "#c0c0c0",
    white: "#ffffff",
    yellow: "#ffff00"
};

Colors.random = function() {
  var result;
  var count = 0;
  for (var prop in this.names)
      if (Math.random() < 1/++count)
         result = prop;
  return result;
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

class PersonalDeskCheck extends Component {
  constructor(props) {
    super(props);
    this.webcam = React.createRef();
    this.canvasRef = React.createRef();
    this.state = {
      detections: [],
      coloredDetections : [],
      imageData: '',
      valid: false,
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
    let response = await deskcheck(blob);
    if (response !== null) {
      this.setState({
        detections: response.objects
      });
      this.setState({
        valid: response.objects.length == 1 && response.objects[0].label == 'person'
      });
      this.draw();
    }

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
    let self = this;
    myImage.onload = function() {
      ctx.drawImage(myImage, 0, 0);
      // draw boxes AFTER the image has been added
      self.drawBoxes();
    };
    myImage.src = this.state.imageData;
    
  }

  drawBoxes = () => {
    var ctx = this.canvasRef.current.getContext("2d");
    for (var key in this.state.detections) {
      let coords = this.state.detections[key];
      ctx.beginPath();
      ctx.rect(coords.x*1.77777778, coords.y*0.5625, coords.w*1.77777778, coords.h*0.5625);
      let color = Colors.random();
      this.state.detections[key].color = color;
      ctx.strokeStyle = color;
      ctx.stroke();
    }
    this.setState({
      coloredDetections: [{'-1': ''}] //forcing a refresh by using a key that won't exist
    });
    this.setState({
      coloredDetections: this.state.detections
    });
  }

  clear = () => {
    var ctx = this.canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
    this.setState({
      coloredDetections: [{'-1': ''}]
    });
    this.setState({
      coloredDetections: []
    });
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Content>
            <Title style={{textAlign:"center"}}>
              <Text>Personal Desk Check</Text>
            </Title>
            <WebcamContainer>
              <div className="deskcheck-video-container">
                <WebcamCapture ref={this.webcam}></WebcamCapture>
              </div>
              <div className="deskcheck-detection-container">
                
                <canvas height="450" width="800" ref={this.canvasRef} ></canvas>
              </div>
            </WebcamContainer>
            <div className="detection-info">
              <h3 style={{visibility: (this.state.valid || this.state.detections.length < 2 ? 'hidden' : 'visible'), color: 'var(--danger)'}}>
                Potentially prohibited items detected <br/> Ensure you are the only person in the room and remove prohibited items
                </h3>
              <ul className="deskcheck-detection-list">
                {this.state.coloredDetections.map(function(item, idx){
                  return (<li style={{color: item.color}} key={idx}><span>{item.label}</span></li>)
                })}
              </ul>
            </div>
            <div className="deskcheck-button-container">
              <Button onClick={this.capture}>Capture photo</Button>
              <Button onClick={this.continue} disabled={!this.state.valid}>Continue</Button>
              
            </div>
            <div className="deskcheck-button-container">
              <Button>Contact examiner</Button>
              <Button onClick={this.clear}>Clear capture</Button>
            </div>
          </Content>
        </div>
      </BrowserRouter>
    );
  }
} export default withRouter(PersonalDeskCheck);
