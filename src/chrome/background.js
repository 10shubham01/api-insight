let apiRequests = {};
let currentTabId = null;
let currentTabUrl = null;

chrome.tabs.onActivated.addListener((activeInfo) => {
  currentTabId = activeInfo.tabId;
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === currentTabId && changeInfo.status === "complete" && tab.url) {
    currentTabUrl = tab.url;

    if (!apiRequests[currentTabId]) {
      apiRequests[currentTabId] = {};
    }

    if (!apiRequests[currentTabId][currentTabUrl]) {
      apiRequests[currentTabId][currentTabUrl] = [];
    }
  }
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.url && currentTabId === sender.tab.id) {
    if (currentTabUrl && apiRequests[currentTabId]) {
      apiRequests[currentTabId][currentTabUrl].push({
        url: message.url,
        method: message.method,
        requestBody: message.requestBody,
        responseBody: message.responseBody,
        requestHeaders: message.requestHeaders,
        responseHeaders: message.responseHeaders,
        timeStamp: message.timeStamp,
      });
    }
  }

  if (message === "getAPIRequests") {
    const activeRequests = apiRequests[currentTabId] || {};
    sendResponse(activeRequests);
  }
});
