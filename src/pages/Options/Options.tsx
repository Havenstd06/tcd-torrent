import React, { useState, useEffect, FC } from 'react';

import Label from '../../Components/Label';
import Input from '../../Components/Input';

interface Props {
  title: string;
}

const Options: FC<Props> = ({ title }: Props) => {
  useEffect(() => {
    document.body.classList.add('bg-primary', 'text-white');
  }, []);

  return (
    <div className={`h-screen bg-primary text-white`}>
      <div className="md:flex items-center justify-center h-full my-4">
        <div className="max-w-4xl w-full bg-secondary px-4 py-2 rounded-md shadow-lg">
          <div className="pb-2 border-b border-gray-200">
            <h1 className="text-2xl font-semibold tracking-wide">{title}</h1>
          </div>

          <div className="flex-col space-y-4 divide-y divide-gray-200">
            <Trackers />

            <Clients />

            <Others />
          </div>
        </div>
      </div>
    </div>
  );
};

const Trackers: Function = () => {
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-medium">Trackers</h2>

      <Yggtorrent />
    </div>
  );
};

const Yggtorrent: Function = () => {
  const [yggPasskey, setYggPasskey] = useState<string>('');

  useEffect(() => {
    chrome.storage.sync.get(['yggPasskey'], (result) => {
      if (result.yggPasskey) {
        setYggPasskey(result.yggPasskey);
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.sync.set({ yggPasskey: yggPasskey }, () => {});
  }, [yggPasskey]);

  return (
    <div>
      <h4 className="text-lg font-medium mt-2">YGGTorrent</h4>

      <div className="my-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="ygg-passkey">Passkey</Label>
            <Input
              className="mt-2"
              name="ygg-passkey"
              type="password"
              placeholder="YGGTorrent Passkey"
              onChange={(value: string) => setYggPasskey(value)}
              value={yggPasskey}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Clients: Function = () => {
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-medium">Clients</h2>

      <QBittorrent />
    </div>
  );
};

const QBittorrent: Function = () => {
  const [qbCreds, setQbCreds] = useState({
    host: '',
    username: '',
    password: '',
    hdCategory: 'tcd-hd',
    fhdCategory: 'tcd-4k',
  });

  useEffect(() => {
    chrome.storage.sync.get(['qbCreds'], (result) => {
      if (result.qbCreds) {
        setQbCreds(result.qbCreds);
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.sync.set({ qbCreds: qbCreds }, () => {});
  }, [qbCreds]);

  return (
    <div>
      <h4 className="text-lg font-medium mt-2">qBittorrent</h4>

      <div className="my-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="ip">Host (Domain or IP:Port) (Must be HTTPS)</Label>
            <Input
              className="mt-2"
              name="ip"
              type="text"
              placeholder="qbittorrent.domain.com"
              onChange={(value: string) =>
                setQbCreds({ ...qbCreds, host: value })
              }
              value={qbCreds.host}
            />
          </div>
          <div className="md:col-span-1"></div>
          <div className="md:col-span-2">
            <Label htmlFor="username">Username</Label>
            <Input
              className="mt-2"
              name="username"
              type="text"
              placeholder="admin"
              onChange={(value: string) =>
                setQbCreds({ ...qbCreds, username: value })
              }
              value={qbCreds.username}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="password">Password</Label>
            <Input
              className="mt-2"
              name="password"
              type="password"
              placeholder="password"
              onChange={(value: string) =>
                setQbCreds({ ...qbCreds, password: value })
              }
              value={qbCreds.password}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="hd-category">HD Category</Label>
            <Input
              className="mt-2"
              name="hd-category"
              type="text"
              placeholder="tcd-hd"
              onChange={(value: string) =>
                setQbCreds({ ...qbCreds, hdCategory: value })
              }
              value={qbCreds.hdCategory}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="fhd-category">4K Category</Label>
            <Input
              className="mt-2"
              name="fhd-category"
              type="text"
              placeholder="tcd-4k"
              onChange={(value: string) =>
                setQbCreds({ ...qbCreds, fhdCategory: value })
              }
              value={qbCreds.fhdCategory}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Others: Function = () => {
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-medium">Style</h2>

      <Style />
    </div>
  );
};

const Style: Function = () => {
  const [message, setMessage] = useState<string>('');
  const [style, setStyle] = useState({
    iconUrl: '',
  });

  useEffect(() => {
    chrome.storage.sync.get(['style'], (result) => {
      if (result.style) {
        setStyle(result.style);
      }
    });
  }, []);

  useEffect(() => {
    if (style.iconUrl) {
      if (!style.iconUrl.match(/^(http|https):\/\/[^ "]+$/)) {
        setMessage('Value is not a valid URL');
      } else {
        checkIfImageExists(style.iconUrl, (exists: boolean) => {
          if (!exists) {
            setMessage('Image does not exist');
          } else {
            setMessage('');

            chrome.storage.sync.set({ style: style }, () => {
              // console.log('updated qbCreds');
            });
          }
        });
      }
    } else {
      setMessage('');

      chrome.storage.sync.set({ style: style }, () => {
        // console.log('updated qbCreds');
      });
    }
  }, [style]);

  function checkIfImageExists(url: string, callback: Function) {
    const img = new Image();
    img.src = url;

    if (img.complete) {
      callback(true);
    } else {
      img.onload = () => {
        callback(true);
      };

      img.onerror = () => {
        callback(false);
      };
    }
  }

  return (
    <div>
      <div className="my-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="image-url">Icon URL (png, jpg, webp, gif)</Label>
            <Input
              className="mt-2"
              name="image-url"
              type="url"
              placeholder="https://i.imgur.com/..."
              onChange={(value: string) =>
                setStyle({ ...style, iconUrl: value })
              }
              value={style.iconUrl}
            />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-red-500">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Options;
