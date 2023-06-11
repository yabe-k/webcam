function captureImage(video, w, h){
    const canvas = document.getElementById("picture")
    const soundFile = "./sound/sound2.mp3";
    const audio = new Audio(soundFile);
    audio.play();
    const fileName = "capture_" + getTime() + ".png";
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, w, h);

    canvas.toBlob( blob =>{
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        console.log(getTime() + ".png");
        a.download = getTime() + ".png";
        a.click();

        URL.revokeObjectURL(a.href);
        
    },"image/png",1.0);

}

function getTime(){
    now = new Date();
    return now.getFullYear() + "-" + ("00" + String(Number(now.getMonth()) + 1)).slice(-2) + "-" + ("00" + now.getDate()).slice(-2) + "_" + ("00" + now.getHours()).slice(-2) + "-" + ("00" + now.getMinutes()).slice(-2)+ "-" + ("00" + now.getSeconds()).slice(-2)
}

function playVideo(){
    const video = document.getElementById("video");
    const tracks = video.srcObject.getTracks();
    tracks.forEach(track => {
        track.stop();
    });
    video.srcObject = null;
    
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
        canvas = document.getElementById("picture");
        canvas.width = video_width;
        canvas.height = video_height;
        
    })
}

function inputVal(w, h) {
    document.getElementById("video-height").value = h;
    document.getElementById("video-width").value = w;
    playVideo();
}