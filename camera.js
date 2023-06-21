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

    var filename = device_name + "_" + getTime() + ".png";

    canvas.toBlob( blob =>{
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        console.log(filename);
        a.download = filename;
        a.click();

        URL.revokeObjectURL(a.href);
        
    },"image/png",1.0);

}

function startRecording(){
    const options = { mimeType: 'video/webm;codecs=vp9,opus' };
    mediaRecorder = new MediaRecorder(video_stream, options);
    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        // 録画データが格納される
        recordedBlobs.push(event.data);
      }
    };
    mediaRecorder.start();
    console.log('録画開始');
}

function stopRecording(filename="recording.webm", save=true){
    mediaRecorder.stop();
    console.log('録画停止');
    if (save){
        setTimeout(function(){
            saveRecording(filename);
        }, 2000);
    }
}

function saveRecording(filename="recording.webm") {
    const blob = new Blob(recordedBlobs, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    recordedBlobs = [];
}

function recordVideo(duration){//決められた時間の動画を撮影
    document.getElementById("intermittent").classList.add("recording");
    var device_name = document.getElementById("camera-name").value;
    if (device_name == ""){
        device_name = document.getElementById("select-camera").value.slice(-16);
    }
    var filename = device_name + "_" + getTime() + ".webm";
    startRecording();
    setTimeout(function(){
        stopRecording(filename=filename);
        document.getElementById("intermittent").classList.remove("recording");
    }, duration);
}

function getTime(){
    now = new Date();
    return now.getFullYear() + "-" + ("00" + String(Number(now.getMonth()) + 1)).slice(-2) + "-" + ("00" + now.getDate()).slice(-2) + "_" + ("00" + now.getHours()).slice(-2) + "-" + ("00" + now.getMinutes()).slice(-2)+ "-" + ("00" + now.getSeconds()).slice(-2)
}

async function playVideo(){
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
    video_stream = await navigator.mediaDevices.getUserMedia({
        video: {
            deviceId: selectedId,
            width: video_width,
            height: video_height,
        },
        audio: false,
    }).catch(e => {
        console.log(e);
    })
    video.srcObject = video_stream;
    video.play();
    canvas = document.getElementById("picture");
    canvas.width = video_width;
    canvas.height = video_height;
}

async function playVideo_and_getCamera(){
    const video = document.getElementById("video");
    video_stream = await navigator.mediaDevices.getUserMedia({
        video: {
            width: video_width,
            height: video_height,
        },
        audio: false,
    }).catch(e => {
      console.log(e)
    })
    video.srcObject = video_stream;
    video.play();
    navigator.mediaDevices.enumerateDevices()
        .then(
            function(devices){
                var select = document.getElementById("select-camera");
                devices.forEach(function(device) {
                    //console.log(device.kind, device.label);
                    var option = document.createElement("option");
                    option.text = device.label;
                    option.value = device.deviceId;
                    select.appendChild(option);
                });
            }
        ).catch(
            console.log("Failed to load the device list")
        ).finally(()=>{
            canvas = document.getElementById("picture");
            canvas.width = video_width;
            canvas.height = video_height;
        });
}

function inputVal(w, h) {
    document.getElementById("video-height").value = h;
    document.getElementById("video-width").value = w;
    playVideo();
}

function timelupse(){
    var interval = document.getElementById("timelupse-minutes").value;
    if (interval == ""){
        alert("Set the interval time!");
        return;
    }
    document.getElementById("btn-timelupse").innerText = "Stop";
    document.getElementById("btn-timelupse").setAttribute('onclick',"stopTimelupse()");
    document.getElementById("timelupse").classList.add("conducting");
    
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
    document.getElementById("timelupse").classList.remove("conducting");
    clearInterval(interval_timelupse);
    document.getElementById("btn-timelupse").innerText = "Start";
    document.getElementById("btn-timelupse").setAttribute('onclick',"timelupse()");
    document.getElementById("timelupse").classList.remove("emphasis");
}

function startSingleVideo(){
    if (isRecording){
        alert("Another recording program is already running");
        return;
    }
    document.getElementById("single-video").classList.add("recording");
    document.getElementById("btn-singleVideo").setAttribute('onclick',"stopSingleVideo()");
    document.getElementById("btn-singleVideo").innerText = "stop";
    isRecording = true;

    var device_name = document.getElementById("camera-name").value;
    if (device_name == ""){
        device_name = document.getElementById("select-camera").value.slice(-16);
    }
    var filename = device_name + "_" + getTime() + ".webm";

    var duration = Number(document.getElementById("single-video-minutes").value);
    if (duration > 0){
        startRecording();
        setTimeout(function(){stopSingleVideo(filename);}, duration * 1000 * 60);
    }else{
        startRecording();
    }
}

function stopSingleVideo(filename){
    document.getElementById("single-video").classList.remove("recording");
    document.getElementById("btn-singleVideo").setAttribute('onclick',"startSingleVideo()");
    document.getElementById("btn-singleVideo").innerText = "start";
    isRecording = false;
    stopRecording(filename);
}

function startIntermittentVideo(){
    if (isRecording){
        alert("Another recording program is already running");
        return;
    }
    var max_hour = Number(document.getElementById("intermittent-max-hour").value);
    var duration = Number(document.getElementById("intermittent-duration").value);
    var interval = Number(document.getElementById("intermittent-interval").value);
    if (interval <= 0){
        alert("Set the interval time");
        return;
    }
    if (duration <= 0){
        alert("Set the duration time");
        return;
    }
    if (duration * 60 >= interval * 60 - 1){
        console.log(duration * 60, interval * 60 - 1);
        alert("The duration must be greater than the interval by 1 sec.");
        return;
    }
    document.getElementById("intermittent").classList.add("conducting");
    document.getElementById("btn-intermittent").setAttribute('onclick',"stopIntermittentVideo()");
    recordVideo(duration * 1000 * 60);
    document.getElementById("btn-intermittent").innerText = "stop";
    isRecording = true;
    interval_intermittent = setInterval(function(){recordVideo(duration * 1000 * 60);}, interval * 1000 * 60);
    timeout_stop_interval = setTimeout(function(){stopIntermittentVideo();}, max_hour * 1000 * 60 * 60 + 10);
}

function stopIntermittentVideo(){
    isRecording = false;
    document.getElementById("intermittent").classList.remove("conducting");
    document.getElementById("btn-intermittent").setAttribute('onclick',"startIntermittentVideo()");
    document.getElementById("btn-intermittent").innerText = "start";
    clearInterval(interval_intermittent);
    clearTimeout(timeout_stop_interval);
}