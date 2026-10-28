var biggestIndex = 1;
var score = 0;
var clickPower = 1;
var upgradeCost = 10;

var themeToggleBtn = document.querySelector("#themeToggle");
var noteField = document.querySelector("#noteText");
var scoreDisplay = document.querySelector("#scoreDisplay");
var cpsDisplay = document.querySelector("#cpsDisplay");
var clickBtn = document.querySelector("#clickBtn");
var upgradeBtn = document.querySelector("#upgradeBtn");

function updateTime() {
    var currentTime = new Date().toLocaleTimeString();
    document.querySelector("#timeElement").innerHTML = currentTime;
}

function openWindow(element) {
    element.style.display = "flex";
    biggestIndex++;
    element.style.zIndex = biggestIndex;
    
    checkNotePlaceholder();
}

function closeWindow(element) {
    element.style.display = "none";
}

function handleWindowTap(element) {
    biggestIndex++;
    element.style.zIndex = biggestIndex;
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
    win.addEventListener("mousedown", () => handleWindowTap(win));

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

setupApp("clicker");
setupApp("welcome");
setupApp("notes");