
console.log("Daily version: %s", DailyIframe.version());

// Account & room settings
const ROOM_URL = "https://bdom.staging.daily.co/coffee";
const dailyConfig = {
  experimentalChromeVideoMuteLightOff: true
};

function App() {

  const joinCallButton = document.getElementById("joinCallButton");
    joinCallButton.onclick = () => {
      createAndJoin();
  };

    const startScreenShareButton = document.getElementById("startScreenShareButton");
    startScreenShareButton.onclick = () => {
      startScreenShare();
  };

    const toggleScreenShareButton = document.getElementById("toggleScreenShareButton");
    toggleScreenShareButton.onclick = () => {
      toggleScreenShare();
  };

    const stopScreenShareButton = document.getElementById("stopScreenShareButton");
    stopScreenShareButton.onclick = () => {
      stopScreenShare();
  };

    const muteAudioButton = document.getElementById("muteAudioButton");
    muteAudioButton.onclick = () => {
      muteAudio();
  };

      const leaveCallButton = document.getElementById("leaveCallButton");
    leaveCallButton.onclick = () => {
      leaveRoom();
  };

        const logParticipantsButton = document.getElementById("logParticipantsButton");
    logParticipantsButton.onclick = () => {
      logParticipants();
  };

  // Create call object instance
  const callObject = DailyIframe.createCallObject({
    subscribeToTracksAutomatically: true,
    dailyConfig
  });

  const createAndJoin = async () => {
    await callObject.join({
      url: ROOM_URL,
    });
    console.log("joined: ", ROOM_URL);
  };

  // events
  callObject.once("joined-meeting", meetingJoined);
  callObject.on("track-started", startTrack);
  callObject.on("track-stopped", stopTrack);
  callObject.on("participant-joined", participantJoined);
  callObject.on("participant-updated", updateParticipant);

  function meetingJoined(evt) {
    console.log("You joined the meeting: ", evt);
  }

  function participantJoined(evt) {
    console.log("Participant joined meeting: ", evt);
  }

  function updateParticipant(evt) {
    console.log("Participant updated: ", evt);
  }

  function startTrack(evt) {
    console.log("track started test: ", evt);
    if (evt.track.kind === "audio" && evt.participant.local === false) {
      let audiosDiv = document.getElementById("audios");
      let audioEl = document.createElement("audio");
      audiosDiv.appendChild(audioEl);
      audioEl.style.width = "100%";
      audioEl.srcObject = new MediaStream([evt.track]);
      audioEl.play();
    } else if (evt.track.kind === "video") {
      let videosDiv = document.getElementById("videos");
      let videoEl = document.createElement("video");
      videosDiv.appendChild(videoEl);
      videoEl.style.width = "100%";
      videoEl.srcObject = new MediaStream([evt.track]);
      videoEl.play();
    }
  }

  function stopTrack(evt) {
    let vids = document.getElementsByTagName("video");
    for (let vid of vids) {
      if (vid.srcObject && vid.srcObject.getVideoTracks()[0] === evt.track) {
        vid.remove();
      }
    }
  }

  var mediaStream;

  /* async function startScreenShare() {
    const { desktopCapturer } = require('electron')
    desktopCapturer.getSources({
      types: ['window', 'screen']
    }).then(async sources => {
      for (const source of sources) {
        if (source.name === 'Chrome') {
            mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id,
                }
              }
            })
          return
          }
      }
    })
  callObject.startScreenShare({ mediaStream });

  } */

  async function startScreenShare() {
    mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
            },
          },
        })
  callObject.startScreenShare({ mediaStream });
  }


  async function toggleScreenShare() {
    callObject.stopScreenShare();
    callObject.startScreenShare({ mediaStream });
  }

  async function stopScreenShare() {
    callObject.stopScreenShare();
  }

  async function leaveRoom() {
    let vids = document.getElementsByTagName("video");
    for (let vid of vids) {
      vid.remove();
    }
    await callObject.leave();
  }

  async function muteAudio() {
    callObject.setLocalAudio(false);
  }

  function logParticipants() {
    console.log(callObject.participants());
  }
  } 

App()