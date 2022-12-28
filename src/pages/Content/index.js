import { Toast } from './Toast.js';

chrome.storage.sync.get(['yggPasskey'], async function (value) {
  if (value.yggPasskey) {
    const style = {
      iconUrl: chrome.runtime.getURL('icon-34.png'),
    };

    const storedStyle = await getStoredStyle();

    if (storedStyle.iconUrl) {
      style.iconUrl = storedStyle.iconUrl;
    }

    /* Add a download button on each torrent line */
    await addDownloadButton(style);
  }
});

function addDownloadButton(style) {
  tableDownloadButton(style);

  detailPageDownloadButton(style);
}

function tableDownloadButton(style) {
  const tables = document.getElementsByTagName('table');

  if (tables.length === 0) {
    return false;
  }

  for (let t = 0; t < tables.length; t++) {
    const thead = tables[t].querySelector('thead');

    if (!thead || thead.querySelector('tr > th:nth-child(1)').innerHTML !== 'Type') {
      continue;
    }

    const tbody = tables[t].querySelector('tbody');
    const headerRow = tbody.querySelectorAll('tr');

    for (let r = 0; r < headerRow.length; r++) {
      const isTorrentTable = headerRow[r].querySelector('td:nth-child(2) > a');

      if (isTorrentTable) {
        const torrentId =
            headerRow[r].cells[2].children[0].getAttribute('target');
        const torrentName =
            headerRow[r].cells[1].children[0].innerHTML;

        const cell = headerRow[r].cells[1];

        const downloadButton = document.createElement('a');
        downloadButton.onclick = () => callBackgroundScript(torrentId, torrentName);
        const downloadIcon = document.createElement('img');
        downloadIcon.setAttribute('src', style.iconUrl);
        downloadIcon.setAttribute(
            'style',
            'margin-right: 10px;width: 25px;height: 25px;display: inline-block;border-radius: 9999px;'
        );

        downloadButton.appendChild(downloadIcon);
        cell.prepend(downloadButton);
      }
    }
  }
}

function detailPageDownloadButton(style) {
  const splitUrl = window.location.href.split('/');
  const torrentId = splitUrl[splitUrl.length - 1].split('-')[0];
  const torrentName = document.querySelector('#title > h1').innerHTML;

  const row = document.querySelector('#middle > main > div > div > section:nth-child(3) > div > table > tbody > tr:nth-child(1) > td:nth-child(2)');

  if (!row) {
    return false;
  }

  const downloadButton = document.createElement('a');
  downloadButton.classList.add('tcd-butt');
  downloadButton.innerHTML = 'Télécharger avec TCD Torrent';

  const downloadIcon = document.createElement('img');
  downloadIcon.setAttribute('src', style.iconUrl);
  downloadIcon.classList.add('tcd-butt-icon');

  downloadButton.onclick = () => callBackgroundScript(torrentId, torrentName);

  downloadButton.appendChild(downloadIcon);
  row.append(downloadButton);
}

function getStoredStyle() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['style'], function (value) {
      if (value.style) {
        resolve(value.style);
      } else {
        reject();

        return false;
      }
    });
  });
}

function callBackgroundScript(torrentId, torrentName) {
  chrome.runtime.sendMessage(
      {
        torrentId: torrentId,
        torrentName: torrentName,
        windowLocation: window.location,
      },
      function (res) {
        if (res) {
          if (res.success) {
            new Toast({
              message: res.message,
              type: 'success',
            });
          } else {
            new Toast({
              message: res.message,
              type: 'danger',
            });
          }

          return true;
        }

        new Toast({
          message: "Extension error, please check the console's logs",
          type: 'danger',
        });
      }
  );
}
