function updateTime() {
    var currentTime = new Date().toLocaleTimeString();
    document.querySelector("#timeElement").innerHTML = currentTime;
}
setInterval(updateTime, 1000);
updateTime();

var biggestIndex = 1;
var themeToggleBtn = document.querySelector("#themeToggle");

function openWindow(element) {
    element.style.display = "flex";
    biggestIndex++;
    element.style.zIndex = biggestIndex;
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

themeToggleBtn.addEventListener("click", function() {
    // Toggles the class on and off the body element
    document.body.classList.toggle("pastel-theme");
});

setupApp("welcome");
setupApp("notes");