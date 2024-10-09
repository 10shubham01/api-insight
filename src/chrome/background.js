let apiRequests = {};
let currentTabId = null;
let currentTabUrl = null;

// Listen for changes to the active tab
chrome.tabs.onActivated.addListener((activeInfo) => {
  currentTabId = activeInfo.tabId; // Update the current tab ID
});

// Listen for updates to the tab URL
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only capture the URL if the tab is active and has a valid URL
  if (tabId === currentTabId && changeInfo.status === 'complete' && tab.url) {
    currentTabUrl = tab.url; // Update the current tab URL

    // Initialize the API requests array for the current tab URL if it doesn't exist
    if (!apiRequests[currentTabId]) {
      apiRequests[currentTabId] = {}; // Initialize an object for the current tab ID
    }

    if (!apiRequests[currentTabId][currentTabUrl]) {
      apiRequests[currentTabId][currentTabUrl] = []; // Initialize array for the current tab URL
    }
  }
});

// Listen for completed web requests
chrome.webRequest.onCompleted.addListener(
  function (details) {
    // Check if the request belongs to the current active tab and it's XHR/Fetch
    if (details.tabId === currentTabId && details.type === "xmlhttprequest") {
      if (currentTabUrl && apiRequests[currentTabId]) {
        apiRequests[currentTabId][currentTabUrl].push({
          url: details.url,
          method: details.method,
          timeStamp: details.timeStamp,
        });
      }
    }
  },
  {
    urls: ["<all_urls>"], // Monitor all URLs
    types: ["xmlhttprequest"], // Filter for XHR/Fetch requests
  }
);

// Listen for messages from the popup to send back the captured API requests for the active tab
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "getAPIRequests") {
    // Send all the requests collected for the active tab (including all navigations within the tab)
    const activeRequests = apiRequests[currentTabId] || {};
    
    sendResponse(activeRequests); // Send all requests for the current tab
  } else {
    sendResponse({}); // Return an empty object if no requests
  }
});
