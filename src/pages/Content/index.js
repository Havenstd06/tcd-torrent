import { Toast } from './Toast.js';

chrome.storage.sync.get(['yggPasskey'], async function (value) {
  if (value.yggPasskey) {
    /* Add a download button on each torrent line */
    const tables = document.getElementsByTagName('table');

    for (let t = 0; t < tables.length; t++) {
      const tbody = tables[t].querySelector('tbody');
      const headerRow = tbody.querySelectorAll('tr');

      for (let r = 0; r < headerRow.length; r++) {
        const isTorrentTable = headerRow[r].querySelector(
          'td:nth-child(2) > a'
        );

        if (isTorrentTable) {
          const torrentId =
            headerRow[r].cells[2].children[0].getAttribute('target') ?? null;

          const cell = headerRow[r].cells[1];

          const downloadButton = document.createElement('a');
          downloadButton.onclick = () => {
            chrome.runtime.sendMessage(
              {
                torrentId: torrentId,
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
          };
          const downloadIcon = document.createElement('img');
          downloadIcon.setAttribute(
            'src',
            chrome.runtime.getURL('icon-34.png')
          );
          downloadIcon.setAttribute(
            'style',
            'margin-right: 10px;width: 25px;height: 25px;display: inline-block;'
          );

          downloadButton.appendChild(downloadIcon);
          cell.prepend(downloadButton);
        }
      }
    }
  }
});
