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

// const WebcamCapture = () => {
//   const webcamRef = React.useRef(null);
 
//   return (
    
//   );
// };

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

const Title = styled.div`
    padding:14px 5px 14px 0px;
`;

const Text = styled.span`
  vertical-align: text-top;
`;

class ImageTestPage extends Component {
  constructor(props) {
    super(props);
    this.webcam = React.createRef();
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

  capture = () => {
    let imageSrc = this.webcam.current.getScreenshot();
    console.log(imageSrc)
    let blob = this.dataURItoBlob(imageSrc);
    console.log(blob)
    deskcheck(blob)
  }

  onSubmit = async (e) => {
    e.preventDefault();
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Content>
            <WebcamCapture ref={this.webcam}></WebcamCapture>
            <Button onClick={this.capture}>Capture photo</Button>
          </Content>
        </div>
      </BrowserRouter>
    );
  }
} export default withRouter(ImageTestPage);
