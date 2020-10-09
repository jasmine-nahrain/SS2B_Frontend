import "detectrtc/DetectRTC.js";
import io from "socket.io-client";
// import './adapter-latest.js';
import "./IceServersHandler.js";
import "./CodecsHandler.js";
import "rtcpeerconnection/rtcpeerconnection.js";
import { broadcast } from "./broadcast.js";
var DetectRTC = require('detectrtc');

document.createElement("article");
document.createElement("footer");
// const queryString = window.location.search;
// const urlParams = new URLSearchParams(queryString);
//currently variables being used are passed using urlparams, this will need to be queried via the api. variable names examId, studentId and boolean examiner)

var config = {
  openSocket: function (config) {
    console.log("1");
    var SIGNALING_SERVER = 'http://localhost:3000'; //"https://socketio-over-nodejs2.herokuapp.com:443/";

    config.channel = config.channel || localStorage.getItem("exam_id"); //examId signifies exam being taken/exam being viewed
    console.log(config.channel);

    // document.getElementById('user_id').value = localStorage.getItem('user_id').toString();

    //show different ui based on examiner/examinee.

    if (localStorage.getItem("is_examiner") === 1)
      document.getElementById("createBroadcast").style.display = "none";
    if (localStorage.getItem("is_examiner") === 0)
      document.getElementById("listStudents").style.display = "none";
    var sender = Math.round(Math.random() * 999999999) + 999999999;

    io.connect(SIGNALING_SERVER).emit("new-channel", {
      channel: config.channel,
      sender: sender,
    });

    var socket = io.connect(SIGNALING_SERVER);
    socket.channel = config.channel;
    socket.on("connect", function () {
      if (config.callback) config.callback(socket);
    });

    socket.send = function (message) {
      socket.emit("message", {
        sender: sender,
        data: message,
      });
    };

    socket.on("message", config.onmessage);
    console.log(socket)
  },
  onRemoteStream: function (htmlElement) {
    videosContainer.appendChild(htmlElement);
    console.log(htmlElement);
  },
  onRoomFound: function (room) {
    var alreadyExist = document.querySelector(
      'button[data-broadcaster="' + room.broadcaster + '"]'
    );
    if (alreadyExist) return;

    if (typeof roomsList === "undefined") roomsList = document.body;

    var tr = document.createElement("tr");
    tr.innerHTML =
      "<td><strong>" +
      room.roomName +
      "</strong> is broadcasting his media!</td>" +
      '<td><button class="join">Join</button></td>';
    roomsList.appendChild(tr);
    console.log(room.roomName);

    var joinRoomButton = tr.querySelector(".join");
    joinRoomButton.setAttribute("data-broadcaster", room.broadcaster);
    joinRoomButton.setAttribute("data-roomToken", room.broadcaster);
    joinRoomButton.onclick = function () {
      //this.disabled = true;

      var broadcaster = this.getAttribute("data-broadcaster");
      var roomToken = this.getAttribute("data-roomToken");
      broadcastUI.joinRoom({
        roomToken: roomToken,
        joinUser: broadcaster,
      });
      hideUnnecessaryStuff();
    };
  },
  onNewParticipant: function (numberOfViewers) {
    document.title = "Viewers: " + numberOfViewers;
  },
  onReady: function () {
    console.log("now you can open or join rooms");
  },
};

export function setupNewBroadcastButtonClickHandler() {
  const studentId = localStorage.getItem("user_id");
  console.log(studentId.toString());
  // document.getElementById("setup-new-broadcast").disabled = true;

  DetectRTC.load(function () {
    captureUserMedia(function () {
      var shared = "video";
      broadcastUI.createRoom({
        roomName:
          (document.getElementById("user_id") || {}).value || "Anonymous",
        isAudio: shared === "audio",
      });
    });
    hideUnnecessaryStuff();
  });
}

function captureUserMedia(callback) {
  var constraints = null;
  var option = broadcastingOption ? broadcastingOption.value : "";
  var video = document.querySelector('video');


  if (
    option != "Only Audio" &&
    option != "Screen" &&
    DetectRTC.hasWebcam !== true
  ) {
    alert(
      "DetectRTC library is unable to find webcam; maybe you denied webcam access once and it is still denied or maybe webcam device is not attached to your system or another app is using same webcam."
    );
  }

  var htmlElement = document.createElement(
    option === "Only Audio" ? "audio" : "video"
  );

  htmlElement.muted = true;
  htmlElement.volume = 0;

  try {
    htmlElement.setAttributeNode(document.createAttribute("autoplay"));
    htmlElement.setAttributeNode(document.createAttribute("playsinline"));
    htmlElement.setAttributeNode(document.createAttribute("controls"));
  } catch (e) {
    htmlElement.setAttribute("autoplay", true);
    htmlElement.setAttribute("playsinline", true);
    htmlElement.setAttribute("controls", true);
  }

  var mediaConfig = {
    video: htmlElement,
    audio: true,
    onsuccess: function (stream) {
      config.attachStream = stream;
      videosContainer.srcObject = stream;
      videosContainer.appendChild(htmlElement);
      callback && callback();
    },
    onerror: function () {
      if (option === "Only Audio")
        alert("unable to get access to your microphone");
      else if (option === "Screen") {
        if (window.location.protocol === "http:")
          alert("Please test this WebRTC experiment on HTTPS.");
        else
          alert(
            'Screen capturing is either denied or not supported. Are you enabled flag: "Enable screen capture support in getUserMedia"?'
          );
      } else alert("unable to get access to your webcam");
    },
  };

  if (constraints) mediaConfig.constraints = constraints;
  navigator.mediaDevices.getUserMedia(mediaConfig)
  .then(function(stream) {
    video.srcObject = stream;
      config.attachStream = stream;
    htmlElement.setAttribute('src', stream);
    console.log(stream)
    console.log(htmlElement)
  });
}

var broadcastUI = broadcast(config);

/* UI specific */
var videosContainer =
  document.getElementById("videos-container") || document.body;
var setupNewBroadcast = document.getElementById("setup-new-broadcast");
var roomsList = document.getElementById("rooms-list");

var broadcastingOption = document.getElementById("broadcasting-option");

// if (setupNewBroadcast)
//   setupNewBroadcast.onclick = setupNewBroadcastButtonClickHandler();

function hideUnnecessaryStuff() {
  var visibleElements = document.getElementsByClassName("visible"),
    length = visibleElements.length;
  for (var i = 0; i < length; i++) {
    visibleElements[i].style.display = "none";
  }
}
