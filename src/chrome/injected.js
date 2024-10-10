console.log("Starting injected server");

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
                // Log request body (postData)
                if (postData) {
                    if (typeof postData === 'string') {
                        try {
                            console.log("Request Body:", JSON.parse(postData));
                        } catch (err) {
                            console.log("Request Body (non-JSON):", postData);
                        }
                    } else {
                        console.log("Request Body (non-string):", postData);
                    }
                }

                // Log request headers
                console.log("Request Headers:", this._requestHeaders);

                // Log response headers
                var responseHeaders = this.getAllResponseHeaders();
                console.log("Response Headers:", responseHeaders);

                // Log response body if not a blob
                if (this.responseType != 'blob' && this.responseText) {
                    try {
                        console.log("Response Body:", JSON.parse(this.responseText));
                    } catch (err) {
                        console.log("Response Body (non-JSON):", this.responseText);
                    }
                }

                // Log the URL
                console.log("Request URL:", this._url);
            }
        });

        return send.apply(this, arguments);
    };
})(XMLHttpRequest);
