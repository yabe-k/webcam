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

function addOption(name, id) {
    var select = document.getElementById("select-camera");
    var option = document.createElement("option");
    option.text = name;
    option.value = id;
    select.appendChild(option);
}