console.log("Injecting the script");

// Listen for custom `xhrCaptured` events from the injected script
window.addEventListener("xhrCaptured", (event) => {
    const xhrData = event.detail;

    // Send the captured data to background.js
    chrome.runtime.sendMessage(xhrData, (response) => {
        console.log("Data sent to background script", response);
    });
});

// Inject `injected.js` into the webpage
var s = document.createElement('script');
s.src = chrome.runtime.getURL('injected.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);
