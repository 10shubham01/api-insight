import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import "./index.css";

function Popup() {
  const [apiRequests, setApiRequests] = useState({});

  useEffect(() => {
    // Request API requests from the background script
    chrome.runtime.sendMessage("getAPIRequests", (response) => {
      if (response) {
        setApiRequests(response); // Set the API requests received from background
      }
    });
  }, []);

  return (
    <div className="api-requests-list p-4 bg-white shadow-lg rounded-lg">
      <h3 className="text-xl font-bold mb-4">
        API Calls (XHR/Fetch) by Tab URL:
      </h3>
      {Object.keys(apiRequests).length === 0 ? (
        <p className="text-gray-500">No API calls made in this tab.</p>
      ) : (
        <ul className="space-y-4">
          {Object.entries(apiRequests).map(([tabUrl, requests], index) => (
            <li key={index} className="border p-3 rounded-md bg-gray-50 shadow">
              <strong className="text-blue-600">Tab URL:</strong> {tabUrl}
              <ul className="mt-2 space-y-2">
                {requests.map((request, reqIndex) => (
                  <li
                    key={reqIndex}
                    className="p-2 border-l-4 border-blue-400 bg-white rounded-md shadow-sm"
                  >
                    <strong className="font-semibold">API URL:</strong>{" "}
                    {request.url} <br />
                    <strong className="font-semibold">Method:</strong>{" "}
                    {request.method} <br />
                    <strong className="font-semibold">Time:</strong>{" "}
                    {new Date(request.timeStamp).toLocaleTimeString()}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

render(<Popup />, document.getElementById("popup-root"));
