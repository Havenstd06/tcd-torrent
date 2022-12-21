import React from 'react';

import Label from '../../Components/Label';
import Input from '../../Components/Input';

interface Props {
  title: string;
}

const Options: React.FC<Props> = ({ title }: Props) => {
  return (
      <div className={`h-screen bg-primary text-white`}>
        <div className="md:flex items-center justify-center h-full">
            <div className="max-w-4xl w-full bg-secondary p-4 rounded-md shadow-lg">
                <div className="pb-2 border-b border-gray-200">
                    <h1 className="text-2xl font-semibold tracking-wide">
                        {title}
                    </h1>
                </div>

                <div className="flex-col space-y-4 divide-y divide-gray-200">
                    <Trackers />

                    <Clients />
                </div>
            </div>
        </div>
      </div>
  );
};

const Trackers: Function = () => {
    return (
        <div className="pt-4">
            <h2 className="text-2xl font-medium">
                Trackers
            </h2>

            <Yggtorrent />
        </div>
    )
}

const Yggtorrent: Function = () => {
    const [yggPasskey, setYggPasskey] = React.useState<string>('');
    const handleYggPasskeyChange: Function = (value: string) => {
        if (! value && value.length <= 0) {
            return;
        }

        chrome.storage.sync.set({ yggPasskey: value }, () => {
            setYggPasskey(value);
        });
    }

    React.useEffect(() => {
        chrome.storage.sync.get(['yggPasskey'], (result) => {
            setYggPasskey(result.yggPasskey);
        });
    }, []);

    return (
        <div>
            <h4 className="text-lg font-medium mt-2">
                YGGTorrent
            </h4>

            <div className="my-2">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <Label htmlFor="ygg-passkey">
                            Passkey
                        </Label>
                        <Input
                            className="mt-2"
                            name="ygg-passkey"
                            type="password"
                            placeholder="YGGTorrent Passkey"
                            onChange={handleYggPasskeyChange}
                            value={yggPasskey}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

const Clients: Function = () => {
    return (
        <div className="pt-4">
            <h2 className="text-2xl font-medium">
                Clients
            </h2>

            <QBitorrent />
        </div>
    )
}

const QBitorrent: Function = () => {
    const [qbHost, setQbHost] = React.useState('');
    const [qbPort, setQbPort] = React.useState('');
    const [qbUsername, setQbUsername] = React.useState('');
    const [qbPassword, setQbPassword] = React.useState('');

    const handleQbHostChange: Function = (value: string) => {
        if (! value && value.length <= 0) {
            return;
        }

        chrome.storage.sync.set({ qbHost: value }, () => {
            setQbHost(value);
        });
    }

    const handleQbPortChange: Function = (value: string) => {
        if (! value && value.length <= 0) {
            return;
        }

        chrome.storage.sync.set({ qbPort: value }, () => {
            setQbPort(value);
        });
    }

    const handleQbUsernameChange: Function = (value: string) => {
        if (! value && value.length <= 0) {
            return;
        }

        chrome.storage.sync.set({ qbUsername: value }, () => {
            setQbUsername(value);
        });
    }

    const handleQbPasswordChange: Function = (value: string) => {
        if (! value && value.length <= 0) {
            return;
        }

        chrome.storage.sync.set({ qbPassword: value }, () => {
            setQbPassword(value);
        });
    }

    React.useEffect(() => {
        chrome.storage.sync.get(['qbHost'], (result) => {
            setQbHost(result.qbHost);
        });

        chrome.storage.sync.get(['qbPort'], (result) => {
            setQbPort(result.qbPort);
        });

        chrome.storage.sync.get(['qbUsername'], (result) => {
            setQbUsername(result.qbUsername);
        });

        chrome.storage.sync.get(['qbPassword'], (result) => {
            setQbPassword(result.qbPassword);
        });
    }, []);

    return (
        <div>
            <h4 className="text-lg font-medium mt-2">
                QBitorrent
            </h4>

            <div className="my-2">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-3">
                        <Label htmlFor="ip">
                            IP
                        </Label>
                        <Input
                            className="mt-2"
                            name="ip"
                            type="text"
                            placeholder="Client IP"
                            onChange={handleQbHostChange}
                            value={qbHost}
                        />
                    </div>
                    <div className="col-span-1">
                        <Label htmlFor="ip">
                            Port
                        </Label>
                        <Input
                            className="mt-2"
                            name="port"
                            type="number"
                            placeholder="Client Port"
                            onChange={handleQbPortChange}
                            value={qbPort}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <Label htmlFor="username">
                            Username
                        </Label>
                        <Input
                            className="mt-2"
                            name="username"
                            type="text"
                            placeholder="Client Username"
                            onChange={handleQbUsernameChange}
                            value={qbUsername}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <Label htmlFor="password">
                            Password
                        </Label>
                        <Input
                            className="mt-2"
                            name="password"
                            type="password"
                            placeholder="Client Password"
                            onChange={handleQbPasswordChange}
                            value={qbPassword}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Options;
