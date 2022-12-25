let windowLocation = null;

chrome.runtime.onMessage.addListener(
    function(req, sender, sendResponse) {
        if (req.torrentId) {
            windowLocation = req.windowLocation;

            addToClient(req.torrentId).then((r) => {
                console.log(r)

                if (r) {
                    sendResponse({
                        success: true,
                        message: "Torrent added to qBittorrent"
                    });
                }

                if (!r) {
                    sendResponse({
                        success: false,
                        message: "Error adding torrent to qBittorrent"
                    });
                }

            });

            return true;
        }
    }
);

async function addToClient(torrentId) {
    const qbCreds = await getStoredQbCreds();
    const creds = qbCreds.qbCreds;

    if (!creds || (!creds.host || !creds.username || !creds.password)) {
        return false;
    }

    await qbitLogin(creds);

    await qbitAddTorrent(torrentId);

    return true;
}

function getStoredQbCreds() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['qbCreds'], function (value) {
            if (value.qbCreds) {
                resolve(value);
            } else {
                reject();

                return false;
            }
        });
    });
}

function getStoredYggPasskey() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['yggPasskey'], function (value) {
            if (value.yggPasskey) {
                resolve(value.yggPasskey);
            } else {
                reject();

                return false;
            }
        });
    });
}

function adjustHostURL(url) {
    let result = url;

    if (/.*\/gui\/?$/.exec(result))
        result = result.replace(/\/gui\/?$/, "");

    if (url.endsWith("/"))
        result = result.replace(/\/$/, "");

    if (!/^http?:\/\//.exec(result))
        result = "https://" + result;

    return result;
}

async function makeAPIURL(api, method) {
    const creds = await getStoredQbCreds()
    return `${adjustHostURL(creds.qbCreds.host)}/api/v2/${api}/${method}`;
}

async function makeDownloadURL(torrentId) {
    const yggPasskey = await getStoredYggPasskey();
    return `https://${windowLocation.host}/rss/download?id=${torrentId}&passkey=${yggPasskey}`;
}

async function postAPI(api, method) {
    const apiURL = await makeAPIURL(api, method);
    return fetch(apiURL, {method: "post"});
}

async function fetchAPI(api, method) {
    const apiURL = await makeAPIURL(api, method);
    return fetch(apiURL);
}

function fetchJSON(api, method) {
    return fetchAPI(api, method).then(r => r.json());
}

async function createSavePath(category) {
    const prefs = await fetchJSON("app", "preferences");
    let path = prefs.save_path;

    if (!path.endsWith("/") && !path.endsWith("\\"))
        path += "/"

    return path + category;
}

async function qbitLogin(qbCreds) {
    const url = await makeAPIURL('auth', 'login');

    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            "username": qbCreds.username,
            "password": qbCreds.password,
        })
    })

    if (!resp.ok || (await resp.text()) === "Fails.") {
        const error = new Error(`HTTP error: ${resp.status}`);
        error.addTorrentMessage = `Please check qBittorrent authentication credentials.`;
        throw error;
    }

    return true;
}

async function qbitAddTorrent(torrentId) {
    const link = await makeDownloadURL(torrentId);

    const url = await makeAPIURL('torrents', 'add');
    const form = await downloadFileAsForm(link, "torrents");

    const savePath = await createSavePath('tcd-torrent');
    form.append("savepath", savePath);

    await fetch(url, {
        method: 'POST',
        body: form
    }).then(async res => {
        if (res.status === 200) {
            console.log("added success");
        } else {
            alert('Please set your credentials in the extension options');
        }
    }).catch(err => {
        alert('Please set your credentials in the extension options');
    });

    await postAPI("auth", "logout");

    return true;
}

function extractFileName(response) {
    let fileName = response.headers.get("Content-Disposition");
    fileName = fileName? fileName.split(/filename\*?=/)[1]: null;
    if (fileName)
        fileName = fileName.replace(/"/g, "").replace(/'/g, "");
    else
        fileName = (new Date().getTime()) + ".torrent";

    return fileName;
}

async function downloadFileAsForm(link, formField) {
    try {
        const resp = await fetch(link);

        if (resp.ok) {
            const form = new FormData();
            const fileBlob = new Blob([await resp.arrayBuffer()]);
            const fileName = extractFileName(resp);
            form.append(formField, fileBlob, fileName);

            return form;
        }
        else {
            console.log(`HTTP error: ${resp.status}`)
        }
    }
    catch (e) {
        console.error(e);
        alert(`Error downloading torrent file.`);
    }
}
