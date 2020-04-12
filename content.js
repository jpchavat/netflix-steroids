/* 
Author: Juan Pablo Chavat (jupach *at* gmail *dot* com)
*/

consoleLog("STARTING");

function getTitlesAndYears() {
    let movies = [];
    Array.from(document.querySelectorAll(".jawBone")).forEach(m => {
        movies.push({
            title: m.querySelector(".title .logo").alt,
            year: m.querySelector(".meta .year").textContent,
            metaElement: m.querySelector(".meta")
        })
    });

    return movies;
}

function getTmdbApi(url, qryParams, okFunc, errorFunc) {
    var paramsStr = `api_key=${config.apiKey}`;
    for (var key in qryParams) {
        // if (params.hasOwnProperty(key)) {
        paramsStr += `&${key}=${encodeURIComponent(qryParams[key])}`;
        // }
    }
    var url = config.baseUri + url + "?" + paramsStr;
    ajaxGetJson(url, okFunc, errorFunc, config.timeout);
}

function getTmdbId(imdbId, data, okFunc, errorFunc) {
    newOkFunc = (resp) => {
        respJson = JSON.parse(resp);
        allMatches = [];
        for (var x in respJson) {
            allMatches = allMatches.concat(respJson[x]);
        }
        // consoleLog(allMatches);
        data.tmdbId = allMatches[0].id;
        okFunc(data);
    }
    getTmdbApi(`/find/${imdbId}`, { external_source: "imdb_id" }, newOkFunc, errorFunc);
}

function getImdbId(title, data, okFunc, errorFunc) {
    let titleEncoded = encodeURI(title)
    resultFunc = (r) => {
        let elemHtml = document.createElement('div');
        let start = r.search('<a href="/title/') + 16;
        if (start === -1) {
            start = r.search("<a href='/title/") + 16;
        }
        let imdbId = r.slice(start, start + 20); // To be sure that slice takes the id
        imdbId = imdbId.split("/")[0];

        data.imdbId = imdbId
        okFunc(data);
    }
    ajaxGetJson(`https://www.imdb.com/find?q=${titleEncoded}&exact=true`, resultFunc, errorFunc, 5000);
}

function createStorageKey(title, year) {
    return `NETFLIX-STEROIDS:${title}:${year}`;
}

function getFromStorage(title, year) {
    data = window.sessionStorage.getItem(createStorageKey(title, year))
    if (data !== undefined) {
        data = JSON.parse(data);
    }
    return data;
}

function setToStorage(title, year, data) {
    if (typeof data !== "string") {
        data = JSON.stringify(data);
    }
    window.sessionStorage.setItem(createStorageKey(title, year), data);
}

function drawSteroidsData(data) {
    let elemId = createStorageKey(data.title, data.year);
    elem = document.getElementById(elemId);
    if (!elem) {
        let videoResult = data.videoUrl ? `<a href='${data.videoUrl}' target='_blank'>Trailer</a>` : "No Trailer";
        let content = `<div id="${elemId}"><h1>${videoResult}</h1></div>`;
        data.metaElement.insertAdjacentHTML(
            "afterEnd", content
        )
    }
}

function loadSteroids() {
    let movies = getTitlesAndYears();
    // consoleLog(movies);

    movies.forEach(m => {

        let storedData = getFromStorage(m.title, m.year);
        if (storedData) {
            consoleLog(`Found title "${storedData.title}" in storage cache.`);
            storedData.metaElement = m.metaElement;
            drawSteroidsData(storedData);
        } else {

            getImdbId(
                m.title,
                m,
                (data) => {
                    getTmdbId(
                        data.imdbId,
                        data,
                        (data) => {
                            consoleLog(`${data.title} (IMDB Id: ${data.imdbId}, TMDB Id: ${data.tmdbId})`);
                            getTmdbApi(
                                `/movie/${data.tmdbId}/videos`, {},
                                (v) => {
                                    var v = JSON.parse(v);
                                    if (v.results.length === 0) {
                                        consoleLog(`No video results for movide id ${data.tmdbId}`);
                                        data.videoUrl = undefined;
                                    } else {
                                        consoleLog("Number of found videos " + v.results.length);
                                        data.videoUrl = config.videoBaseUrl + v.results[0].key;
                                    }
                                    setToStorage(data.title, data.year, data);
                                    drawSteroidsData(data);
                                },
                                (err) => consoleLog(`Error requesting video for id ${data.tmdbId}`)
                            );
                        },
                        (err) => consoleLog(`Error getting tmdb id for title ${m.title}.`)
                    )
                },
                (err) => {
                    consoleLog(`Error getting imdb id for title ${m.title}.`);
                }
            );
        }
    });
}

// Throttle function to control execution of loadSteroids
const throttle = (func, limit) => {
    let throttleKey = `${config.extensionName}:throttle`;
    let inThrottle = window.sessionStorage.getItem(throttleKey);
    if (inThrottle == undefined || (inThrottle && (Date.now() - Number(inThrottle)) > limit)) {
        window.sessionStorage.setItem(throttleKey, Date.now());
        func();
        window.sessionStorage.removeItem(throttleKey, null);
    }
}

if (window.sessionStorage !== "undefined") {
    /* 
    More info aboutMutationObserver in:
    https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
    */


    var targetNode = document.body;

    // create an observer instance
    var observer = new MutationObserver(
        () => window.setTimeout(throttle, 10, loadSteroids, 2000)
    );
    // configuration of the observer:
    let observerConfig = {
        attributes: true,
        childList: true,
        characterData: true
    };
    observer.observe(targetNode, observerConfig);
}


/*

TO-DO LIST:

- Controlar el 404 de /movie/90614/videos?
- [DONE] Generar .gitignore para no subir la api_key a github
- [DONE] Habilitar cache en storage
- [DONE] Habilitar MutationObserver

FUTURE FEATURES:
- Agregar TAB con trailer
- Controlar si ya tiene trailer y si lo tiene el link debe abrir el tab de trailer

*/