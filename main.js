var video_interval = 30000;
var access_token = "AIzaSyCyiJbyrtNRSQkD4CRo8Ud2TDuPmefqXvc"
var mediaRecorder;
var live = true;
document.getElementById('golivebutton').onclick = function(evt) {
    live = !live;
    if(live) {
        mediaRecorder.start();
    } else {
        mediaRecorder.stop();
    }
};
var video = document.getElementById('video-element');
var data;
var mediaChunks = [];
function capture(){
	mediaRecorder.stop();
}
const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item);
function startup() { // {facingMode: "environment"}
  navigator.mediaDevices.getUserMedia({video: true, audio: {echoCancellation: false}}).then(function(stream) {
    video.srcObject = stream;
    video.play();
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.addEventListener("dataavailable", (event) => {
        mediaChunks.push(event.data);
        var file = new Blob(mediaChunks, {'type': 'video/webm'});
	mediaChunks = [];
	mediaRecorder.start();
	var file = new File([file], 'frame.webm');
	var uploadVideo = new UploadVideo();
    	uploadVideo.uploadFile(file);
    });
    mediaRecorder.start();
    setTimeout(function(){
  	  setInterval(capture, video_interval);
    }, video_interval);
  }).catch(function(err) {
    console.log("An error occurred: " + err);
  });
}
startup();
