function captureImage(video){
    const canvas = document.getElementById("picture")
    const soundFile = "./sound/sound2.mp3";
    const audio = new Audio(soundFile);
    audio.play();
    const fileName = "capture_" + getTime() + ".png";
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
}

function getTime(){
    now = new Date();
    return now.getFullYear() + "-" + ("00" + String(Number(now.getMonth()) + 1)).slice(-2) + "-" + ("00" + now.getDate()).slice(-2) + "_" + ("00" + now.getHours()).slice(-2) + "-" + ("00" + now.getMinutes()).slice(-2)+ "-" + ("00" + now.getSeconds()).slice(-2)
}

function playVideo(){
    const video = document.getElementById("video");
    var selectedId = document.getElementById("select-camera").value;
    var video_height = document.getElementById("video-height").value;
    var video_width = document.getElementById("video-width").value;
    //console.log(selectedId);
    navigator.mediaDevices.getUserMedia({
        video: {
            deviceId: selectedId,
            width: video_width,
            height: video_height,
        },
        audio: false,
    }).then(stream => {
        video.srcObject = stream;
        video.play()
    }).catch(e => {
        console.log(e)
    }).finally(() => {
        
        var canvas = document.getElementById("picture")
        var w = video.clientWidth;
        var h = video.clientHeight;
        
    })
}

function inputVal(w, h) {
    document.getElementById("video-height").value = h;
    document.getElementById("video-width").value = w;
    playVideo();
}