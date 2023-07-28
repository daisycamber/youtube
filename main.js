var mediaRecorder;
function reportWindowSize() {
        var iFrame = document.getElementById('live');
        resizeIFrameToFitContent(iFrame);
}
window.onresize = reportWindowSize;
function resizeIFrameToFitContent(iFrame) {
    iFrame.height = iFrame.contentWindow.document.body.scrollHeight;
}
window.onmessage = function(event){
    if (event.data == 'resize') {
        var iFrame = document.getElementById('live');
        resizeIFrameToFitContent(iFrame);
    }
};
var live = false;
document.getElementById('golivebutton').onclick = function(evt) {
    live = !live;
    if(live) {
        mediaRecorder.start();
    } else {
        mediaRecorder.stop();
    }
};
var form = document.getElementById('live-form');
var video = document.getElementById('video-element');
var data;
var mediaChunks = [];
function capture(){
	mediaRecorder.stop();
}
const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item);
function startup() {
  navigator.mediaDevices.getUserMedia({video: {% if request.GET.back %}{facingMode: "environment"}{% else %}true{% endif %}, audio: {echoCancellation: false}}).then(function(stream) {
    video.srcObject = stream;
    video.play();
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.addEventListener("dataavailable", (event) => {
        mediaChunks.push(event.data);
        var file = new Blob(mediaChunks, {'type': 'video/webm'});
	mediaChunks = [];
	mediaRecorder.start();
	if(live) {
	        var file = new File([file], 'frame.webm');
    
	}
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
