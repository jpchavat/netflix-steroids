function ajaxGetJson(url, okFunc, errorFunc, timeout) {
    // consoleLog("ENTRA ajaxGetJson");
    var xhr = new XMLHttpRequest();
    xhr.timeout = timeout;
    xhr.ontimeout = function () {
        throw ("Ajax json request timeout: " + url);
    };
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        // console.debug(this);
        if (this.readyState === 4) {
            if (this.status === 200) {
                okFunc(this.response);
            } else {
                // console.error("ERROR in ajaxGet response");
                errorFunc(this.response);
            }
        }
    };
    xhr.send();
    // consoleLog("TERMINA ajaxGetJson");
}

function consoleLog(text) {
    // console.log(config.extensionName, ": ", text);
}