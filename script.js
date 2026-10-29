var biggestIndex = 1;
var score = 0;
var clickPower = 1;
var upgradeCost = 10;
var currentIndex = -1;

var playlist = [];

var player = new Audio();

var themeToggleBtn = document.querySelector("#themeToggle");
var wallpaperBtn = document.querySelector("#wallpaperBtn");
var wallpaperInput = document.querySelector("#wallpaperInput");
var wallpaperDropZone = document.querySelector("#wallpaperDropZone");
var removeWallpaperBtn = document.querySelector("#removeWallpaperBtn");

var noteField = document.querySelector("#noteText");
var clearNotesBtn = document.querySelector("#clearNotesBtn");

var scoreDisplay = document.querySelector("#scoreDisplay");
var cpsDisplay = document.querySelector("#cpsDisplay");
var clickBtn = document.querySelector("#clickBtn");
var upgradeBtn = document.querySelector("#upgradeBtn");

var musicBtn = document.querySelector("#musicBtn");
var musicInput = document.querySelector("#musicInput");
var musicDropZone = document.querySelector("#musicDropZone");
var musicList  = document.querySelector("#musicList");
var Prevbtn = document.querySelector("#Prevbtn");
var Playbtn = document.querySelector("#Playbtn");
var Nextbtn = document.querySelector("#Nextbtn");
var nowPlaying = document.querySelector("#nowPlaying");
var progressBar = document.querySelector("#progressBar");
var timeText = document.querySelector("#timeText");

function updateTime() {
    var currentTime = new Date().toLocaleTimeString();
    document.querySelector("#timeElement").innerHTML = currentTime;
}

function openWindow(element) {
    element.style.display = "flex";
    handleWindowTap(element);
    checkNotePlaceholder();
}

function closeWindow(element) {
    element.style.display = "none";
}

function handleWindowTap(element) {
    document.querySelectorAll(".window").forEach(function(win) {
        win.classList.remove("active");
    });
    biggestIndex++;
    element.style.zIndex = biggestIndex;
    element.classList.add("active");
}

