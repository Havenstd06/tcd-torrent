let windowLocation = null;

chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
  if (req.torrentId && req.torrentName) {
    windowLocation = req.windowLocation;

    addToClient({
        id: req.torrentId,
        name: req.torrentName,
    }).then((r) => {
      // console.log(r);

      if (r) {
        sendResponse({
          success: true,
          message: 'Torrent added to qBittorrent',
        });
      }

      if (!r) {
        sendResponse({
          success: false,
          message: 'Error adding torrent to qBittorrent',
        });
      }

      qbitLogout().then(r => console.log('logged out'));
    }).catch((e) => {
        sendResponse({
            success: false,
            message: 'Error adding torrent to qBittorrent',
        });

        qbitLogout().then(r => console.log('logged out'));
    });

    return true;
  }
});

let creds = null;

async function initQbCreds() {
  const qbCreds = await getStoredQbCreds();

  if (!qbCreds || !qbCreds.host || !qbCreds.username || !qbCreds.password) {
    return false;
  }

  creds = qbCreds;

  // console.log('creds added', creds);
}

async function addToClient(torrent) {
  // console.log('adding torrent', torrent);

  await initQbCreds();

  await qbitLogin();

  await qbitAddTorrent(torrent);

  return true;
}

function getStoredQbCreds() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['qbCreds'], function (value) {
      if (value.qbCreds) {
        resolve(value.qbCreds);
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

  if (/.*\/gui\/?$/.exec(result)) result = result.replace(/\/gui\/?$/, '');

  if (url.endsWith('/')) result = result.replace(/\/$/, '');

  if (!/^http?:\/\//.exec(result)) result = 'https://' + result;

  return result;
}

async function makeAPIURL(api, method) {
  return `${adjustHostURL(creds.host)}/api/v2/${api}/${method}`;
}

async function makeDownloadURL(torrentId) {
  const yggPasskey = await getStoredYggPasskey();
  return `https://${windowLocation.host}/rss/download?id=${torrentId}&passkey=${yggPasskey}`;
}

async function postAPI(api, method) {
  const apiURL = await makeAPIURL(api, method);
  return fetch(apiURL, { method: 'post' });
}

async function fetchAPI(api, method) {
  const apiURL = await makeAPIURL(api, method);
  return fetch(apiURL);
}

function fetchJSON(api, method) {
  return fetchAPI(api, method).then((r) => r.json());
}

async function createSavePath(savePath) {
  // console.log('creating savePath', savePath);

  const prefs = await fetchJSON('app', 'preferences');
  let path = prefs.save_path;

  if (!path.endsWith('/') && !path.endsWith('\\')) path += '/';

  return path + savePath;
}

async function createCategory(torrentName) {
  // console.log('creating category', torrentName);

  let category = creds.hdCategory;

  if (torrentName.match(/4k|4K|uhd|UHD|2160p/gi)) {
    category = creds.uhdCategory;
  }

  return category;
}

async function qbitLogin() {
  await qbitLogout();

  const url = await makeAPIURL('auth', 'login');

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      username: creds.username,
      password: creds.password,
    }),
  });

  console.log('logged in');
  return !(!resp.ok || (await resp.text()) === 'Fails.');
}

function qbitLogout() {
  return postAPI('auth', 'logout');
}

async function qbitAddTorrent(torrent) {
  const link = await makeDownloadURL(torrent.id);

  const url = await makeAPIURL('torrents', 'add');
  const form = await downloadFileAsForm(link, 'torrents');

  const savePath = await createSavePath(creds.savePath ?? '');
  form.append('savepath', savePath);

  const category = await createCategory(torrent.name);
  form.append('category', category);

  // console.log('adding torrent', torrent.name, 'to', savePath, 'with category', category);

  await fetch(url, {
    method: 'POST',
    body: form,
  })
    .then(async (res) => {
      if (res.status === 200) {
        console.log('added success');
      } else {
        console.log('added failed', res);
      }
    })
    .catch((err) => {
      console.log(err);
    });

  await qbitLogout();

  return true;
}

function extractFileName(response) {
  let fileName = response.headers.get('Content-Disposition');
  fileName = fileName ? fileName.split(/filename\*?=/)[1] : null;
  if (fileName) fileName = fileName.replace(/"/g, '').replace(/'/g, '');
  else fileName = new Date().getTime() + '.torrent';

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
    } else {
      console.log(`HTTP error: ${resp.status}`);
    }
  } catch (e) {
    console.error(e);
    alert(`Error downloading torrent file.`);
  }
}
