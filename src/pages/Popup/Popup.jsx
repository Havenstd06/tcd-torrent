import React, {useEffect} from 'react';
import './Popup.css';
import Options from "../Options/Options";

const Popup = () => {
    useEffect(() => {
        document.body.classList.add(
            'relative',
            'w-96',
            'h-10',
        );
    }, []);

  return <Options title={'TCD Torrent'} />;
};

export default Popup;
