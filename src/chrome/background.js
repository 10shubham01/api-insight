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

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (details.method === "OPTIONS") return;
    console.log(
      "requestBody",
      details.requestBody?.raw
        ?.map(function (data) {
          return String.fromCharCode.apply(null, new Uint8Array(data.bytes));
        })
        .join("")
    );

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
    urls: ["<all_urls>"],
    types: ["xmlhttprequest"],
  },
  ["requestBody"]
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "getAPIRequests") {
    const activeRequests = apiRequests[currentTabId] || {};

    sendResponse(activeRequests);
  } else {
    sendResponse({});
  }
});
