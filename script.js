var biggestIndex = 1;
var score = 0;
var clickPower = 1;
var upgradeCost = 10;

var themeToggleBtn = document.querySelector("#themeToggle");
var wallpaperBtn = document.querySelector("#wallpaperBtn");
var wallpaperInput = document.querySelector("#wallpaperInput");
var wallpaperDropZone = document.querySelector("#wallpaperDropZone");
var removeWallpaperBtn = document.querySelector("#removeWallpaperBtn");
var noteField = document.querySelector("#noteText");
var scoreDisplay = document.querySelector("#scoreDisplay");
var cpsDisplay = document.querySelector("#cpsDisplay");
var clickBtn = document.querySelector("#clickBtn");
var upgradeBtn = document.querySelector("#upgradeBtn");
var clearNotesBtn = document.querySelector("#clearNotesBtn");

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

// --- WALLPAPER HANDLER ---
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

// Drop zone interactions
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

// Paste support when Settings window is active
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