(function (xhr) {
    var XHR = XMLHttpRequest.prototype;

    var open = XHR.open;
    var send = XHR.send;
    var setRequestHeader = XHR.setRequestHeader;

    XHR.open = function (method, url) {
        this._method = method;
        this._url = url;
        this._requestHeaders = {};
        this._startTime = (new Date()).toISOString();

        return open.apply(this, arguments);
    };

    XHR.setRequestHeader = function (header, value) {
        this._requestHeaders[header] = value;
        return setRequestHeader.apply(this, arguments);
    };

    XHR.send = function (postData) {
        this.addEventListener('load', function () {
            var endTime = (new Date()).toISOString();
            var myUrl = this._url ? this._url.toLowerCase() : this._url;

            if (myUrl) {
                var requestBody = null;
                if (postData) {
                    if (typeof postData === 'string') {
                        try {
                            requestBody = JSON.parse(postData);
                        } catch (err) {
                            requestBody = postData;
                        }
                    } else {
                        requestBody = postData;
                    }
                }

                var responseBody = null;
                if (this.responseType != 'blob' && this.responseText) {
                    try {
                        responseBody = JSON.parse(this.responseText);
                    } catch (err) {
                        responseBody = this.responseText;
                    }
                }

                // Create a custom event with the request/response data
                const event = new CustomEvent("xhrCaptured", {
                    detail: {
                        url: this._url,
                        method: this._method,
                        requestBody: requestBody,
                        responseBody: responseBody,
                        requestHeaders: this._requestHeaders,
                        responseHeaders: this.getAllResponseHeaders(),
                        timeStamp: endTime,
                    }
                });
                
                // Dispatch the event so it can be captured by `inject.js`
                window.dispatchEvent(event);
            }
        });

        return send.apply(this, arguments);
    };
})(XMLHttpRequest);
