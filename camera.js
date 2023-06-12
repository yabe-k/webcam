function captureImage(video, w, h){
    const canvas = document.getElementById("picture")
    const soundFile = "./sound/sound2.mp3";
    const audio = new Audio(soundFile);
    audio.play();
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, w, h);

    var device_name = document.getElementById("camera-name").value;
    if (device_name == ""){
        device_name = document.getElementById("select-camera").value.slice(-16);
    }

    filename = device_name + "_" + getTime() + ".png";

    canvas.toBlob( blob =>{
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        console.log(filename);
        a.download = filename;
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

function blink(id) {
    document.getElementById(id).classList.toggle("emphasis");
}

function timelupse(){
    var interval = document.getElementById("timelupse-minutes").value;
    if (interval == ""){
        alert("Set the interval time!");
        return;
    }
    document.getElementById("btn-timelupse").innerText = "Stop";
    document.getElementById("btn-timelupse").setAttribute('onclick',"stopTimelupse()");
    interval_blink = setInterval(function(){
        blink("timelupse");
    }, 700);
    
    document.getElementById("capture_button").click();

    var now = new Date();
    timelupse_started = now.getTime();
    interval_timelupse = setInterval(function(){
        var now = new Date();
        var now_unix = now.getTime();
        var max_time = Number(document.getElementById("timelupse-number").value);
        console.log((now_unix - timelupse_started) / 1000 / 60 / 60, max_time);
        if(max_time > 0 && (now_unix - timelupse_started) / 1000 / 60 / 60 > max_time){
            document.getElementById("btn-timelupse").click();
        }
        document.getElementById("capture_button").click();
    }, interval * 60 * 1000)
}

function stopTimelupse(){
    clearTimeout(interval_blink);
    clearInterval(interval_timelupse);
    document.getElementById("btn-timelupse").innerText = "Start";
    document.getElementById("btn-timelupse").setAttribute('onclick',"timelupse()");
    document.getElementById("timelupse").classList.remove("emphasis");
}