function dragElement(element) {
    var initialX = 0, initialY = 0, currentX = 0, currentY = 0;
    var header = document.getElementById(element.id + "header");

    if (header) {
        header.onmousedown = startDragging;
    } else {
        element.onmousedown = startDragging;
    }

    function startDragging(e) {
        e = e || window.event;
        e.preventDefault();
        initialX = e.clientX;
        initialY = e.clientY;
        if (header) header.classList.add("dragging");
        document.onmouseup = stopDragging;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        currentX = initialX - e.clientX;
        currentY = initialY - e.clientY;
        initialX = e.clientX;
        initialY = e.clientY;
        element.style.top = (element.offsetTop - currentY) + "px";
        element.style.left = (element.offsetLeft - currentX) + "px";
    }

    function stopDragging() {
        if (header) header.classList.remove("dragging");
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function setupApp(appId) {
    var win = document.querySelector("#" + appId);
    var closeBtn = document.querySelector("#" + appId + "close");
    var icon = document.querySelector("#" + appId + "Icon");
    var openTrigger = document.querySelector("#" + appId + "open");

    dragElement(win);

    win.addEventListener("mousedown", function(e) {
        handleWindowTap(win);
        e.stopPropagation();
    });

    closeBtn.addEventListener("click", () => closeWindow(win));
    
    if (icon) {
        icon.addEventListener("dblclick", () => openWindow(win));
    }
    if (openTrigger) {
        openTrigger.addEventListener("click", () => openWindow(win));
    }
}

function checkNotePlaceholder() {
    if (noteField && noteField.innerText.trim() === "") {
        noteField.innerHTML = "";
    }
}

setInterval(updateTime, 1000);
updateTime();

document.body.addEventListener("click", function(e) {
    if (e.target === document.body) {
        document.activeElement.blur();
        document.querySelectorAll(".window").forEach(function(win) {
            win.classList.remove("active");
        });
    }
});

var savedWallpaper = localStorage.getItem("savedOSWallpaper");
if (savedWallpaper) {
    document.body.style.backgroundImage = "url('" + savedWallpaper + "')";
}

function applyWallpaper(file) {
    if (file && file.type.startsWith("image/")) {
        var reader = new FileReader();
        reader.onload = function(event) {
            var imageUrl = event.target.result;
            document.body.style.backgroundImage = "url('" + imageUrl + "')";
            localStorage.setItem("savedOSWallpaper", imageUrl);
        };
        reader.readAsDataURL(file);
    }
}

function addFiles(fileList) {
    for (var i = 0; i < fileList.length; i++) {
        var file = fileList[i];
        if (file && file.type.startsWith("audio/")) {
            var url = URL.createObjectURL(file);
            var dot = file.name.lastIndexOf(".");
            var title = file.name;
            if (dot > 0) {
                title = title.slice(0, dot);
            }
            playlist.push({title: title, url: url});
        }
    }
    renderPlaylist();
}

function renderPlaylist() {
    musicList.innerHTML = "";
    for (var i = 0; i < playlist.length; i++) {
        musicList.appendChild(makeRow(i));
    }
}

function makeRow(index) {
    var row = document.createElement("button");
    row.className = "music-row";
    row.textContent = (index + 1) + ". " + playlist[index].title;
    row.addEventListener("click", function() {
        playSong(index);
    });
    return row;
}

function playSong(index) {
    currentIndex = index;
    player.src = playlist[index].url;
    player.play();
    nowPlaying.textContent = playlist[index].title;
}

function formatTime(seconds) {
    var mins = Math.floor(seconds / 60);
    var secs = Math.floor(seconds % 60);
    return mins + ":" + String(secs).padStart(2, "0");
}

wallpaperBtn.addEventListener("click", function() {
    wallpaperInput.click();
});

wallpaperInput.addEventListener("change", function(e) {
    applyWallpaper(e.target.files[0]);
});

removeWallpaperBtn.addEventListener("click", function() {
    document.body.style.backgroundImage = "none";
    localStorage.removeItem("savedOSWallpaper");
});

wallpaperDropZone.addEventListener("dragover", function(e) {
    e.preventDefault();
    wallpaperDropZone.classList.add("dragover");
});

wallpaperDropZone.addEventListener("dragleave", function() {
    wallpaperDropZone.classList.remove("dragover");
});

wallpaperDropZone.addEventListener("drop", function(e) {
    e.preventDefault();
    wallpaperDropZone.classList.remove("dragover");
    applyWallpaper(e.dataTransfer.files[0]);
});

window.addEventListener("paste", function(e) {
    var settingsWin = document.querySelector("#settings");
    if (settingsWin.classList.contains("active")) {
        var items = e.clipboardData.items;
        for (var i = 0; i < items.length; i++) {
            if (items[i].type.startsWith("image/")) {
                applyWallpaper(items[i].getAsFile());
                break;
            }
        }
    }
});

themeToggleBtn.addEventListener("click", function() {
    document.body.classList.toggle("pastel-theme");
});

clickBtn.addEventListener("click", function() {
    score += clickPower;
    scoreDisplay.innerHTML = score;
    
    clickBtn.style.transform = "scale(1.2)";
    setTimeout(() => { clickBtn.style.transform = "scale(1)"; }, 100);
});

upgradeBtn.addEventListener("click", function() {
    var statusEl = document.querySelector("#upgradeStatus");
    if (score >= upgradeCost) {
        score -= upgradeCost;
        clickPower += 1;
        upgradeCost = Math.floor(upgradeCost * 1.8);
        
        scoreDisplay.innerHTML = score;
        cpsDisplay.innerHTML = "Clicks per tap: +" + clickPower;
        upgradeBtn.innerHTML = "Buy Upgrade (+1) - Cost: " + upgradeCost;
        if (statusEl) statusEl.innerHTML = "";
    } else {
        if (statusEl) statusEl.innerHTML = "Not enough points!";
    }
});

musicBtn.addEventListener("click", function() {
    musicInput.click();
});

musicInput.addEventListener("change", function(e) {
    addFiles(e.target.files);
    musicInput.value = "";
});

musicDropZone.addEventListener("dragover", function(e) {
    e.preventDefault();
    musicDropZone.classList.add("dragover");
});

musicDropZone.addEventListener("dragleave", function() {
    musicDropZone.classList.remove("dragover");
});

musicDropZone.addEventListener("drop", function(e) {
    e.preventDefault();
    musicDropZone.classList.remove("dragover");
    addFiles(e.dataTransfer.files);
});

Playbtn.addEventListener("click", function() {
    if (currentIndex === -1) {
        if(playlist.length > 0) {playSong(0); }
        return;
    }
    if (player.paused) {
        player.play();
    } else {
        player.pause();
    }
});

player.addEventListener("play", function() {
    Playbtn.textContent = "⏸";
});

player.addEventListener("pause", function() {
    Playbtn.textContent = "▶";
});

player.addEventListener("ended", function() {
    var next = currentIndex + 1;
    if (next >= playlist.length ) { next = 0;}
    playSong(next);
});

player.addEventListener("timeupdate", function() {
    if (player.duration) {
        progressBar.value = (player.currentTime / player.duration) * 100;
        timeText.textContent = formatTime(player.currentTime) + " / " + formatTime(player.duration);
    }
});

Prevbtn.addEventListener("click", function() {
    if (currentIndex === -1) { return; }
    var prev = currentIndex - 1;
    if (prev < 0 ) { prev = playlist.length - 1;}
    playSong(prev);
});

Nextbtn.addEventListener("click", function() {
    if (currentIndex === -1) { return; }
    var next = currentIndex + 1;
    if (next >= playlist.length ) { next = 0;}
    playSong(next);
});

progressBar.addEventListener("input", function() {
    if (currentIndex === -1 || !player.duration) { return; }
    player.currentTime = (progressBar.value / 100) * player.duration;
});

if (noteField) {
    var savedNote = localStorage.getItem("savedOSNote");
    if (savedNote && savedNote.trim() !== "") {
        noteField.innerHTML = savedNote;
    } else {
        checkNotePlaceholder();
    }

    noteField.addEventListener("input", function() {
        checkNotePlaceholder();
        localStorage.setItem("savedOSNote", noteField.innerHTML);
    });

    noteField.addEventListener("blur", checkNotePlaceholder);
}

if (clearNotesBtn) {
    clearNotesBtn.addEventListener("click", function() {
        noteField.innerHTML = "";
        localStorage.removeItem("savedOSNote");
        checkNotePlaceholder();
    });
}

setupApp("clicker");
setupApp("welcome");
setupApp("notes");
setupApp("settings");
setupApp("music");